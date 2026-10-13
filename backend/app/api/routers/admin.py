from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.dependencies import require_roles
from app.core.security import hash_password
from app.db.session import get_db
from app.models import AuditLog, Booking, Departure, Tour, User
from app.schemas import DashboardRead, DepartureCreate, DepartureRead, TourCreate, TourRead, UserCreate, UserRead

router = APIRouter(prefix="/admin", tags=["admin"])
admin_user = require_roles("ADMIN")


def audit(db: Session, actor: User, action: str, entity_type: str, entity_id: str, detail: str = ""):
    db.add(AuditLog(actor_user_id=actor.id, action=action, entity_type=entity_type, entity_id=entity_id, detail=detail))


@router.get("/dashboard", response_model=DashboardRead)
def dashboard(db: Session = Depends(get_db), _: User = Depends(admin_user)):
    return DashboardRead(
        users=db.scalar(select(func.count()).select_from(User)) or 0,
        tours=db.scalar(select(func.count()).select_from(Tour)) or 0,
        departures=db.scalar(select(func.count()).select_from(Departure)) or 0,
        bookings=db.scalar(select(func.count()).select_from(Booking)) or 0,
        pending_bookings=db.scalar(select(func.count()).select_from(Booking).where(Booking.status == "PENDING_PAYMENT")) or 0,
        confirmed_bookings=db.scalar(select(func.count()).select_from(Booking).where(Booking.status == "CONFIRMED")) or 0,
        revenue_total=float(db.scalar(select(func.coalesce(func.sum(Booking.total_amount), 0.0)).where(Booking.status == "CONFIRMED")) or 0.0),
    )


@router.get("/users", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db), _: User = Depends(admin_user)):
    return list(db.scalars(select(User).order_by(User.created_at.desc())).all())


@router.post("/users", response_model=UserRead, status_code=201)
def create_user(payload: UserCreate, db: Session = Depends(get_db), actor: User = Depends(admin_user)):
    if db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(status_code=409, detail="Email already exists")
    allowed_roles = {"CUSTOMER", "SALE", "OPERATIONS", "GUIDE", "ACCOUNTING", "MANAGER", "ADMIN", "PARTNER"}
    if payload.role not in allowed_roles:
        raise HTTPException(status_code=422, detail="Unsupported role")
    user = User(full_name=payload.full_name, email=payload.email, password_hash=hash_password(payload.password), role=payload.role)
    db.add(user)
    db.flush()
    audit(db, actor, "CREATE", "User", user.id, f"role={user.role}")
    db.commit()
    db.refresh(user)
    return user


@router.patch("/users/{user_id}/status", response_model=UserRead)
def set_user_status(user_id: str, is_active: bool, db: Session = Depends(get_db), actor: User = Depends(admin_user)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == actor.id and not is_active:
        raise HTTPException(status_code=400, detail="Admin cannot deactivate itself")
    user.is_active = is_active
    audit(db, actor, "UPDATE_STATUS", "User", user.id, f"is_active={is_active}")
    db.commit()
    db.refresh(user)
    return user


@router.get("/audit-logs")
def audit_logs(db: Session = Depends(get_db), _: User = Depends(admin_user)):
    return list(db.scalars(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(200)).all())


@router.post("/tours", response_model=TourRead, status_code=201)
def create_tour(payload: TourCreate, db: Session = Depends(get_db), actor: User = Depends(admin_user)):
    if db.scalar(select(Tour).where(Tour.code == payload.code)):
        raise HTTPException(status_code=409, detail="Tour code already exists")
    tour = Tour(**payload.model_dump(), created_by=actor.id)
    db.add(tour)
    db.flush()
    audit(db, actor, "CREATE", "Tour", tour.id, tour.code)
    db.commit()
    db.refresh(tour)
    return tour


@router.get("/tours", response_model=list[TourRead])
def list_tours(db: Session = Depends(get_db), _: User = Depends(admin_user)):
    return list(db.scalars(select(Tour).order_by(Tour.name)).all())


@router.post("/departures", response_model=DepartureRead, status_code=201)
def create_departure(payload: DepartureCreate, db: Session = Depends(get_db), actor: User = Depends(admin_user)):
    if not db.get(Tour, payload.tour_id):
        raise HTTPException(status_code=404, detail="Tour not found")
    departure = Departure(**payload.model_dump())
    db.add(departure)
    db.flush()
    audit(db, actor, "CREATE", "Departure", departure.id)
    db.commit()
    db.refresh(departure)
    return departure


@router.get("/departures", response_model=list[DepartureRead])
def list_departures(db: Session = Depends(get_db), _: User = Depends(admin_user)):
    return list(db.scalars(select(Departure).order_by(Departure.departure_date)).all())
