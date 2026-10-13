from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routers import admin, auth, bookings, departures, dispatches, reviews, tours
from app.core.config import settings
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.services.seed import seed_admin, seed_demo_data

# Import models before create_all so SQLAlchemy registers every table.
from app import models  # noqa: F401,E402

app = FastAPI(title=settings.app_name, version="0.1.0", description="DALAT Go tour management HTTP API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def ensure_schema_migrations(eng):
    """Automatically adds missing columns to existing SQLite / PostgreSQL tables without data loss."""
    columns_to_add = [
        ("departures", "guide_name", "VARCHAR(150)"),
        ("departures", "driver_name", "VARCHAR(150)"),
        ("departures", "vehicle_plate", "VARCHAR(20)"),
        ("departures", "vehicle_seats", "INTEGER DEFAULT 16"),
        ("departures", "meeting_point", "VARCHAR(255)"),
        ("departures", "notes", "TEXT"),
        ("bookings", "customer_name", "VARCHAR(150)"),
        ("bookings", "customer_phone", "VARCHAR(30)"),
        ("bookings", "deposit_amount", "FLOAT DEFAULT 0.0"),
        ("bookings", "balance_due", "FLOAT DEFAULT 0.0"),
        ("bookings", "discount_amount", "FLOAT DEFAULT 0.0"),
        ("bookings", "promo_code", "VARCHAR(50)"),
        ("bookings", "addons", "TEXT"),
        ("bookings", "checked_in", "BOOLEAN DEFAULT 0"),
    ]
    with eng.connect() as conn:
        for table, col, col_type in columns_to_add:
            try:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}"))
                conn.commit()
            except Exception:
                pass


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    ensure_schema_migrations(engine)
    db = SessionLocal()
    try:
        admin_user = seed_admin(db)
        seed_demo_data(db, admin_user)
    finally:
        db.close()


@app.get("/", tags=["system"])
def root():
    return {"service": settings.app_name, "status": "ok", "docs": "/docs", "health": "/health"}


@app.get("/health", tags=["system"])
def health():
    return {"status": "ok", "service": settings.app_name}


app.include_router(auth.router, prefix="/api/v1")
app.include_router(tours.router, prefix="/api/v1")
app.include_router(departures.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(dispatches.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
