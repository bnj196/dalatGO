# SRS – DALAT Go

**Phiên bản:** 1.0  
**Trạng thái:** Bản đặc tả yêu cầu phần mềm

## 1. Mục đích

Tài liệu mô tả yêu cầu phần mềm cho DALAT Go, nền tảng quản lý và đặt tour Đà Lạt. SRS chuyển các vấn đề hiện trạng trong BRD thành yêu cầu có thể thiết kế, phát triển và kiểm thử.

## 2. Phạm vi hệ thống

Hệ thống gồm cổng khách hàng, cổng nhân viên nội bộ và API/dịch vụ nền tảng. Sản phẩm quản lý vòng đời tour và booking, không thay thế hệ thống kế toán đầy đủ hoặc nền tảng định vị xe thời gian thực.

## 3. Người dùng và phân quyền

| Vai trò | Quyền chính |
|---|---|
| Khách hàng | Xem tour, đặt tour, thanh toán, theo dõi booking, hủy/đổi theo chính sách, review |
| Sale | Tư vấn, tạo booking, quản lý khách, kiểm tra slot, xác nhận giao dịch |
| Điều hành | Lịch tour, slot, danh sách đoàn, phân công HDV/xe, cập nhật điều hành |
| HDV | Xem tour được giao, danh sách khách, cập nhật thực hiện, phát sinh và chi phí |
| Thu ngân/Kế toán | Ghi nhận, đối soát, xác nhận thanh toán, hoàn tiền, báo cáo tài chính tour |
| Quản lý | Quản trị tour, giá, chính sách, voucher, phê duyệt, báo cáo |
| Quản trị hệ thống | Tài khoản, vai trò, cấu hình, nhật ký và bảo mật |
| Đối tác | Xem yêu cầu dịch vụ được phân công, xác nhận khả năng cung cấp |

## 4. Kiến trúc logic và kênh

- **Web khách hàng:** tìm kiếm, đặt tour, quản lý hồ sơ và booking.
- **Web nội bộ:** Sale, Điều hành, HDV, Kế toán và Quản lý.
- **API nghiệp vụ:** xác thực, tour, booking, thanh toán, phân công, thông báo và báo cáo.
- **Cơ sở dữ liệu tập trung:** lưu dữ liệu chuẩn hóa và lịch sử thay đổi.
- **Dịch vụ ngoài:** cổng thanh toán, email/SMS/push, bản đồ, lưu trữ ảnh/tài liệu.

## 5. Yêu cầu chức năng

### 5.1. Tài khoản và xác thực

- **FR-AUTH-01:** Người dùng đăng ký bằng họ tên, số điện thoại/email và mật khẩu.
- **FR-AUTH-02:** Người dùng đăng nhập, đăng xuất và khôi phục mật khẩu.
- **FR-AUTH-03:** Hệ thống áp dụng RBAC theo vai trò.
- **FR-AUTH-04:** Hệ thống khóa hoặc giới hạn đăng nhập bất thường.
- **FR-AUTH-05:** Quản trị viên tạo, khóa, mở khóa và phân vai trò tài khoản.

### 5.2. Danh mục tour

- **FR-TOUR-01:** Quản lý mã, tên, loại tour, mô tả, thời lượng, giá, ảnh và trạng thái.
- **FR-TOUR-02:** Quản lý lịch trình theo thứ tự, điểm đến, thời lượng, ghi chú và bản đồ.
- **FR-TOUR-03:** Quản lý lịch khởi hành, slot tối đa, slot đã đặt và slot còn lại.
- **FR-TOUR-04:** Tìm kiếm theo ngày, giá, thời lượng, loại tour, điểm đến và số chỗ.
- **FR-TOUR-05:** Công khai tour chỉ khi tour ở trạng thái hoạt động và thông tin bắt buộc đầy đủ.
- **FR-TOUR-06:** Lưu phiên bản và người cập nhật khi thay đổi giá, lịch trình hoặc chính sách.

### 5.3. Khách hàng và booking

- **FR-BOOK-01:** Tạo booking từ khách hàng hoặc nhân viên Sale.
- **FR-BOOK-02:** Booking lưu mã, khách đặt, danh sách khách, tour, lịch đi, số người, điểm đón, giá, giảm giá và ghi chú.
- **FR-BOOK-03:** Hệ thống kiểm tra slot tại thời điểm tạo và xác nhận booking.
- **FR-BOOK-04:** Không cho xác nhận nếu số người vượt slot còn lại.
- **FR-BOOK-05:** Booking có các trạng thái: Nháp, Chờ thanh toán, Đã cọc, Đã xác nhận, Đang thực hiện, Hoàn thành, Yêu cầu hủy, Đã hủy, Yêu cầu đổi, Chờ hoàn tiền.
- **FR-BOOK-06:** Lưu lịch sử trạng thái, người thao tác, thời gian và lý do.
- **FR-BOOK-07:** Cho phép tìm booking theo mã, số điện thoại, tên khách, tour, ngày đi và trạng thái.
- **FR-BOOK-08:** Khách xem lịch sử booking và chi tiết từng booking.
- **FR-BOOK-09:** Nhân viên cập nhật booking theo quyền, bắt buộc ghi lý do khi thay đổi quan trọng.

### 5.4. Thanh toán và hoàn tiền

- **FR-PAY-01:** Tạo khoản phải thu theo booking: tiền cọc, còn lại, phụ thu và giảm giá.
- **FR-PAY-02:** Hỗ trợ tiền mặt, chuyển khoản, QR, thẻ và cổng thanh toán nếu được tích hợp.
- **FR-PAY-03:** Khách tải ảnh/chứng từ thanh toán.
- **FR-PAY-04:** Nhân viên xác nhận, từ chối hoặc yêu cầu bổ sung chứng từ.
- **FR-PAY-05:** Gắn giao dịch với booking và ghi số tiền, phương thức, thời gian, mã giao dịch.
- **FR-PAY-06:** Tính số tiền còn phải thu và hiển thị công nợ.
- **FR-PAY-07:** Tạo yêu cầu hoàn tiền khi hủy theo chính sách và chờ người có quyền phê duyệt.
- **FR-PAY-08:** Không xóa giao dịch đã ghi nhận; chỉ cho phép điều chỉnh có lý do và nhật ký.

### 5.5. Dịch vụ đi kèm, voucher và review

- **FR-ADDON-01:** Quản lý homestay/villa, xe máy, ô tô, cắm trại, HDV riêng và dịch vụ khác.
- **FR-ADDON-02:** Gắn dịch vụ, số lượng, thời gian và giá vào booking.
- **FR-VOUCHER-01:** Quản lý mã, mức giảm, thời hạn, điều kiện và giới hạn sử dụng.
- **FR-REVIEW-01:** Khách chỉ review booking đã hoàn thành.
- **FR-REVIEW-02:** Quản lý trạng thái hiển thị, phản hồi và báo cáo nội dung vi phạm.

### 5.6. Điều hành tour

- **FR-OPS-01:** Tạo danh sách đoàn từ các booking đã xác nhận.
- **FR-OPS-02:** Phân công HDV, xe, tài xế và đối tác theo tour/lịch.
- **FR-OPS-03:** Kiểm tra trùng lịch hoặc nguồn lực không khả dụng.
- **FR-OPS-04:** Chốt danh sách đoàn và phân công trước thời hạn cấu hình, hiện trạng mặc định là 21:00 đêm trước ngày đi.
- **FR-OPS-05:** Gửi thông tin lịch, danh sách và điểm đón cho người liên quan.
- **FR-OPS-06:** Ghi nhận thay đổi lịch trình, người phê duyệt, lý do và thông báo cần gửi.
- **FR-OPS-07:** Hỗ trợ điểm danh, ghi chú khách đến muộn/không liên lạc được và phát sinh.

### 5.7. Thực hiện tour và quyết toán

- **FR-TRIP-01:** HDV xem danh sách khách, điểm đón và lịch trình tour được giao.
- **FR-TRIP-02:** HDV cập nhật trạng thái tour: chuẩn bị, đang chạy, hoàn thành, gián đoạn hoặc hủy.
- **FR-TRIP-03:** HDV ghi nhận phát sinh, chi phí, chứng từ và ghi chú.
- **FR-TRIP-04:** HDV lập bảng kê chi phí trong thời hạn cấu hình, hiện trạng mặc định 24 giờ sau tour.
- **FR-TRIP-05:** Kế toán/Quản lý duyệt hoặc trả lại bảng kê.
- **FR-TRIP-06:** Hệ thống tổng hợp doanh thu, chi phí và lợi nhuận theo tour/booking.

### 5.8. Thông báo

- **FR-NOTI-01:** Gửi thông báo khi tạo, thanh toán, xác nhận, hủy hoặc đổi booking.
- **FR-NOTI-02:** Nhắc trước giờ tập trung/khởi hành theo cấu hình.
- **FR-NOTI-03:** Thông báo khi lịch trình, điểm đón hoặc trạng thái tour thay đổi.
- **FR-NOTI-04:** Lưu lịch sử gửi, kênh, thời gian, trạng thái và lỗi.

### 5.9. Báo cáo và nhật ký

- **FR-REPORT-01:** Báo cáo booking theo thời gian, tour, trạng thái và nguồn.
- **FR-REPORT-02:** Báo cáo khách, tỷ lệ hủy, doanh thu, tiền cọc, công nợ và hoàn tiền.
- **FR-REPORT-03:** Báo cáo chi phí và lợi nhuận theo tour.
- **FR-REPORT-04:** Xuất CSV/XLSX/PDF theo quyền.
- **FR-AUDIT-01:** Nhật ký các hành động tạo, sửa, duyệt, hủy, hoàn tiền và phân quyền.

## 6. Mô hình dữ liệu chính

- **User, Role, Permission:** tài khoản và phân quyền.
- **Customer:** hồ sơ khách, liên hệ, yêu cầu đặc biệt.
- **Tour, ItineraryStop:** tour và các điểm trong lịch trình.
- **Departure:** lịch khởi hành, slot và trạng thái.
- **Booking, BookingGuest:** giao dịch đặt tour và thành viên đoàn.
- **Payment, Refund:** thanh toán, đối soát và hoàn tiền.
- **Addon, Voucher, Review:** dịch vụ kèm, ưu đãi và đánh giá.
- **Assignment:** phân công HDV, xe, tài xế, đối tác.
- **TripExecution, Expense:** thực hiện tour, phát sinh và chi phí.
- **Notification, AuditLog:** thông báo và nhật ký.

## 7. Quy tắc và chuyển trạng thái

### 7.1. Booking

- Nháp → Chờ thanh toán khi khách gửi yêu cầu.
- Chờ thanh toán → Đã cọc khi giao dịch đạt mức tối thiểu.
- Đã cọc → Đã xác nhận khi Sale/Điều hành kiểm tra đủ điều kiện.
- Đã xác nhận → Đang thực hiện vào thời điểm tour bắt đầu.
- Đang thực hiện → Hoàn thành sau khi HDV kết thúc tour.
- Đã xác nhận/Đã cọc → Yêu cầu hủy hoặc Yêu cầu đổi khi khách gửi yêu cầu.
- Yêu cầu hủy → Đã hủy sau khi được xử lý và hoàn tiền nếu có.

### 7.2. Ràng buộc

- Slot còn lại = slot tối đa - tổng số khách của booking hợp lệ.
- Không cho số khách âm, tiền âm hoặc ngày đi trong quá khứ khi tạo lịch mới.
- Chỉ vai trò có quyền mới được xác nhận thanh toán, hoàn tiền hoặc duyệt thay đổi.
- Mọi thay đổi giá, chính sách, slot và trạng thái cần có nhật ký.
- OI-01, OI-02 và OI-03 phải có cấu hình/phê duyệt rõ trước khi bật tự động.

## 8. Yêu cầu phi chức năng

- **NFR-01 Hiệu năng:** 95% thao tác tra cứu tour/booking phản hồi trong 2 giây ở tải bình thường.
- **NFR-02 Độ tin cậy:** giao dịch cập nhật booking và slot phải nguyên tử, tránh giữ chỗ vượt số lượng.
- **NFR-03 Bảo mật:** mật khẩu băm mạnh; truyền dữ liệu qua HTTPS; phân quyền ở cả giao diện và API.
- **NFR-04 Dữ liệu:** sao lưu định kỳ, có phục hồi và không xóa cứng dữ liệu nghiệp vụ quan trọng.
- **NFR-05 Audit:** nhật ký gồm người dùng, hành động, đối tượng, thời gian, giá trị trước/sau nếu phù hợp.
- **NFR-06 Khả dụng:** giao diện responsive cho máy tính và điện thoại.
- **NFR-07 Khả năng mở rộng:** tách module tour, booking, thanh toán, điều hành và báo cáo.
- **NFR-08 Trợ năng:** biểu mẫu có nhãn, thông báo lỗi rõ, hỗ trợ bàn phím và tương phản phù hợp.
- **NFR-09 Tích hợp:** có API versioning và cơ chế retry/idempotency cho thanh toán, thông báo.
- **NFR-10 Riêng tư:** chỉ hiển thị thông tin khách cho vai trò cần thiết; hạn chế tải dữ liệu nhạy cảm.

## 9. Xử lý lỗi và ngoại lệ

- Slot thay đổi trong lúc đặt: từ chối xác nhận, hiển thị slot mới và yêu cầu chọn lại.
- Thanh toán trùng mã: đánh dấu cần đối soát, không cộng tiền hai lần.
- Chứng từ không đọc được: chuyển trạng thái cần bổ sung.
- Gửi thông báo thất bại: retry theo chính sách, lưu lỗi và cho phép gửi lại.
- HDV/xe trùng lịch: không cho chốt phân công, yêu cầu chọn nguồn lực khác.
- Hủy/đổi ngoài chính sách: chuyển phê duyệt thủ công, ghi rõ lý do.
- Thời tiết xấu hoặc sự cố: mở yêu cầu điều hành, ghi người quyết định và gửi thông báo.

## 10. Tiêu chí kiểm thử tổng quát

- Tạo booking không vượt slot và cập nhật slot chính xác.
- Thanh toán được liên kết đúng booking, không ghi nhận trùng.
- Booking hủy/đổi đúng chính sách hoặc chuyển phê duyệt khi ngoại lệ.
- Phân công không trùng lịch và được thông báo đúng người.
- Báo cáo tổng hợp khớp với booking, thanh toán và chi phí.
- Người dùng không thể truy cập chức năng ngoài quyền.
- Mọi thay đổi quan trọng có thể truy xuất từ nhật ký.
