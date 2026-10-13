from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_optional_current_user
from app.db.session import get_db
from app.models import Booking, Departure, Tour, User
from app.schemas import CostEstimate, DispatchRead, PassengerRecord, PassengerStatusUpdate, ResourceUpdate

router = APIRouter(prefix="/admin/dispatches", tags=["dispatches"])


def _build_dispatch_record(departure: Departure) -> DispatchRead:
    passengers: list[PassengerRecord] = []
    total_guests = 0

    for b in departure.bookings:
        total_guests += b.guest_count
        pass_status = "PICKED_UP" if b.checked_in else "PENDING"
        passengers.append(
            PassengerRecord(
                id=b.id,
                booking_code=b.code,
                name=b.customer_name or "Khách hàng",
                phone=b.customer_phone or "",
                guest_count=b.guest_count,
                pickup_location=b.pickup_location,
                status=pass_status,
                balance_due=b.balance_due,
                is_paid_full=(b.balance_due <= 0),
                notes=b.addons,
            )
        )

    # Cost estimate based on scale
    vehicle_cost = 1_200_000 if departure.vehicle_seats <= 16 else 1_800_000
    guide_fee = 700_000
    ticket_costs = total_guests * 100_000
    other_costs = 300_000

    return DispatchRead(
        departure_id=departure.id,
        tour_code=departure.tour.code if departure.tour else "DL-TOUR",
        tour_name=departure.tour.name if departure.tour else "Chuyến đi Đà Lạt",
        departure_date=departure.departure_date.strftime("%Y-%m-%d"),
        guide_name=departure.guide_name or "Chưa phân công",
        driver_name=departure.driver_name or "Chưa phân công",
        vehicle_plate=departure.vehicle_plate or "Chưa phân công",
        vehicle_seats=departure.vehicle_seats or 16,
        total_guests=total_guests,
        passengers=passengers,
        cost_estimate=CostEstimate(
            vehicle_cost=vehicle_cost,
            guide_fee=guide_fee,
            ticket_costs=ticket_costs,
            other_costs=other_costs,
        ),
    )


@router.get("", response_model=list[DispatchRead])
def list_dispatches(
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user),
):
    departures = list(db.scalars(select(Departure).order_by(Departure.departure_date)).all())
    return [_build_dispatch_record(dep) for dep in departures]


@router.patch("/{departure_id}/passengers/{passenger_id}", response_model=list[DispatchRead])
@router.put("/{departure_id}/passengers/{passenger_id}", response_model=list[DispatchRead])
def update_passenger(
    departure_id: str,
    passenger_id: str,
    payload: PassengerStatusUpdate,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user),
):
    booking = db.get(Booking, passenger_id)
    if not booking:
        # Try finding by code
        booking = db.scalar(select(Booking).where(Booking.code == passenger_id))
    if not booking:
        raise HTTPException(status_code=404, detail="Passenger booking not found")

    if payload.status == "PICKED_UP":
        booking.checked_in = True
    elif payload.status in ("NO_SHOW", "PENDING"):
        booking.checked_in = False

    if payload.balance_collected:
        booking.balance_due = 0.0

    db.commit()

    # Return full updated list
    departures = list(db.scalars(select(Departure).order_by(Departure.departure_date)).all())
    return [_build_dispatch_record(dep) for dep in departures]


@router.patch("/{departure_id}/resources", response_model=list[DispatchRead])
@router.put("/{departure_id}/resources", response_model=list[DispatchRead])
def assign_resources(
    departure_id: str,
    payload: ResourceUpdate,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user),
):
    departure = db.get(Departure, departure_id)
    if not departure:
        raise HTTPException(status_code=404, detail="Departure not found")

    if payload.guide_name is not None:
        departure.guide_name = payload.guide_name
    if payload.driver_name is not None:
        departure.driver_name = payload.driver_name
    if payload.vehicle_plate is not None:
        departure.vehicle_plate = payload.vehicle_plate
    if payload.vehicle_seats is not None:
        departure.vehicle_seats = payload.vehicle_seats

    db.commit()

    # Return full updated list
    departures = list(db.scalars(select(Departure).order_by(Departure.departure_date)).all())
    return [_build_dispatch_record(dep) for dep in departures]
