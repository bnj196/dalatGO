from datetime import date
from pydantic import BaseModel, ConfigDict, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


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


class TourCreate(BaseModel):
    code: str = Field(min_length=2, max_length=50)
    name: str = Field(min_length=2, max_length=200)
    tour_type: str = Field(min_length=2, max_length=50)
    description: str | None = None
    duration_minutes: int = Field(gt=0)
    base_price: float = Field(ge=0)
    status: str = "DRAFT"


class TourRead(TourCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str


class DepartureCreate(BaseModel):
    tour_id: str
    departure_date: date
    max_capacity: int = Field(gt=0)
    status: str = "OPEN"


class DepartureRead(DepartureCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str
    booked_capacity: int


class BookingCreate(BaseModel):
    departure_id: str
    guest_count: int = Field(gt=0)
    pickup_location: str = Field(min_length=2, max_length=255)


class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    code: str
    departure_id: str
    customer_id: str
    guest_count: int
    pickup_location: str
    total_amount: float
    status: str


class DashboardRead(BaseModel):
    users: int
    tours: int
    departures: int
    bookings: int
    pending_bookings: int
