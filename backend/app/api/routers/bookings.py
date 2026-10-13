from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_optional_current_user, require_roles
from app.core.security import hash_password
from app.db.session import get_db
from app.models import Booking, Departure, User
from app.schemas import (
    BookingCreate,
    BookingRead,
    CancelRequest,
    PaymentConfirmRequest,
)

router = APIRouter(prefix="/bookings", tags=["bookings"])

PROMO_CODES: dict[str, float] = {
    "DALAT2026": 100_000,
    "CHILLDALAT": 150_000,
    "WELCOME10": 80_000,
}


def _get_or_create_guest_user(db: Session, name: Optional[str] = None, phone: Optional[str] = None) -> User:
    email = f"guest_{phone}@dalatgo.local" if phone else "guest@dalatgo.local"
    user = db.scalar(select(User).where(User.email == email))
    if not user:
        user = User(
            full_name=name or "Khách hàng Vãng lai",
            email=email,
            password_hash=hash_password(uuid4().hex),
            role="CUSTOMER",
        )
        db.add(user)
        db.flush()
    return user


def _calculate_totals(
    base_price: float, guest_count: int, promo_code: Optional[str], extra_discount: float
) -> tuple[float, float, float, float]:
    gross = base_price * guest_count
    discount = extra_discount
    if guest_count >= 4:
        discount += gross * 0.05
    if promo_code and promo_code.upper() in PROMO_CODES:
        discount += PROMO_CODES[promo_code.upper()]
    discount = min(discount, gross)
    total = gross - discount
    deposit = round(total * 0.5, 0)
    balance = round(total - deposit, 0)
    return round(total, 0), deposit, balance, round(discount, 0)


# ---------------------------------------------------------------------------
# POST /bookings
# ---------------------------------------------------------------------------
@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user),
):
    departure = db.get(Departure, payload.departure_id)
    if not departure or departure.status not in ("OPEN", "FULL"):
        raise HTTPException(status_code=404, detail="Departure is not available")
    if departure.status == "FULL":
        raise HTTPException(status_code=409, detail="Departure is fully booked")
    if departure.booked_capacity + payload.guest_count > departure.max_capacity:
        raise HTTPException(status_code=409, detail="Not enough remaining capacity")

    departure.booked_capacity += payload.guest_count
    if departure.booked_capacity >= departure.max_capacity:
        departure.status = "FULL"

    # Assign customer_id
    if user:
        customer_id = user.id
        default_name = user.full_name
    else:
        guest_user = _get_or_create_guest_user(db, payload.customer_name, payload.customer_phone)
        customer_id = guest_user.id
        default_name = "Khách hàng"

    base_price = departure.tour.base_price

    if payload.total_amount is not None:
        total = payload.total_amount
        discount = payload.discount_amount
        deposit = round(total * 0.5, 0)
        balance = round(total - deposit, 0)
    else:
        total, deposit, balance, discount = _calculate_totals(
            base_price, payload.guest_count, payload.promo_code, payload.discount_amount
        )

    booking = Booking(
        code=f"DLG-{uuid4().hex[:8].upper()}",
        customer_id=customer_id,
        departure_id=payload.departure_id,
        guest_count=payload.guest_count,
        pickup_location=payload.pickup_location,
        customer_name=payload.customer_name or default_name,
        customer_phone=payload.customer_phone,
        addons=payload.addons if isinstance(payload.addons, str) else None,
        promo_code=payload.promo_code.upper() if payload.promo_code else None,
        total_amount=total,
        deposit_amount=deposit,
        balance_due=balance,
        discount_amount=discount,
        status="PENDING_PAYMENT",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


# ---------------------------------------------------------------------------
# GET /bookings/lookup
# ---------------------------------------------------------------------------
@router.get("/lookup", response_model=BookingRead)
def lookup_booking(
    code: str = Query(..., description="Booking code e.g. DLG-ABCD1234"),
    phone: Optional[str] = Query(None, description="Optional customer phone number"),
    db: Session = Depends(get_db),
):
    clean_code = code.strip().upper()
    booking = db.scalar(select(Booking).where(Booking.code == clean_code))
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if phone and phone.strip():
        clean_phone = phone.strip()
        if not booking.customer_phone or clean_phone not in booking.customer_phone:
            raise HTTPException(status_code=403, detail="Số điện thoại không khớp với mã booking")

    return booking


# ---------------------------------------------------------------------------
# GET /bookings/mine
# ---------------------------------------------------------------------------
@router.get("/mine", response_model=list[BookingRead])
def my_bookings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return list(
        db.scalars(
            select(Booking)
            .where(Booking.customer_id == user.id)
            .order_by(Booking.created_at.desc())
        ).all()
    )


# ---------------------------------------------------------------------------
# GET /bookings (admin/staff)
# ---------------------------------------------------------------------------
@router.get("", response_model=list[BookingRead])
def list_bookings(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("ADMIN", "SALE", "OPERATIONS", "ACCOUNTING", "MANAGER")),
):
    return list(db.scalars(select(Booking).order_by(Booking.created_at.desc())).all())


# ---------------------------------------------------------------------------
# POST /bookings/{code}/confirm-payment
# ---------------------------------------------------------------------------
@router.post("/{code}/confirm-payment", response_model=BookingRead)
def confirm_payment(
    code: str,
    payload: Optional[PaymentConfirmRequest] = None,
    db: Session = Depends(get_db),
):
    clean_code = code.strip().upper()
    booking = db.scalar(select(Booking).where(Booking.code == clean_code))
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = "CONFIRMED"
    booking.deposit_amount = booking.total_amount
    booking.balance_due = 0.0
    db.commit()
    db.refresh(booking)
    return booking


# ---------------------------------------------------------------------------
# POST /bookings/{code}/cancel-request
# ---------------------------------------------------------------------------
@router.post("/{code}/cancel-request", response_model=BookingRead)
def cancel_request(
    code: str,
    payload: Optional[CancelRequest] = None,
    db: Session = Depends(get_db),
):
    clean_code = code.strip().upper()
    booking = db.scalar(select(Booking).where(Booking.code == clean_code))
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status in ("CANCELLED", "COMPLETED"):
        raise HTTPException(status_code=409, detail=f"Booking is already {booking.status.lower()}")

    booking.status = "CANCEL_REQUESTED"
    db.commit()
    db.refresh(booking)
    return booking
