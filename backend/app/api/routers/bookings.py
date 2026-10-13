from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_roles
from app.db.session import get_db
from app.models import Booking, Departure, User
from app.schemas import BookingCreate, BookingRead

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    departure = db.get(Departure, payload.departure_id)
    if not departure or departure.status != "OPEN":
        raise HTTPException(status_code=404, detail="Departure is not available")
    if departure.booked_capacity + payload.guest_count > departure.max_capacity:
        raise HTTPException(status_code=409, detail="Not enough remaining capacity")
    departure.booked_capacity += payload.guest_count
    if departure.booked_capacity == departure.max_capacity:
        departure.status = "FULL"
    total_amount = payload.guest_count * departure.tour.base_price
    booking = Booking(code=f"DLG-{uuid4().hex[:8].upper()}", customer_id=user.id, total_amount=total_amount, **payload.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/mine", response_model=list[BookingRead])
def my_bookings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return list(db.scalars(select(Booking).where(Booking.customer_id == user.id).order_by(Booking.created_at.desc())).all())


@router.get("", response_model=list[BookingRead])
def list_bookings(db: Session = Depends(get_db), _: User = Depends(require_roles("ADMIN", "SALE", "OPERATIONS", "ACCOUNTING", "MANAGER"))):
    return list(db.scalars(select(Booking).order_by(Booking.created_at.desc())).all())
