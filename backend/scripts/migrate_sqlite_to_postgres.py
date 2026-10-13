import os
import sys
from collections import OrderedDict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import Session

from app.db.base import Base
from app.models import AuditLog, Booking, Departure, Tour, User

TABLES = [User, Tour, Departure, Booking, AuditLog]


def make_url() -> str:
    required = ["PGHOST", "PGPORT", "PGDATABASE", "PGUSER", "PGPASSWORD"]
    missing = [name for name in required if not os.getenv(name)]
    if missing:
        raise RuntimeError(f"Missing environment variables: {', '.join(missing)}")
    return (
        f"postgresql+psycopg://{os.environ['PGUSER']}:{os.environ['PGPASSWORD']}"
        f"@{os.environ['PGHOST']}:{os.environ['PGPORT']}/{os.environ['PGDATABASE']}"
        "?sslmode=require"
    )


def copy_rows(source: Session, target: Session, model) -> int:
    rows = source.query(model).all()
    if not rows:
        return 0
    target.bulk_insert_mappings(model, [{column.name: getattr(row, column.name) for column in model.__table__.columns} for row in rows])
    return len(rows)


def main() -> None:
    sqlite_path = Path(os.getenv("SQLITE_PATH", "dalat_go.db"))
    if not sqlite_path.exists():
        raise FileNotFoundError(sqlite_path)

    source_engine = create_engine(f"sqlite:///{sqlite_path.resolve()}")
    target_engine = create_engine(make_url(), pool_pre_ping=True)
    Base.metadata.create_all(target_engine)

    counts = OrderedDict()
    with Session(source_engine) as source, Session(target_engine) as target:
        # Safe rerun: only copy missing primary keys, never overwrite production data.
        for model in TABLES:
            existing_ids = {row[0] for row in target.execute(text(f"SELECT id FROM {model.__tablename__}"))}
            rows = source.query(model).all()
            pending = [row for row in rows if row.id not in existing_ids]
            if pending:
                target.bulk_insert_mappings(model, [{column.name: getattr(row, column.name) for column in model.__table__.columns} for row in pending])
            counts[model.__tablename__] = {"sqlite": len(rows), "inserted": len(pending), "postgresql": len(existing_ids) + len(pending)}
        target.commit()

    print("Migration completed")
    for table, result in counts.items():
        print(f"{table}: sqlite={result['sqlite']} inserted={result['inserted']} postgresql={result['postgresql']}")


if __name__ == "__main__":
    main()
