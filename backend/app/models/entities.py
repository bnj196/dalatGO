from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    full_name: Mapped[str] = mapped_column(String(150))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    role: Mapped[str] = mapped_column(String(30), default="CUSTOMER", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Tour(Base):
    __tablename__ = "tours"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    tour_type: Mapped[str] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer)
    base_price: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(30), default="DRAFT", index=True)
    departures: Mapped[list["Departure"]] = relationship(back_populates="tour", cascade="all, delete-orphan")
    reviews: Mapped[list["Review"]] = relationship(back_populates="tour", cascade="all, delete-orphan")


class Departure(Base):
    __tablename__ = "departures"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tour_id: Mapped[str] = mapped_column(ForeignKey("tours.id"), index=True)
    departure_date: Mapped[datetime] = mapped_column(Date)
    max_capacity: Mapped[int] = mapped_column(Integer)
    booked_capacity: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(30), default="OPEN", index=True)
    # Operations / dispatch fields
    guide_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    driver_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    vehicle_plate: Mapped[str | None] = mapped_column(String(20), nullable=True)
    vehicle_seats: Mapped[int] = mapped_column(Integer, default=16)
    meeting_point: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    tour: Mapped[Tour] = relationship(back_populates="departures")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="departure")


class Booking(Base):
    __tablename__ = "bookings"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    departure_id: Mapped[str] = mapped_column(ForeignKey("departures.id"), index=True)
    customer_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    # Customer contact (may differ from logged-in user)
    customer_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    customer_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    guest_count: Mapped[int] = mapped_column(Integer)
    pickup_location: Mapped[str] = mapped_column(String(255))
    # Pricing
    total_amount: Mapped[float] = mapped_column(Float)
    deposit_amount: Mapped[float] = mapped_column(Float, default=0.0)
    balance_due: Mapped[float] = mapped_column(Float, default=0.0)
    discount_amount: Mapped[float] = mapped_column(Float, default=0.0)
    promo_code: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # Add-ons stored as JSON array string, e.g. '["addon-1","addon-2"]'
    addons: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Status & audit
    status: Mapped[str] = mapped_column(String(40), default="PENDING_PAYMENT", index=True)
    # Passenger manifest — checked_in flag stored per booking
    checked_in: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    departure: Mapped[Departure] = relationship(back_populates="bookings")


class Review(Base):
    __tablename__ = "reviews"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tour_id: Mapped[str] = mapped_column(ForeignKey("tours.id"), index=True)
    booking_code: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    user_name: Mapped[str] = mapped_column(String(150))
    rating: Mapped[float] = mapped_column(Float)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    tour: Mapped[Tour] = relationship(back_populates="reviews")

    @property
    def date(self) -> str:
        return self.created_at.strftime("%d/%m/%Y")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    actor_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(80))
    entity_type: Mapped[str] = mapped_column(String(50))
    entity_id: Mapped[str] = mapped_column(String(36))
    detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
