import json
from datetime import date, datetime
from typing import Any, Optional, Union

from pydantic import BaseModel, ConfigDict, Field, field_validator


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8)
    role: str = "CUSTOMER"


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    email: str
    role: str
    is_active: bool


# ---------------------------------------------------------------------------
# Tours
# ---------------------------------------------------------------------------

class TourCreate(BaseModel):
    code: str = Field(min_length=2, max_length=50)
    name: str = Field(min_length=2, max_length=200)
    tour_type: str = Field(min_length=2, max_length=50)
    description: Optional[str] = None
    duration_minutes: int = Field(gt=0)
    base_price: float = Field(ge=0)
    status: str = "DRAFT"


class TourRead(TourCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str


# ---------------------------------------------------------------------------
# Departures
# ---------------------------------------------------------------------------

class DepartureCreate(BaseModel):
    tour_id: str
    departure_date: date
    max_capacity: int = Field(gt=0)
    status: str = "OPEN"
    guide_name: Optional[str] = None
    driver_name: Optional[str] = None
    vehicle_plate: Optional[str] = None
    vehicle_seats: int = 16
    meeting_point: Optional[str] = None
    notes: Optional[str] = None


class DepartureRead(DepartureCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str
    booked_capacity: int


# ---------------------------------------------------------------------------
# Bookings
# ---------------------------------------------------------------------------

class BookingCreate(BaseModel):
    departure_id: str
    guest_count: int = Field(gt=0)
    pickup_location: str = Field(min_length=2, max_length=255)
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    addons: Optional[Union[list[str], str]] = None
    promo_code: Optional[str] = None
    discount_amount: float = 0.0
    total_amount: Optional[float] = None

    @field_validator("addons", mode="before")
    @classmethod
    def serialize_addons(cls, v: Any) -> Optional[str]:
        if isinstance(v, list):
            return json.dumps(v, ensure_ascii=False)
        return v


class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    code: str
    departure_id: str
    customer_id: str
    guest_count: int
    pickup_location: str
    total_amount: float
    deposit_amount: float = 0.0
    balance_due: float = 0.0
    discount_amount: float = 0.0
    promo_code: Optional[str] = None
    addons: Optional[Union[list[str], str]] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    status: str
    checked_in: bool = False
    created_at: Optional[datetime] = None

    @field_validator("addons", mode="before")
    @classmethod
    def parse_addons(cls, v: Any) -> Optional[list[str]]:
        if isinstance(v, str):
            try:
                data = json.loads(v)
                if isinstance(data, list):
                    return data
                return [str(data)]
            except Exception:
                return [v] if v else []
        return v


class PaymentConfirmRequest(BaseModel):
    method: str = "VIETQR"
    note: Optional[str] = None


class CancelRequest(BaseModel):
    reason: Optional[str] = "Kế hoạch cá nhân thay đổi"


# ---------------------------------------------------------------------------
# Reviews
# ---------------------------------------------------------------------------

class ReviewCreate(BaseModel):
    tour_id: str
    booking_code: Optional[str] = None
    user_name: str = Field(min_length=2, max_length=150)
    rating: float = Field(ge=1, le=5)
    comment: Optional[str] = None
    verified: bool = True


class ReviewRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    tour_id: str
    booking_code: Optional[str] = None
    user_name: str
    rating: float
    comment: Optional[str] = None
    verified: bool = True
    date: Optional[str] = None
    created_at: Optional[datetime] = None

    @field_validator("date", mode="before")
    @classmethod
    def set_date_string(cls, v: Any, info: Any) -> Optional[str]:
        if v:
            return str(v)
        return None


# ---------------------------------------------------------------------------
# Dispatch / Manifest
# ---------------------------------------------------------------------------

class CostEstimate(BaseModel):
    vehicle_cost: float = 1200000
    guide_fee: float = 700000
    ticket_costs: float = 800000
    other_costs: float = 300000


class PassengerRecord(BaseModel):
    id: str
    booking_code: str
    name: str
    phone: str
    guest_count: int
    pickup_location: str
    status: str = "PENDING"  # PENDING | PICKED_UP | NO_SHOW
    balance_due: float = 0.0
    is_paid_full: bool = False
    notes: Optional[str] = None


class DispatchRead(BaseModel):
    departure_id: str
    tour_code: str
    tour_name: str
    departure_date: str
    guide_name: str = "Chưa phân công"
    driver_name: str = "Chưa phân công"
    vehicle_plate: str = "Chưa phân công"
    vehicle_seats: int = 16
    total_guests: int = 0
    passengers: list[PassengerRecord] = Field(default_factory=list)
    cost_estimate: CostEstimate = Field(default_factory=CostEstimate)


class PassengerStatusUpdate(BaseModel):
    status: str = "PICKED_UP"  # PENDING | PICKED_UP | NO_SHOW
    balance_collected: bool = False


class ResourceUpdate(BaseModel):
    guide_name: Optional[str] = None
    driver_name: Optional[str] = None
    vehicle_plate: Optional[str] = None
    vehicle_seats: Optional[int] = 16


# ---------------------------------------------------------------------------
# Admin Dashboard
# ---------------------------------------------------------------------------

class DashboardRead(BaseModel):
    users: int
    tours: int
    departures: int
    bookings: int
    pending_bookings: int
    confirmed_bookings: int
    revenue_total: float
