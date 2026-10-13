# Wireframes – DALAT Go

**Mục đích:** Đặc tả wireframe chức năng cho UC-01 đến UC-08. Đây là đặc tả bố cục và hành vi, chưa phải thiết kế UI cuối cùng.

## 1. Nguyên tắc chung

- Giao diện khách hàng ưu tiên mobile-first; giao diện nội bộ ưu tiên desktop nhưng responsive.
- Mỗi màn hình có trạng thái loading, empty, error, success và unauthorized.
- Không hiển thị dữ liệu nhạy cảm ngoài quyền của vai trò.
- Nút hành động chính phải gắn với trạng thái nghiệp vụ hiện tại.
- Form phải giữ dữ liệu đã nhập khi có lỗi và chỉ rõ trường cần sửa.

## 2. Sơ đồ luồng tổng thể

```text
Trang chủ
  -> UC-01 Tìm tour
      -> Chi tiết tour
          -> UC-02 Tạo booking
              -> UC-03 Thanh toán
                  -> Booking của tôi
                      -> UC-04 Hủy/đổi

Dashboard nội bộ
  -> UC-05 Quản lý tour/lịch/slot
  -> UC-06 Chốt đoàn/phân công
  -> UC-07 Thực hiện tour
  -> UC-08 Quyết toán
```

## WF-01 – Tìm kiếm và xem tour / UC-01

**Vai trò:** Khách hàng, Sale  
**Route đề xuất:** `/tours`

```text
+------------------------------------------------------------+
| Logo | Tour | Booking của tôi | Trợ giúp | Tài khoản       |
+------------------------------------------------------------+
| Tìm tour Đà Lạt                                            |
| [Ngày đi] [Giá từ] [Giá đến] [Loại] [Thời lượng] [Tìm]    |
| [Bản đồ] [Có chỗ] [Xóa bộ lọc]                            |
+------------------------------------------------------------+
| Kết quả: 12 tour                     [Sắp xếp: Phù hợp]    |
| +------------------+  +------------------+                |
| | Ảnh              |  | Ảnh              |                |
| | Tên tour         |  | Tên tour         |                |
| | Ngày | Giá       |  | Ngày | Giá       |                |
| | Còn 8 chỗ        |  | Hết chỗ          |                |
| | [Xem chi tiết]   |  | [Xem chi tiết]   |                |
| +------------------+  +------------------+                |
+------------------------------------------------------------+
```

**Thành phần:** thanh tìm kiếm, bộ lọc, thẻ tour, trạng thái slot, phân trang, bản đồ tùy chọn.

**Tương tác:**
- Chọn thẻ tour mở WF-02.
- Chọn `Có chỗ` chỉ giữ lịch còn khả năng nhận khách.
- Nếu không có kết quả, hiển thị gợi ý bỏ bộ lọc.
- Sale có thêm nút `Tạo booking cho khách`.

## WF-02 – Chi tiết tour và lịch trình / UC-01

**Route đề xuất:** `/tours/:tourId`

```text
+------------------------------------------------------------+
| <- Quay lại       DALAT Go                                |
+------------------------------------------------------------+
| [Ảnh lớn]       Tên tour                  [Từ ... đ/người] |
|                 Đánh giá | Thời lượng | Còn chỗ            |
|                 [Chọn lịch khởi hành]                     |
+------------------------------------------------------------+
| [Tổng quan] [Lịch trình] [Bản đồ] [Chính sách] [Review]   |
+------------------------------------------------------------+
| Lịch trình                                                |
| 08:00 Điểm tập trung -> 09:00 Điểm đến 1                 |
| 11:00 Điểm đến 2 -> 14:00 Điểm đến 3                     |
| [Bản đồ các điểm]                                         |
+------------------------------------------------------------+
| Dịch vụ kèm | Điểm đón | Điều kiện | [Đặt tour]           |
+------------------------------------------------------------+
```

**Kiểm tra:** giá, slot, chính sách, phiên bản thông tin và điểm bản đồ phải cùng lịch khởi hành đã chọn.

## WF-03 – Tạo booking / UC-02

**Vai trò:** Khách hàng, Sale  
**Route đề xuất:** `/bookings/new`

```text
+------------------------------------------------------------+
| Bước 1 Lịch -> Bước 2 Khách -> Bước 3 Dịch vụ -> Bước 4   |
| Xác nhận                                                    |
+------------------------------------------------------------+
| 1. Chọn lịch                                               |
| [Tour] [Ngày đi] [Số khách +/-] [Điểm đón]                |
| Slot còn lại: 8                 Thời gian giữ chỗ: 09:45   |
+------------------------------------------------------------+
| 2. Người đặt và thành viên đoàn                            |
| Họ tên* [              ] SĐT* [              ]             |
| Email  [              ] Ghi chú [              ]             |
| [+ Thêm khách]                                             |
+------------------------------------------------------------+
| 3. Dịch vụ đi kèm                                          |
| [ ] Homestay [ ] Xe máy [ ] Ô tô [ ] HDV riêng            |
+------------------------------------------------------------+
| Tạm tính | Giảm giá | Phụ thu | Tổng tiền | Cọc tối thiểu |
| [Quay lại]                              [Tiếp tục]         |
+------------------------------------------------------------+
```

**Ngoại lệ hiển thị:** hết slot, voucher lỗi, thiếu trường bắt buộc, hết thời gian giữ chỗ.

## WF-04 – Xác nhận booking và thanh toán / UC-03

**Route đề xuất:** `/bookings/:bookingId/payment`

```text
+------------------------------------------------------------+
| Booking #DLG-000001          Trạng thái: Chờ thanh toán    |
+------------------------------------------------------------+
| Tour / ngày / số khách / điểm đón                         |
| Tổng tiền: 2.000.000     Đã trả: 0     Còn lại: 2.000.000  |
| Cọc tối thiểu: 1.000.000                                  |
+------------------------------------------------------------+
| Phương thức: ( ) QR  ( ) Chuyển khoản  ( ) Thẻ            |
| [Mã QR / thông tin tài khoản]                             |
| Mã giao dịch [              ]                              |
| Chứng từ [Tải ảnh hoặc PDF]                               |
| [Gửi thanh toán]                                           |
+------------------------------------------------------------+
| Timeline: Tạo -> Chờ xác nhận -> Đã cọc -> Đã xác nhận    |
+------------------------------------------------------------+
```

**Màn hình nhân viên:** thêm nút `Xác nhận`, `Từ chối`, `Yêu cầu bổ sung`, hiển thị giao dịch trùng và lịch sử thao tác.

## WF-05 – Hủy hoặc đổi booking / UC-04

**Route đề xuất:** `/bookings/:bookingId/change`

```text
+------------------------------------------------------------+
| Booking #DLG-000001 | Đã xác nhận                         |
+------------------------------------------------------------+
| Chọn yêu cầu: ( ) Hủy booking  ( ) Đổi ngày               |
| Ngày mới: [          ]       Lý do*: [                   ] |
+------------------------------------------------------------+
| Chính sách hiện hành                                      |
| Thời điểm hủy: ... | Phí: ... | Dự kiến hoàn: ...         |
| Cảnh báo: yêu cầu này cần Quản lý phê duyệt               |
+------------------------------------------------------------+
| [Hủy thao tác]                               [Gửi yêu cầu] |
+------------------------------------------------------------+
```

**Hành vi:** chỉ trả slot sau khi yêu cầu được chấp nhận; ngoại lệ chính sách phải hiện rõ người phê duyệt.

## WF-06 – Quản lý tour, lịch và slot / UC-05

**Vai trò:** Quản lý, Điều hành  
**Route đề xuất:** `/admin/tours`

```text
+------------------------------------------------------------+
| Nội bộ | Tổng quan | Tour | Lịch | Booking | Báo cáo        |
+------------------------------------------------------------+
| Tour / Lịch khởi hành                 [+ Tạo tour]         |
| [Tìm] [Trạng thái] [Ngày] [Lọc]                           |
+------------------------------------------------------------+
| Mã | Tên | Ngày | Tối đa | Đã đặt | Còn | Trạng thái | ... |
| T01| 3 thác|12/06| 16    | 8      | 8   | Công khai  | ... |
+------------------------------------------------------------+
| Panel chi tiết tour                                       |
| Thông tin | Lịch trình | Giá | Chính sách | Phiên bản    |
| [Lưu nháp] [Công khai] [Tạm dừng]                         |
+------------------------------------------------------------+
```

**Ràng buộc:** không công khai khi thiếu giá, lịch trình, slot hoặc chính sách; thay đổi lịch có booking cần cảnh báo.

## WF-07 – Chốt đoàn và phân công / UC-06

**Vai trò:** Điều hành  
**Route đề xuất:** `/operations/departures/:departureId`

```text
+------------------------------------------------------------+
| Tour: T01 | 12/06 | Chốt trước: 21:00  | [Gửi thông báo]  |
+------------------------------------------------------------+
| Tóm tắt: 8 booking | 14 khách | Thanh toán thiếu: 1       |
+------------------------------------------------------------+
| Danh sách đoàn                                            |
| [ ] Tên | SĐT | Số khách | Điểm đón | Thanh toán | Ghi chú |
+------------------------------------------------------------+
| Phân công                                                 |
| HDV: [Chọn]  Xe: [Chọn]  Tài xế: [Chọn]                  |
| Trùng lịch: Không        Khả dụng: Có                     |
| [Lưu nháp] [Chốt danh sách] [Gửi HDV]                    |
+------------------------------------------------------------+
```

**Ngoại lệ:** booking chưa đủ điều kiện, HDV/xe trùng lịch, thay đổi sau khi chốt.

## WF-08 – Thực hiện tour / UC-07

**Vai trò:** HDV, Điều hành  
**Route đề xuất:** `/guide/trips/:tripId`

```text
+------------------------------------------------------------+
| Tour T01 | 12/06 | Đang chuẩn bị          [Bắt đầu tour]   |
+------------------------------------------------------------+
| Điểm đón / giờ tập trung / liên hệ Điều hành              |
+------------------------------------------------------------+
| Danh sách khách                                            |
| [ ] Nguyễn A | 09xx | Đã điểm danh | Ghi chú              |
| [ ] Trần B   | 09xx | Chưa đến    | [Đánh dấu vắng]      |
+------------------------------------------------------------+
| [Ghi phát sinh] [Đề xuất đổi lịch] [Thêm chi phí]         |
| Trạng thái: [Chuẩn bị v]                                 |
| [Lưu cập nhật]                             [Hoàn thành]   |
+------------------------------------------------------------+
```

**Bắt buộc:** quyền chỉ xem tour được phân công; mọi thay đổi bất thường có lý do, người phê duyệt và thông báo.

## WF-09 – Quyết toán tour / UC-08

**Vai trò:** HDV, Kế toán, Quản lý  
**Route đề xuất:** `/trips/:tripId/settlement`

```text
+------------------------------------------------------------+
| Quyết toán T01 | Tour đã hoàn thành | Hạn nộp: 13/06       |
+------------------------------------------------------------+
| Doanh thu liên kết: 12.000.000 | Chi phí: 0 | Lợi nhuận: - |
+------------------------------------------------------------+
| Khoản chi                                                 |
| Loại [ ] Số tiền [ ] Thời điểm [ ] Chứng từ [Tải lên]     |
| [+ Thêm khoản chi]                                        |
+------------------------------------------------------------+
| Tổng chi: ... | Trạng thái: Nháp                         |
| [Lưu] [Gửi kế toán]                                      |
+------------------------------------------------------------+
```

**Màn hình kế toán:** danh sách chờ duyệt, nút `Duyệt`, `Trả lại`, lý do trả lại, đối chiếu doanh thu và lịch sử.

## 3. Thành phần dùng chung

- Header, breadcrumb, thông báo, hồ sơ và đăng xuất.
- Toast thành công/thất bại; modal xác nhận thao tác nhạy cảm.
- Bảng có lọc, sắp xếp, phân trang và xuất dữ liệu theo quyền.
- Timeline trạng thái cho booking, thanh toán, phân công và quyết toán.
- Trạng thái màu phải đi kèm nhãn chữ, không chỉ dùng màu.

## 4. Danh sách màn hình MVP

| Mã | Màn hình | UC |
|---|---|---|
| SCR-01 | Tìm tour | UC-01 |
| SCR-02 | Chi tiết tour | UC-01 |
| SCR-03 | Tạo booking | UC-02 |
| SCR-04 | Thanh toán/xác nhận | UC-03 |
| SCR-05 | Hủy/đổi booking | UC-04 |
| SCR-06 | Quản lý tour/lịch/slot | UC-05 |
| SCR-07 | Chốt đoàn/phân công | UC-06 |
| SCR-08 | Thực hiện tour | UC-07 |
| SCR-09 | Quyết toán | UC-08 |
