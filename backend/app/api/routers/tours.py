from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Tour
from app.schemas import TourRead

router = APIRouter(prefix="/tours", tags=["tours"])


@router.get("", response_model=list[TourRead])
def public_tours(search: str | None = Query(default=None), db: Session = Depends(get_db)):
    query = select(Tour).where(Tour.status == "PUBLISHED")
    if search:
        query = query.where(Tour.name.ilike(f"%{search}%"))
    return list(db.scalars(query.order_by(Tour.name)).all())
