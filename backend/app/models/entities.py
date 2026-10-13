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


class Departure(Base):
    __tablename__ = "departures"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    tour_id: Mapped[str] = mapped_column(ForeignKey("tours.id"), index=True)
    departure_date: Mapped[datetime] = mapped_column(Date)
    max_capacity: Mapped[int] = mapped_column(Integer)
    booked_capacity: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(30), default="OPEN", index=True)
    tour: Mapped[Tour] = relationship(back_populates="departures")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="departure")


class Booking(Base):
    __tablename__ = "bookings"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    departure_id: Mapped[str] = mapped_column(ForeignKey("departures.id"), index=True)
    customer_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    guest_count: Mapped[int] = mapped_column(Integer)
    pickup_location: Mapped[str] = mapped_column(String(255))
    total_amount: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(40), default="PENDING_PAYMENT", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    departure: Mapped[Departure] = relationship(back_populates="bookings")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    actor_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(80))
    entity_type: Mapped[str] = mapped_column(String(50))
    entity_id: Mapped[str] = mapped_column(String(36))
    detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
