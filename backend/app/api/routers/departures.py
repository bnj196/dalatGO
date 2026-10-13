from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Departure
from app.schemas import DepartureRead

router = APIRouter(prefix="/departures", tags=["departures"])


@router.get("", response_model=list[DepartureRead])
def public_departures(db: Session = Depends(get_db)):
    return list(db.scalars(select(Departure).where(Departure.status.in_(["OPEN", "FULL"]))).all())
