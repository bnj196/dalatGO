-- ============================================================================
-- DALAT GO TOUR MANAGEMENT SYSTEM - FULL DATABASE SCHEMA & DATA
-- Tương thích: PostgreSQL 12+, Supabase, Neon, Wasmer Cloud DB
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. BẢNG NGƯỜI DÙNG (USERS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);
CREATE INDEX IF NOT EXISTS ix_users_role ON users(role);

-- ----------------------------------------------------------------------------
-- 2. BẢNG TOUR / HÀNH TRÌNH (TOURS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tours (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    tour_type VARCHAR(50) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    base_price FLOAT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PUBLISHED'
);

CREATE INDEX IF NOT EXISTS ix_tours_code ON tours(code);
CREATE INDEX IF NOT EXISTS ix_tours_status ON tours(status);

-- ----------------------------------------------------------------------------
-- 3. BẢNG LỊCH KHỞI HÀNH & NGUỒN LỰC VẬN HÀNH (DEPARTURES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departures (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    tour_id VARCHAR(36) NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 16,
    booked_capacity INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    guide_name VARCHAR(150),
    driver_name VARCHAR(150),
    vehicle_plate VARCHAR(20),
    vehicle_seats INTEGER NOT NULL DEFAULT 16,
    meeting_point VARCHAR(255),
    notes TEXT
);

CREATE INDEX IF NOT EXISTS ix_departures_tour_id ON departures(tour_id);
CREATE INDEX IF NOT EXISTS ix_departures_status ON departures(status);
CREATE INDEX IF NOT EXISTS ix_departures_date ON departures(departure_date);

-- ----------------------------------------------------------------------------
-- 4. BẢNG ĐẶT CHỖ & VÉ ĐIỆN TỬ (BOOKINGS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    departure_id VARCHAR(36) NOT NULL REFERENCES departures(id) ON DELETE CASCADE,
    customer_id VARCHAR(36) NOT NULL REFERENCES users(id),
    customer_name VARCHAR(150),
    customer_phone VARCHAR(30),
    guest_count INTEGER NOT NULL DEFAULT 1,
    pickup_location VARCHAR(255) NOT NULL,
    total_amount FLOAT NOT NULL,
    deposit_amount FLOAT NOT NULL DEFAULT 0.0,
    balance_due FLOAT NOT NULL DEFAULT 0.0,
    discount_amount FLOAT NOT NULL DEFAULT 0.0,
    promo_code VARCHAR(50),
    addons TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'PENDING_PAYMENT',
    checked_in BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_bookings_code ON bookings(code);
CREATE INDEX IF NOT EXISTS ix_bookings_departure ON bookings(departure_id);
CREATE INDEX IF NOT EXISTS ix_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS ix_bookings_status ON bookings(status);

-- ----------------------------------------------------------------------------
-- 5. BẢNG ĐÁNH GIÁ TRẢI NGHIỆM TỪ DU KHÁCH (REVIEWS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    tour_id VARCHAR(36) NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    booking_code VARCHAR(50),
    user_name VARCHAR(150) NOT NULL,
    rating FLOAT NOT NULL,
    comment TEXT,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_reviews_tour_id ON reviews(tour_id);
CREATE INDEX IF NOT EXISTS ix_reviews_booking_code ON reviews(booking_code);

-- ----------------------------------------------------------------------------
-- 6. BẢNG NHẬT KÝ HỆ THỐNG (AUDIT_LOGS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    actor_user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    detail TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS ix_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- DỮ LIỆU MẪU CHUẨN BACKEND (SEED DATA)
-- ============================================================================

-- TÀI KHOẢN MẪU (Password mặc định: Admin123! cho Admin, Staff123! cho Nhân viên, Customer123! cho Khách)
INSERT INTO users (id, full_name, email, password_hash, is_active, role, created_at) VALUES 
('u-admin-01', 'DALAT Go Administrator', 'admin@dalatgo.local', '$2b$12$UQudtkGhvwCNOdufVOO8nebtsdkfBe9oSzNkxAZp19tsjiMCbwvxG', TRUE, 'ADMIN', NOW()),
('u-cust-01', 'Nguyễn Minh Anh', 'customer@dalatgo.local', '$2b$12$DR2r8/WoX0AI1QihwxLxNOH7aorOOO2VqI9V2.WGD4znhGMP.GKRW', TRUE, 'CUSTOMER', NOW()),
('u-sale-01', 'Lê Hoàng Sale', 'sale@dalatgo.local', '$2b$12$v8v7/KwcRaz0lPa5aDYMoOSsYM2Ecni2fFRswHKMDSof6w0bN2VBy', TRUE, 'SALE', NOW()),
('u-ops-01', 'Trần Gia Điều hành', 'operations@dalatgo.local', '$2b$12$ViMM9MPjs14rWXZQLcjoCOYOmGprF/dPu38yeL2O6fjdoTaiSUnA2', TRUE, 'OPERATIONS', NOW()),
('u-guide-01', 'Phạm An Hướng dẫn viên', 'guide@dalatgo.local', '$2b$12$epOG2M42ybq3gGzCzpY5nupBHiZdsHSfMnKLeprHVWnWBc4iCjLHS', TRUE, 'GUIDE', NOW()),
('u-acc-01', 'Võ Hà Kế toán', 'accounting@dalatgo.local', '$2b$12$GyNOtkaAjk1ySadoNGuf4.i0X0joPS5h8mfKj4e0yDSWlywlNJ7GG', TRUE, 'ACCOUNTING', NOW()),
('u-mgr-01', 'Đỗ Minh Quản lý', 'manager@dalatgo.local', '$2b$12$JQYbG8/OewuAiGwROqTQ9ewLLpd4ewHfqRAwS0socNCFgfDIaUILe', TRUE, 'MANAGER', NOW())
ON CONFLICT (id) DO NOTHING;

-- 12 HÀNH TRÌNH TOUR ĐÀ LẠT ĐẶC TRƯNG
INSERT INTO tours (id, code, name, tour_type, description, duration_minutes, base_price, status) VALUES 
('tour-dl-01', 'DL-01', 'Săn mây Cầu Đất & đồi chè xanh', 'NATURE', 'Bình minh trên đồi chè, biển mây Cầu Đất và một buổi sáng thật chậm giữa cao nguyên.', 480, 690000.0, 'PUBLISHED'),
('tour-dl-02', 'DL-02', 'Ba thác hoang sơ Đà Lạt', 'ADVENTURE', 'Khám phá Datanla, Prenn và Pongour trong hành trình dành cho người yêu thiên nhiên.', 600, 890000.0, 'PUBLISHED'),
('tour-dl-03', 'DL-03', 'Đà Lạt bình yên: cà phê & hoàng hôn', 'CHILL', 'Một ngày thư thả qua những quán cà phê có view đẹp, nhà ga cổ và đồi hoàng hôn.', 420, 590000.0, 'PUBLISHED'),
('tour-dl-04', 'DL-04', 'Check-in Đà Lạt: hoa, ga cổ & quảng trường', 'CITY', 'Đi qua những biểu tượng không thể bỏ lỡ của thành phố ngàn hoa trong một ngày.', 480, 620000.0, 'PUBLISHED'),
('tour-dl-05', 'DL-05', 'Cắm trại bên hồ Tuyền Lâm', 'CAMPING', 'Rời phố thị, dựng lều bên hồ, ngắm sao và thức dậy cùng rừng thông.', 1440, 1290000.0, 'PUBLISHED'),
('tour-dl-06', 'DL-06', 'Vườn dâu & nông trại địa phương', 'FAMILY', 'Trải nghiệm hái dâu, thăm nông trại và thưởng thức đặc sản phù hợp cho gia đình.', 360, 520000.0, 'PUBLISHED'),
('tour-dl-07', 'DL-07', 'Trekking Langbiang đón bình minh', 'TREKKING', 'Chinh phục cung đường Langbiang cùng hướng dẫn viên địa phương và ngắm bình minh.', 540, 990000.0, 'PUBLISHED'),
('tour-dl-08', 'DL-08', 'Ẩm thực Đà Lạt về đêm', 'FOOD', 'Ăn như người bản địa với bánh căn, lẩu gà lá é, sữa đậu nành và chợ đêm.', 300, 450000.0, 'PUBLISHED'),
('tour-dl-09', 'DL-09', 'Nghỉ dưỡng villa giữa rừng thông', 'RESORT', 'Hai ngày một đêm nghỉ tại villa, dùng bữa địa phương và tận hưởng không khí cao nguyên.', 2880, 2490000.0, 'PUBLISHED'),
('tour-dl-10', 'DL-10', 'Đà Lạt bằng xe máy: cung đường đèo', 'MOTORBIKE', 'Chạy qua những cung đường đẹp nhất quanh Đà Lạt cùng tài xế bản địa giàu kinh nghiệm.', 600, 790000.0, 'PUBLISHED'),
('tour-dl-11', 'DL-11', 'Làng hoa Vạn Thành & Tà Nung', 'FLOWER', 'Thăm làng hoa, đồi cà phê và những điểm check-in xanh mát phía Tây thành phố.', 480, 640000.0, 'PUBLISHED'),
('tour-dl-12', 'DL-12', 'Đà Lạt riêng tư cho cặp đôi', 'PRIVATE', 'Lịch trình riêng linh hoạt, xe riêng và những điểm ngắm cảnh lãng mạn cho hai người.', 540, 1790000.0, 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;

-- LỊCH KHỞI HÀNH & ĐIỀU HÀNH NGUỒN LỰC
INSERT INTO departures (id, tour_id, departure_date, max_capacity, booked_capacity, status, guide_name, driver_name, vehicle_plate, vehicle_seats, meeting_point) VALUES 
('dep-dl01-01', 'tour-dl-01', CURRENT_DATE + INTERVAL '2 day', 16, 8, 'OPEN', 'Trần Văn Hưng (0912.345.678)', 'Nguyễn Tấn Đạt', '49B-018.92 (Ford Transit 16 chỗ)', 16, 'Khách sạn trung tâm Đà Lạt & Quảng trường Lâm Viên'),
('dep-dl01-02', 'tour-dl-01', CURRENT_DATE + INTERVAL '7 day', 16, 2, 'OPEN', 'Trần Văn Hưng (0912.345.678)', 'Nguyễn Tấn Đạt', '49B-018.92 (Ford Transit 16 chỗ)', 16, 'Khách sạn trung tâm Đà Lạt & Quảng trường Lâm Viên'),
('dep-dl02-01', 'tour-dl-02', CURRENT_DATE + INTERVAL '3 day', 16, 4, 'OPEN', 'Lê Thanh Tùng (0933.889.900)', 'Phạm Văn Hòa', '49B-024.55 (Hyundai Solati 16 chỗ)', 16, 'Bến xe Liên Tỉnh & Khách sạn trung tâm'),
('dep-dl03-01', 'tour-dl-03', CURRENT_DATE + INTERVAL '4 day', 16, 2, 'OPEN', 'Đặng Quốc Hưng (0909.112.233)', 'Trương Văn Khang', '49B-031.12 (Ford Transit 16 chỗ)', 16, 'Quảng trường Lâm Viên')
ON CONFLICT (id) DO NOTHING;

-- BOOKING MẪU (E-TICKETS)
INSERT INTO bookings (id, code, departure_id, customer_id, customer_name, customer_phone, guest_count, pickup_location, total_amount, deposit_amount, balance_due, discount_amount, promo_code, addons, status, checked_in, created_at) VALUES 
('book-demo-01', 'DLG-9021', 'dep-dl01-01', 'u-cust-01', 'Nguyễn Văn An', '0903112233', 2, 'Khách sạn Colline (10 Phan Bội Châu)', 1380000.0, 1380000.0, 0.0, 0.0, NULL, '["addon_flycam"]', 'CONFIRMED', TRUE, NOW() - INTERVAL '1 day'),
('book-demo-02', 'DLG-8843', 'dep-dl01-01', 'u-cust-01', 'Trần Thị Mai', '0988445566', 4, 'Chợ Đà Lạt (Khu Hòa Bình)', 2760000.0, 1380000.0, 1380000.0, 138000.0, 'DALAT2026', '["addon_costume"]', 'PENDING_PAYMENT', FALSE, NOW() - INTERVAL '5 hour'),
('book-demo-03', 'DLG-7712', 'dep-dl01-01', 'u-cust-01', 'Lê Hoàng Long', '0918990112', 2, 'Homestay Ngàn Thông (Trần Hưng Đạo)', 1380000.0, 1380000.0, 0.0, 0.0, NULL, NULL, 'CONFIRMED', FALSE, NOW() - INTERVAL '2 hour')
ON CONFLICT (id) DO NOTHING;

-- ĐÁNH GIÁ THỰC TẾ (REVIEWS)
INSERT INTO reviews (id, tour_id, booking_code, user_name, rating, comment, verified, created_at) VALUES 
('rev-dl01-01', 'tour-dl-01', 'DLG-9021', 'Nguyễn Thu Trang', 5.0, 'Chuyến săn mây Cầu Đất thật sự tuyệt vời! Biển mây bồng bềnh lúc 5h30 sáng, anh HDV rất nhiệt tình chụp ảnh cho cả đoàn.', TRUE, NOW() - INTERVAL '3 day'),
('rev-dl01-02', 'tour-dl-01', NULL, 'Hoàng Minh Quân', 5.0, 'Xe đón đúng giờ, bữa sáng cà phê ngắm đồi chè rất ngon và yên bình. Sẽ rủ bạn bè đi tiếp lần sau.', TRUE, NOW() - INTERVAL '5 day'),
('rev-dl02-01', 'tour-dl-02', NULL, 'Trần Bảo Anh', 5.0, 'Thác Pongour mùa này nước đẹp hùng vĩ. Đội ngũ tổ chức chu đáo, trang bị bảo hộ cẩn thận.', TRUE, NOW() - INTERVAL '7 day'),
('rev-dl03-01', 'tour-dl-03', NULL, 'Vũ Lan Phương', 4.8, 'Quán cà phê view hoàng hôn siêu thơ mộng. Một trải nghiệm chữa lành đúng nghĩa tại Đà Lạt!', TRUE, NOW() - INTERVAL '10 day')
ON CONFLICT (id) DO NOTHING;

COMMIT;
