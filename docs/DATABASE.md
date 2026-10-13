# Database Design – DALAT Go

**Mục tiêu:** Thiết kế dữ liệu tập trung, truy vết được toàn bộ vòng đời booking và xử lý an toàn việc giữ chỗ.

## 1. Quy ước kỹ thuật

- CSDL quan hệ, khuyến nghị PostgreSQL.
- Khóa chính dùng UUID; mọi bảng nghiệp vụ có `created_at`, `updated_at`.
- Tiền dùng `numeric(14,2)` và lưu `currency`.
- Trạng thái dùng enum hoặc bảng cấu hình có kiểm soát.
- Không xóa cứng payment, refund, booking history và audit log.
- Tên bảng dùng snake_case, tên khóa ngoại dạng `<entity>_id`.
- File chỉ lưu metadata và object key, không lưu binary trực tiếp trong bảng nghiệp vụ.

## 2. Sơ đồ quan hệ khái quát

```text
users --< user_roles >-- roles --< role_permissions >-- permissions
  |
  +--< bookings >-- customers
  |       |
  |       +--< booking_guests
  |       +--< booking_addons >-- addons
  |       +--< payments --< refunds
  |       +--< booking_status_history
  |       +--< reviews
  |
  +--< audit_logs / notifications

tours --< itinerary_stops
tours --< departures --< bookings
departures --< assignments >-- resources
trips --< trip_attendance
trips --< expenses
trips --< operational_incidents
```

## 3. Bảng định danh và phân quyền

### `users`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| full_name | varchar(150) | NOT NULL |
| email | varchar(255) | UNIQUE, nullable |
| phone | varchar(30) | UNIQUE, nullable |
| password_hash | text | NOT NULL |
| status | varchar(30) | ACTIVE, LOCKED, PENDING |
| last_login_at | timestamptz | nullable |
| created_at/updated_at | timestamptz | NOT NULL |

### `roles`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | varchar(50) | UNIQUE |
| name | varchar(100) | NOT NULL |

### `permissions`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | varchar(100) | UNIQUE |
| name | varchar(150) | NOT NULL |

### `user_roles`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| user_id | uuid | PK/FK users |
| role_id | uuid | PK/FK roles |
| assigned_by | uuid | FK users |
| assigned_at | timestamptz | NOT NULL |

### `role_permissions`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| role_id | uuid | PK/FK roles |
| permission_id | uuid | PK/FK permissions |

## 4. Bảng khách hàng và tour

### `customers`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK users, nullable |
| full_name | varchar(150) | NOT NULL |
| phone | varchar(30) | NOT NULL |
| email | varchar(255) | nullable |
| special_requirements | text | nullable |
| source | varchar(50) | WEBSITE, SALE, OTHER |
| created_at/updated_at | timestamptz | NOT NULL |

### `tours`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | varchar(50) | UNIQUE, NOT NULL |
| name | varchar(200) | NOT NULL |
| tour_type | varchar(50) | NOT NULL |
| description | text | nullable |
| duration_minutes | integer | CHECK > 0 |
| base_price | numeric(14,2) | CHECK >= 0 |
| status | varchar(30) | DRAFT, PUBLISHED, PAUSED, ARCHIVED |
| policy_version_id | uuid | FK policies, nullable |
| created_by | uuid | FK users |
| created_at/updated_at | timestamptz | NOT NULL |

### `tour_media`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| tour_id | uuid | FK tours ON DELETE CASCADE |
| object_key | text | NOT NULL |
| media_type | varchar(30) | IMAGE, VIDEO, DOCUMENT |
| sort_order | integer | NOT NULL |

### `itinerary_stops`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| tour_id | uuid | FK tours ON DELETE CASCADE |
| sequence_no | integer | CHECK > 0 |
| name | varchar(200) | NOT NULL |
| description | text | nullable |
| arrival_offset_minutes | integer | CHECK >= 0 |
| latitude/longitude | numeric(10,7) | nullable |
| note | text | nullable |
| UNIQUE | tour_id, sequence_no | |

### `departures`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| tour_id | uuid | FK tours |
| departure_date | date | NOT NULL |
| meeting_time | timestamptz | NOT NULL |
| max_capacity | integer | CHECK > 0 |
| booked_capacity | integer | CHECK >= 0 |
| status | varchar(30) | OPEN, FULL, CLOSED, COMPLETED, CANCELLED |
| cutoff_at | timestamptz | nullable |
| UNIQUE | tour_id, departure_date, meeting_time | |

`remaining_capacity` nên là giá trị tính toán: `max_capacity - booked_capacity`, không cho sửa trực tiếp.

## 5. Bảng booking

### `bookings`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | varchar(50) | UNIQUE, NOT NULL |
| departure_id | uuid | FK departures |
| customer_id | uuid | FK customers |
| created_by | uuid | FK users |
| status | varchar(40) | NOT NULL |
| source | varchar(30) | CUSTOMER, SALE, OTHER |
| guest_count | integer | CHECK > 0 |
| pickup_location | text | NOT NULL |
| subtotal | numeric(14,2) | CHECK >= 0 |
| discount_amount | numeric(14,2) | CHECK >= 0 |
| surcharge_amount | numeric(14,2) | CHECK >= 0 |
| total_amount | numeric(14,2) | CHECK >= 0 |
| deposit_required | numeric(14,2) | CHECK >= 0 |
| paid_amount | numeric(14,2) | CHECK >= 0 |
| balance_amount | numeric(14,2) | CHECK >= 0 |
| voucher_id | uuid | FK vouchers, nullable |
| note | text | nullable |
| created_at/updated_at | timestamptz | NOT NULL |

### `booking_guests`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| booking_id | uuid | FK bookings ON DELETE CASCADE |
| full_name | varchar(150) | NOT NULL |
| phone | varchar(30) | nullable |
| age | integer | nullable |
| height_cm | numeric(5,2) | nullable |
| special_note | text | nullable |
| is_primary | boolean | NOT NULL |

### `booking_status_history`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| booking_id | uuid | FK bookings ON DELETE CASCADE |
| from_status | varchar(40) | nullable |
| to_status | varchar(40) | NOT NULL |
| reason | text | nullable |
| changed_by | uuid | FK users |
| created_at | timestamptz | NOT NULL |

### `booking_holds`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| departure_id | uuid | FK departures |
| booking_id | uuid | FK bookings, nullable |
| quantity | integer | CHECK > 0 |
| expires_at | timestamptz | NOT NULL |
| released_at | timestamptz | nullable |

Chỉ tạo hold trong transaction; job định kỳ giải phóng hold hết hạn.

## 6. Bảng giá, chính sách và dịch vụ

### `policies`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | varchar(50) | NOT NULL |
| version | integer | NOT NULL |
| policy_type | varchar(40) | CANCELLATION, PAYMENT, CHILD_PRICE, PICKUP |
| rules_json | jsonb | NOT NULL |
| effective_from/effective_to | timestamptz | NOT NULL/nullable |
| status | varchar(20) | DRAFT, ACTIVE, EXPIRED |
| approved_by | uuid | FK users, nullable |
| UNIQUE | code, version | |

### `addons`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | varchar(50) | UNIQUE |
| name | varchar(150) | NOT NULL |
| addon_type | varchar(50) | NOT NULL |
| unit_price | numeric(14,2) | CHECK >= 0 |
| status | varchar(20) | ACTIVE, INACTIVE |

### `booking_addons`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| booking_id | uuid | FK bookings ON DELETE CASCADE |
| addon_id | uuid | FK addons |
| quantity | integer | CHECK > 0 |
| unit_price | numeric(14,2) | CHECK >= 0 |
| total_price | numeric(14,2) | CHECK >= 0 |

### `vouchers`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| code | varchar(50) | UNIQUE |
| discount_type | varchar(20) | PERCENT, FIXED |
| discount_value | numeric(14,2) | CHECK >= 0 |
| valid_from/valid_to | timestamptz | NOT NULL |
| usage_limit/used_count | integer | CHECK >= 0 |
| conditions_json | jsonb | nullable |
| status | varchar(20) | DRAFT, ACTIVE, EXPIRED, DISABLED |

### `reviews`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| booking_id | uuid | UNIQUE/FK bookings |
| customer_id | uuid | FK customers |
| rating | smallint | CHECK 1-5 |
| content | text | nullable |
| status | varchar(20) | PENDING, PUBLISHED, HIDDEN |
| created_at/updated_at | timestamptz | NOT NULL |

## 7. Bảng thanh toán và hoàn tiền

### `payments`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| booking_id | uuid | FK bookings |
| amount | numeric(14,2) | CHECK > 0 |
| payment_type | varchar(20) | DEPOSIT, BALANCE, FULL, SURCHARGE |
| method | varchar(30) | CASH, BANK_TRANSFER, QR, CARD, GATEWAY |
| transaction_ref | varchar(150) | UNIQUE, nullable |
| receipt_object_key | text | nullable |
| status | varchar(30) | PENDING, CONFIRMED, REJECTED, NEEDS_REVIEW |
| confirmed_by | uuid | FK users, nullable |
| paid_at/confirmed_at | timestamptz | nullable |
| note | text | nullable |

### `refunds`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| booking_id | uuid | FK bookings |
| payment_id | uuid | FK payments, nullable |
| amount | numeric(14,2) | CHECK > 0 |
| reason | text | NOT NULL |
| status | varchar(30) | REQUESTED, APPROVED, REJECTED, COMPLETED |
| requested_by/approved_by | uuid | FK users |
| completed_at | timestamptz | nullable |

## 8. Bảng điều hành và thực hiện tour

### `resources`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| resource_type | varchar(30) | GUIDE, VEHICLE, DRIVER, PARTNER |
| user_id | uuid | FK users, nullable |
| name | varchar(150) | NOT NULL |
| phone | varchar(30) | nullable |
| metadata_json | jsonb | nullable |
| status | varchar(20) | ACTIVE, INACTIVE |

### `assignments`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| departure_id | uuid | FK departures |
| resource_id | uuid | FK resources |
| assignment_type | varchar(30) | GUIDE, VEHICLE, DRIVER, PARTNER |
| status | varchar(20) | DRAFT, SENT, ACKNOWLEDGED, CANCELLED |
| assigned_by | uuid | FK users |
| assigned_at | timestamptz | NOT NULL |
| UNIQUE | departure_id, resource_id, assignment_type | |

### `trips`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| departure_id | uuid | UNIQUE/FK departures |
| status | varchar(30) | PREPARING, IN_PROGRESS, COMPLETED, INTERRUPTED, CANCELLED |
| started_at/ended_at | timestamptz | nullable |
| completed_by | uuid | FK users, nullable |
| note | text | nullable |

### `trip_attendance`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| trip_id | uuid | FK trips ON DELETE CASCADE |
| booking_guest_id | uuid | FK booking_guests |
| status | varchar(20) | EXPECTED, PRESENT, LATE, ABSENT, NO_CONTACT |
| note | text | nullable |
| recorded_by | uuid | FK users |
| recorded_at | timestamptz | NOT NULL |
| UNIQUE | trip_id, booking_guest_id | |

### `operational_incidents`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| trip_id | uuid | FK trips |
| type | varchar(40) | WEATHER, SAFETY, CUSTOMER, SCHEDULE, OTHER |
| description | text | NOT NULL |
| proposed_action | text | nullable |
| status | varchar(30) | OPEN, PENDING_APPROVAL, APPROVED, REJECTED, RESOLVED |
| reported_by/approved_by | uuid | FK users |
| created_at/resolved_at | timestamptz | nullable |

## 9. Bảng chi phí, thông báo và audit

### `expenses`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| trip_id | uuid | FK trips |
| category | varchar(50) | NOT NULL |
| amount | numeric(14,2) | CHECK > 0 |
| incurred_at | timestamptz | NOT NULL |
| receipt_object_key | text | nullable |
| status | varchar(30) | DRAFT, SUBMITTED, RETURNED, APPROVED |
| submitted_by/approved_by | uuid | FK users |
| note | text | nullable |

### `notifications`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| recipient_user_id | uuid | FK users |
| event_type | varchar(50) | NOT NULL |
| channel | varchar(20) | IN_APP, EMAIL, SMS, PUSH |
| entity_type/entity_id | varchar(50) | NOT NULL |
| idempotency_key | varchar(150) | UNIQUE |
| status | varchar(20) | PENDING, SENT, FAILED |
| sent_at | timestamptz | nullable |
| retry_count | integer | CHECK >= 0 |
| error_message | text | nullable |

### `audit_logs`

| Cột | Kiểu | Ràng buộc |
|---|---|---|
| id | uuid | PK |
| actor_user_id | uuid | FK users, nullable |
| action | varchar(80) | NOT NULL |
| entity_type | varchar(50) | NOT NULL |
| entity_id | uuid | NOT NULL |
| before_json/after_json | jsonb | nullable |
| ip_address | inet | nullable |
| created_at | timestamptz | NOT NULL |

## 10. Chỉ mục bắt buộc

```sql
CREATE INDEX idx_departures_date_status ON departures (departure_date, status);
CREATE INDEX idx_bookings_customer_status ON bookings (customer_id, status);
CREATE INDEX idx_bookings_departure_status ON bookings (departure_id, status);
CREATE INDEX idx_bookings_code ON bookings (code);
CREATE INDEX idx_customers_phone ON customers (phone);
CREATE INDEX idx_payments_booking_status ON payments (booking_id, status);
CREATE INDEX idx_assignments_departure ON assignments (departure_id, status);
CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id, created_at);
```

## 11. Transaction quan trọng

1. **Tạo booking:** khóa departure, tính capacity, tạo hold/booking, cập nhật capacity và ghi history trong một transaction.
2. **Xác nhận thanh toán:** khóa booking, kiểm tra transaction reference, tạo payment confirmed, cập nhật paid/balance và status.
3. **Hủy booking:** kiểm tra policy, cập nhật booking, giải phóng capacity, tạo refund request và ghi audit.
4. **Chốt đoàn:** lấy snapshot booking đủ điều kiện, tạo/ cập nhật assignment và ghi phiên bản manifest.
5. **Duyệt chi phí:** khóa expense, đổi status, cập nhật số liệu báo cáo và audit.

## 12. Migration order

1. users, roles, permissions, user_roles, role_permissions.
2. customers, policies, vouchers, addons.
3. tours, tour_media, itinerary_stops, departures.
4. bookings, booking_guests, booking_addons, booking_status_history, booking_holds.
5. payments, refunds, reviews.
6. resources, assignments, trips, trip_attendance, operational_incidents.
7. expenses, notifications, audit_logs.
8. Indexes, seed data, constraints bổ sung và views báo cáo.

## 13. Views báo cáo đề xuất

- `vw_departure_capacity`: tổng slot, đã đặt, còn lại theo lịch.
- `vw_booking_financials`: tổng tiền, đã trả, còn lại, hoàn tiền.
- `vw_trip_profitability`: doanh thu, chi phí, lợi nhuận theo tour.
- `vw_pending_operations`: booking cần xử lý, thiếu thanh toán, thiếu phân công.
