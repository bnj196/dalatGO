from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models import Booking, Departure, Tour, User


DEMO_TOURS = [
    {
        "code": "DL-01",
        "name": "Săn mây Cầu Đất & đồi chè xanh",
        "tour_type": "NATURE",
        "description": "Bình minh trên đồi chè, biển mây Cầu Đất và một buổi sáng thật chậm giữa cao nguyên.",
        "duration_minutes": 480,
        "base_price": 690000,
    },
    {
        "code": "DL-02",
        "name": "Ba thác hoang sơ Đà Lạt",
        "tour_type": "ADVENTURE",
        "description": "Khám phá Datanla, Prenn và Pongour trong hành trình dành cho người yêu thiên nhiên.",
        "duration_minutes": 600,
        "base_price": 890000,
    },
    {
        "code": "DL-03",
        "name": "Đà Lạt bình yên: cà phê & hoàng hôn",
        "tour_type": "CHILL",
        "description": "Một ngày thư thả qua những quán cà phê có view đẹp, nhà ga cổ và đồi hoàng hôn.",
        "duration_minutes": 420,
        "base_price": 590000,
    },
    {
        "code": "DL-04",
        "name": "Check-in Đà Lạt: hoa, ga cổ & quảng trường",
        "tour_type": "CITY",
        "description": "Đi qua những biểu tượng không thể bỏ lỡ của thành phố ngàn hoa trong một ngày.",
        "duration_minutes": 480,
        "base_price": 620000,
    },
    {
        "code": "DL-05",
        "name": "Cắm trại bên hồ Tuyền Lâm",
        "tour_type": "CAMPING",
        "description": "Rời phố thị, dựng lều bên hồ, ngắm sao và thức dậy cùng rừng thông.",
        "duration_minutes": 1440,
        "base_price": 1290000,
    },
    {
        "code": "DL-06",
        "name": "Vườn dâu & nông trại địa phương",
        "tour_type": "FAMILY",
        "description": "Trải nghiệm hái dâu, thăm nông trại và thưởng thức đặc sản phù hợp cho gia đình.",
        "duration_minutes": 360,
        "base_price": 520000,
    },
    {
        "code": "DL-07",
        "name": "Trekking Langbiang đón bình minh",
        "tour_type": "TREKKING",
        "description": "Chinh phục cung đường Langbiang cùng hướng dẫn viên địa phương và ngắm bình minh.",
        "duration_minutes": 540,
        "base_price": 990000,
    },
    {
        "code": "DL-08",
        "name": "Ẩm thực Đà Lạt về đêm",
        "tour_type": "FOOD",
        "description": "Ăn như người bản địa với bánh căn, lẩu gà lá é, sữa đậu nành và chợ đêm.",
        "duration_minutes": 300,
        "base_price": 450000,
    },
    {
        "code": "DL-09",
        "name": "Nghỉ dưỡng villa giữa rừng thông",
        "tour_type": "RESORT",
        "description": "Hai ngày một đêm nghỉ tại villa, dùng bữa địa phương và tận hưởng không khí cao nguyên.",
        "duration_minutes": 2880,
        "base_price": 2490000,
    },
    {
        "code": "DL-10",
        "name": "Đà Lạt bằng xe máy: cung đường đèo",
        "tour_type": "MOTORBIKE",
        "description": "Chạy qua những cung đường đẹp nhất quanh Đà Lạt cùng tài xế bản địa giàu kinh nghiệm.",
        "duration_minutes": 600,
        "base_price": 790000,
    },
    {
        "code": "DL-11",
        "name": "Làng hoa Vạn Thành & Tà Nung",
        "tour_type": "FLOWER",
        "description": "Thăm làng hoa, đồi cà phê và những điểm check-in xanh mát phía Tây thành phố.",
        "duration_minutes": 480,
        "base_price": 640000,
    },
    {
        "code": "DL-12",
        "name": "Đà Lạt riêng tư cho cặp đôi",
        "tour_type": "PRIVATE",
        "description": "Lịch trình riêng linh hoạt, xe riêng và những điểm ngắm cảnh lãng mạn cho hai người.",
        "duration_minutes": 540,
        "base_price": 1790000,
    },
]


def seed_admin(db: Session) -> User:
    admin = db.scalar(select(User).where(User.email == settings.admin_email))
    if admin:
        if admin.role != "ADMIN" or not admin.is_active:
            admin.role = "ADMIN"
            admin.is_active = True
            db.commit()
        return admin
    admin = User(full_name="DALAT Go Administrator", email=settings.admin_email, password_hash=hash_password(settings.admin_password), role="ADMIN")
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def seed_demo_data(db: Session, admin: User) -> None:
    demo_customer = db.scalar(select(User).where(User.email == "customer@dalatgo.local"))
    if not demo_customer:
        demo_customer = User(
            full_name="Nguyễn Minh Anh",
            email="customer@dalatgo.local",
            password_hash=hash_password("Customer123!"),
            role="CUSTOMER",
        )
        db.add(demo_customer)
        db.flush()

    for role, name, email in [
        ("SALE", "Lê Hoàng Sale", "sale@dalatgo.local"),
        ("OPERATIONS", "Trần Gia Điều hành", "operations@dalatgo.local"),
        ("GUIDE", "Phạm An Hướng dẫn viên", "guide@dalatgo.local"),
        ("ACCOUNTING", "Võ Hà Kế toán", "accounting@dalatgo.local"),
        ("MANAGER", "Đỗ Minh Quản lý", "manager@dalatgo.local"),
    ]:
        if not db.scalar(select(User).where(User.email == email)):
            db.add(User(full_name=name, email=email, password_hash=hash_password("Staff123!"), role=role))

    db.flush()
    tours_by_code: dict[str, Tour] = {}
    for item in DEMO_TOURS:
        tour = db.scalar(select(Tour).where(Tour.code == item["code"]))
        if not tour:
            tour = Tour(**item, status="PUBLISHED")
            db.add(tour)
            db.flush()
        else:
            tour.status = "PUBLISHED"
            for key, value in item.items():
                setattr(tour, key, value)
        tours_by_code[item["code"]] = tour

    db.flush()
    today = date.today()
    for index, item in enumerate(DEMO_TOURS):
        tour = tours_by_code[item["code"]]
        existing = db.scalar(select(Departure).where(Departure.tour_id == tour.id))
        if existing:
            continue
        for offset, capacity, booked in [(2 + index % 3, 16, 4), (7 + index % 5, 12, 2), (14 + index % 4, 20, 0)]:
            departure = Departure(
                tour_id=tour.id,
                departure_date=today + timedelta(days=offset),
                max_capacity=capacity,
                booked_capacity=booked,
                status="FULL" if booked >= capacity else "OPEN",
            )
            db.add(departure)

    db.flush()
    sample_departure = db.scalar(select(Departure).order_by(Departure.departure_date))
    existing_booking = db.scalar(select(Booking).where(Booking.code == "DLG-DEMO001"))
    if sample_departure and not existing_booking:
        booking = Booking(
            code="DLG-DEMO001",
            departure_id=sample_departure.id,
            customer_id=demo_customer.id,
            guest_count=2,
            pickup_location="Chợ Đà Lạt",
            total_amount=sample_departure.tour.base_price * 2,
            status="CONFIRMED",
        )
        db.add(booking)

    db.commit()
