# MVP Sprint Backlog – DALAT Go

**Nguồn:** `docs/USER_STORIES.md`, `docs/SRS.md`, `docs/USE_CASES.md`  
**Mục tiêu MVP:** Khách có thể tìm tour, tạo booking, thanh toán; nhân viên có thể xác nhận, điều hành tour, cập nhật thực hiện, quyết toán và xem báo cáo cơ bản.

## 1. Quy ước

- **P0:** bắt buộc để MVP hoạt động.
- **P1:** cần trong MVP nếu còn năng lực.
- **P2:** sau MVP.
- **SP:** story points tương đối.
- Mỗi sprint giả định kéo dài 2 tuần.

## 2. Phụ thuộc chính

```text
AUTH -> TOUR/DEPARTURE -> CUSTOMER/BOOKING -> PAYMENT
                                     -> OPERATIONS -> TRIP -> EXPENSE/REPORT
```

## 3. Sprint 0 – Nền tảng kỹ thuật và thiết kế

**Mục tiêu:** Có skeleton chạy được, migration, CI và wireframe đã thống nhất.

| ID | Công việc | Liên kết | Ưu tiên | SP |
|---|---|---|---|---:|
| S0-01 | Khởi tạo repository frontend/backend | process 04 | P0 | 3 |
| S0-02 | Cấu hình môi trường local, staging, biến môi trường mẫu | process 04 | P0 | 3 |
| S0-03 | Thiết lập lint, format, test, CI | process 04/16 | P0 | 3 |
| S0-04 | Tạo migration và seed roles/permissions | US-A02 | P0 | 5 |
| S0-05 | Tạo database schema nền tảng | DATABASE.md | P0 | 8 |
| S0-06 | Duyệt wireframe UC-01 đến UC-08 | WIREFRAMES.md | P0 | 3 |
| S0-07 | Chuẩn hóa API response, error, pagination | SRS NFR-09 | P0 | 3 |

**Definition of Done:** Repository cài được từ đầu, migration chạy thành công, CI kiểm tra được và wireframe được Product Owner duyệt.

## 4. Sprint 1 – Tài khoản, phân quyền và danh mục tour

**Mục tiêu:** Người dùng đăng nhập đúng quyền; nhân viên tạo được tour và lịch.

| ID | User story/công việc | Phụ thuộc | Ưu tiên | SP |
|---|---|---|---|---:|
| S1-01 | Đăng ký, đăng nhập, đăng xuất | US-A01 | P0 | 5 |
| S1-02 | Khôi phục mật khẩu và khóa tài khoản | US-A01 | P0 | 3 |
| S1-03 | RBAC cho Customer, Sale, Operations, Guide, Accounting, Manager, Admin | US-A02 | P0 | 5 |
| S1-04 | Ghi audit cho đăng nhập và thay đổi quyền | US-A02 | P0 | 3 |
| S1-05 | CRUD tour, media và trạng thái công khai | SRS FR-TOUR | P0 | 5 |
| S1-06 | CRUD itinerary stops và điểm bản đồ | US-B02 | P0 | 5 |
| S1-07 | CRUD departure, capacity, cutoff và trạng thái | US-C04 | P0 | 5 |
| S1-08 | Cấm công khai tour thiếu dữ liệu bắt buộc | US-B03 | P0 | 3 |

**Kiểm thử:** xác minh quyền từng route, tour chưa đủ dữ liệu không được công khai, slot không âm, migration fresh-install.

## 5. Sprint 2 – Khám phá tour và booking

**Mục tiêu:** Khách/Sale tạo được booking an toàn, không vượt slot.

| ID | User story/công việc | Phụ thuộc | Ưu tiên | SP |
|---|---|---|---|---:|
| S2-01 | Tìm tour và lọc theo ngày/giá/loại/thời lượng | US-B01 | P0 | 5 |
| S2-02 | Màn hình chi tiết, lịch trình, bản đồ, chính sách | US-B02/US-B03 | P0 | 5 |
| S2-03 | CRUD customer và thành viên đoàn | US-C01/C02 | P0 | 5 |
| S2-04 | Tạo booking trực tuyến | US-C01 | P0 | 8 |
| S2-05 | Sale tạo booking thay khách | US-C02 | P0 | 5 |
| S2-06 | Tính giá, cọc, phụ thu và giảm giá cơ bản | US-C01 | P0 | 5 |
| S2-07 | Booking state machine và status history | US-C03 | P0 | 5 |
| S2-08 | Temporary hold và transaction chống vượt slot | US-C04 | P0 | 8 |
| S2-09 | Trang khách xem booking và trạng thái | US-C03 | P0 | 5 |

**Kiểm thử:** hai request đồng thời cạnh slot cuối, dữ liệu form sai, hết thời gian hold, tìm booking theo mã/số điện thoại.

## 6. Sprint 3 – Thanh toán và hủy/đổi

**Mục tiêu:** Ghi nhận thanh toán thủ công, đối soát và xử lý yêu cầu hủy/đổi.

| ID | User story/công việc | Phụ thuộc | Ưu tiên | SP |
|---|---|---|---|---:|
| S3-01 | Tạo payment intent và hướng dẫn chuyển khoản/QR | US-D01 | P0 | 5 |
| S3-02 | Upload receipt an toàn | US-D01 | P0 | 3 |
| S3-03 | Sale/Kế toán xác nhận, từ chối, yêu cầu bổ sung | US-D02 | P0 | 5 |
| S3-04 | Cập nhật paid, balance và booking status nguyên tử | US-D02 | P0 | 5 |
| S3-05 | Chống transaction_ref trùng và xử lý idempotency | US-D02 | P0 | 5 |
| S3-06 | Gửi yêu cầu hủy/đổi và xem chính sách | US-D03 | P0 | 5 |
| S3-07 | Tính phí/hoàn tiền theo policy version | US-D03 | P0 | 5 |
| S3-08 | Phê duyệt ngoại lệ và refund request | US-D03 | P0 | 5 |
| S3-09 | Trả slot sau hủy hợp lệ và audit | US-D03 | P0 | 3 |

**Ghi chú:** OI-01, OI-02, OI-03 chưa được tự động hóa; các trường hợp liên quan chuyển phê duyệt.

## 7. Sprint 4 – Điều hành và thông báo

**Mục tiêu:** Điều hành chốt đoàn, phân công nguồn lực và gửi thông tin thống nhất.

| ID | User story/công việc | Phụ thuộc | Ưu tiên | SP |
|---|---|---|---|---:|
| S4-01 | Tổng hợp manifest từ booking đã xác nhận | US-F01 | P0 | 5 |
| S4-02 | Cập nhật phiên bản danh sách đoàn | US-F01 | P0 | 3 |
| S4-03 | CRUD resources: HDV, xe, tài xế, đối tác | US-F02 | P0 | 5 |
| S4-04 | Phân công và kiểm tra trùng lịch | US-F02 | P0 | 8 |
| S4-05 | Chốt trước cutoff và khóa thay đổi nguy hiểm | US-F01/F02 | P0 | 5 |
| S4-06 | Gửi assignment cho HDV/đối tác | US-F02 | P0 | 3 |
| S4-07 | Notification in-app cho booking/payment/assignment | US-G03 | P0 | 5 |
| S4-08 | Nhắc giờ tập trung/khởi hành | US-G03 | P0 | 5 |
| S4-09 | Lưu delivery status, retry và lỗi gửi | US-G03 | P1 | 3 |

**Kiểm thử:** resource trùng lịch, booking thanh toán thiếu, thay đổi sau chốt, người nhận không có quyền.

## 8. Sprint 5 – Thực hiện tour và chi phí

**Mục tiêu:** HDV sử dụng được hệ thống trong ngày tour; chi phí được liên kết.

| ID | User story/công việc | Phụ thuộc | Ưu tiên | SP |
|---|---|---|---|---:|
| S5-01 | Dashboard tour được phân công cho HDV | US-F04 | P0 | 5 |
| S5-02 | Điểm danh khách và ghi nhận vắng/muộn | US-F04 | P0 | 5 |
| S5-03 | Chuyển trạng thái tour | US-F04 | P0 | 3 |
| S5-04 | Ghi incident và yêu cầu đổi lịch trình | US-F03/F04 | P0 | 5 |
| S5-05 | Phê duyệt incident bởi Điều hành/Quản lý | US-F03 | P0 | 5 |
| S5-06 | Nhập khoản chi và upload chứng từ | US-G01 | P0 | 5 |
| S5-07 | Gửi bảng kê trong thời hạn cấu hình | US-G01 | P0 | 3 |
| S5-08 | Kế toán duyệt/trả lại bảng kê | US-G01 | P0 | 5 |
| S5-09 | Cảnh báo bảng kê quá hạn | US-G01 | P1 | 3 |

**Kiểm thử:** HDV không xem tour ngoài phân công, chi phí âm, file không hợp lệ, incident thiếu lý do.

## 9. Sprint 6 – Báo cáo, hoàn thiện MVP và pilot

**Mục tiêu:** Đối soát dữ liệu, báo cáo và đưa nhóm người dùng đầu tiên vào thử nghiệm.

| ID | User story/công việc | Phụ thuộc | Ưu tiên | SP |
|---|---|---|---|---:|
| S6-01 | Báo cáo booking và trạng thái | US-G02 | P0 | 5 |
| S6-02 | Báo cáo thanh toán, công nợ và hoàn tiền | US-G02 | P0 | 5 |
| S6-03 | Báo cáo doanh thu, chi phí, lợi nhuận | US-G02 | P0 | 8 |
| S6-04 | Export CSV/XLSX/PDF theo quyền | SRS FR-REPORT-04 | P1 | 5 |
| S6-05 | Dashboard audit log và truy vết nguồn | US-G04 | P0 | 5 |
| S6-06 | Accessibility và responsive review | NFR-06/NFR-08 | P0 | 3 |
| S6-07 | Performance, security và concurrency test | NFR-01/NFR-03 | P0 | 5 |
| S6-08 | Backup/restore và monitoring staging | process 18 | P0 | 5 |
| S6-09 | Import dữ liệu mẫu đã làm sạch | process 17 | P1 | 5 |
| S6-10 | Pilot với Sale, Điều hành, HDV, Kế toán, Quản lý | process 17/19 | P0 | 5 |

## 10. Tổng hợp theo user story

| Story | Sprint | Ưu tiên |
|---|---|---|
| US-A01 | S1 | Must |
| US-A02 | S1 | Must |
| US-B01 | S2 | Must |
| US-B02 | S2 | Must |
| US-B03 | S2 | Must |
| US-C01 | S2 | Must |
| US-C02 | S2 | Must |
| US-C03 | S2 | Must |
| US-C04 | S2 | Must |
| US-D01 | S3 | Must |
| US-D02 | S3 | Must |
| US-D03 | S3 | Must |
| US-E01 | Sau MVP | Should |
| US-E02 | Sau MVP | Should |
| US-E03 | Sau MVP | Could |
| US-F01 | S4 | Must |
| US-F02 | S4 | Must |
| US-F03 | S5 | Must |
| US-F04 | S5 | Must |
| US-G01 | S5 | Must |
| US-G02 | S6 | Must |
| US-G03 | S4 | Must |
| US-G04 | S6 | Must |

## 11. MVP release checklist

- [ ] Migration và seed chạy được trên môi trường mới.
- [ ] Đăng nhập và phân quyền được kiểm thử cho tất cả vai trò.
- [ ] Khách tìm tour, xem chính sách và tạo booking thành công.
- [ ] Hệ thống không cho booking vượt slot trong thử nghiệm đồng thời.
- [ ] Thanh toán thủ công có đối soát và không ghi nhận trùng.
- [ ] Hủy/đổi và ngoại lệ có phê duyệt, hoàn slot đúng.
- [ ] Điều hành chốt đoàn và phân công không trùng lịch.
- [ ] HDV cập nhật tour và nộp chi phí.
- [ ] Báo cáo khớp với dữ liệu giao dịch.
- [ ] Notification và audit log hoạt động.
- [ ] Backup, restore, monitoring và rollback đã thử nghiệm.
- [ ] Product Owner nghiệm thu toàn bộ story P0.
