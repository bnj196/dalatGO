from datetime import date, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models import Booking, Departure, Review, Tour, User


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
    admin = User(
        full_name="DALAT Go Administrator",
        email=settings.admin_email,
        password_hash=hash_password(settings.admin_password),
        role="ADMIN",
    )
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

    dispatch_staff = {
        "DL-01": {
            "guide": "Trần Văn Hưng (0912.345.678)",
            "driver": "Nguyễn Tấn Đạt",
            "plate": "49B-018.92 (Ford Transit 16 chỗ)",
            "seats": 16,
        },
        "DL-02": {
            "guide": "Lê Thanh Tùng (0933.889.900)",
            "driver": "Phạm Văn Hòa",
            "plate": "49B-024.55 (Hyundai Solati 16 chỗ)",
            "seats": 16,
        },
        "DL-03": {
            "guide": "Đặng Quốc Hưng (0909.112.233)",
            "driver": "Trương Văn Khang",
            "plate": "49B-031.12 (Ford Transit 16 chỗ)",
            "seats": 16,
        },
    }

    first_dep_dl01: Departure | None = None

    for index, item in enumerate(DEMO_TOURS):
        tour = tours_by_code[item["code"]]
        staff = dispatch_staff.get(
            tour.code,
            {
                "guide": "Phạm An Hướng dẫn viên",
                "driver": "Nguyễn Văn Lái",
                "plate": "49B-055.66 (16 chỗ)",
                "seats": 16,
            },
        )
        existing_deps = list(db.scalars(select(Departure).where(Departure.tour_id == tour.id)).all())
        if not existing_deps:
            for offset, capacity, booked in [
                (2 + index % 3, 16, 4),
                (7 + index % 5, 12, 2),
                (14 + index % 4, 20, 0),
            ]:
                dep = Departure(
                    tour_id=tour.id,
                    departure_date=today + timedelta(days=offset),
                    max_capacity=capacity,
                    booked_capacity=booked,
                    status="FULL" if booked >= capacity else "OPEN",
                    guide_name=staff["guide"],
                    driver_name=staff["driver"],
                    vehicle_plate=staff["plate"],
                    vehicle_seats=staff["seats"],
                    meeting_point="Trung tâm thành phố Đà Lạt",
                )
                db.add(dep)
                if tour.code == "DL-01" and first_dep_dl01 is None:
                    first_dep_dl01 = dep
        else:
            if tour.code == "DL-01" and first_dep_dl01 is None:
                first_dep_dl01 = existing_deps[0]
            # Update resources if not yet set
            for dep in existing_deps:
                if not dep.guide_name:
                    dep.guide_name = staff["guide"]
                    dep.driver_name = staff["driver"]
                    dep.vehicle_plate = staff["plate"]
                    dep.vehicle_seats = staff["seats"]

    db.flush()

    # Seed demo bookings
    target_dep = first_dep_dl01 or db.scalar(select(Departure).order_by(Departure.departure_date))
    if target_dep:
        demo_bookings_data = [
            {
                "code": "DLG-9021",
                "customer_name": "Nguyễn Văn An",
                "customer_phone": "0903112233",
                "guest_count": 2,
                "pickup_location": "Khách sạn Colline (10 Phan Bội Châu)",
                "total_amount": 1380000,
                "deposit_amount": 1380000,
                "balance_due": 0,
                "status": "CONFIRMED",
                "checked_in": True,
            },
            {
                "code": "DLG-8843",
                "customer_name": "Trần Thị Mai",
                "customer_phone": "0988445566",
                "guest_count": 4,
                "pickup_location": "Chợ Đà Lạt (Khu Hòa Bình)",
                "total_amount": 2760000,
                "deposit_amount": 1380000,
                "balance_due": 1380000,
                "status": "PENDING_PAYMENT",
                "checked_in": False,
            },
            {
                "code": "DLG-7712",
                "customer_name": "Lê Hoàng Long",
                "customer_phone": "0918990112",
                "guest_count": 2,
                "pickup_location": "Homestay Ngàn Thông (Trần Hưng Đạo)",
                "total_amount": 1380000,
                "deposit_amount": 1380000,
                "balance_due": 0,
                "status": "CONFIRMED",
                "checked_in": False,
            },
        ]
        for b_info in demo_bookings_data:
            existing_b = db.scalar(select(Booking).where(Booking.code == b_info["code"]))
            if not existing_b:
                db.add(
                    Booking(
                        code=b_info["code"],
                        departure_id=target_dep.id,
                        customer_id=demo_customer.id,
                        customer_name=b_info["customer_name"],
                        customer_phone=b_info["customer_phone"],
                        guest_count=b_info["guest_count"],
                        pickup_location=b_info["pickup_location"],
                        total_amount=b_info["total_amount"],
                        deposit_amount=b_info["deposit_amount"],
                        balance_due=b_info["balance_due"],
                        status=b_info["status"],
                        checked_in=b_info["checked_in"],
                    )
                )

    db.flush()

    # Seed demo reviews
    dl01 = tours_by_code.get("DL-01")
    dl02 = tours_by_code.get("DL-02")
    dl03 = tours_by_code.get("DL-03")

    demo_reviews = []
    if dl01:
        demo_reviews.extend(
            [
                {
                    "tour_id": dl01.id,
                    "user_name": "Nguyễn Thu Trang",
                    "rating": 5.0,
                    "comment": "Chuyến săn mây Cầu Đất thật sự tuyệt vời! Biển mây bồng bềnh lúc 5h30 sáng, anh HDV rất nhiệt tình chụp ảnh cho cả đoàn.",
                    "verified": True,
                },
                {
                    "tour_id": dl01.id,
                    "user_name": "Hoàng Minh Quân",
                    "rating": 5.0,
                    "comment": "Xe đón đúng giờ, bữa sáng cà phê ngắm đồi chè rất ngon và yên bình. Sẽ rủ bạn bè đi tiếp lần sau.",
                    "verified": True,
                },
            ]
        )
    if dl02:
        demo_reviews.append(
            {
                "tour_id": dl02.id,
                "user_name": "Trần Bảo Anh",
                "rating": 5.0,
                "comment": "Thác Pongour mùa này nước đẹp hùng vĩ. Đội ngũ tổ chức chu đáo, trang bị bảo hộ cẩn thận.",
                "verified": True,
            }
        )
    if dl03:
        demo_reviews.append(
            {
                "tour_id": dl03.id,
                "user_name": "Vũ Lan Phương",
                "rating": 4.8,
                "comment": "Quán cà phê view hoàng hôn siêu thơ mộng. Một trải nghiệm chữa lành đúng nghĩa tại Đà Lạt!",
                "verified": True,
            }
        )

    for r_data in demo_reviews:
        existing_rev = db.scalar(
            select(Review).where(Review.tour_id == r_data["tour_id"], Review.user_name == r_data["user_name"])
        )
        if not existing_rev:
            db.add(Review(**r_data))

    db.commit()
