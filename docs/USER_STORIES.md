# User Stories – DALAT Go

## 1. Quy ước ưu tiên

- **Must:** bắt buộc cho MVP.
- **Should:** quan trọng, có thể triển khai sau MVP.
- **Could:** có giá trị nhưng chưa bắt buộc.

## 2. Epic và user stories

### EPIC A – Tài khoản và hồ sơ

#### US-A01 – Đăng ký tài khoản

**Là** khách hàng, **tôi muốn** đăng ký bằng số điện thoại hoặc email **để** lưu hồ sơ và theo dõi booking.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Không cho đăng ký khi email/số điện thoại đã tồn tại.
- Mật khẩu đáp ứng chính sách bảo mật.
- Tài khoản mới ở trạng thái cần xác minh nếu cấu hình yêu cầu.

#### US-A02 – Phân quyền nhân viên

**Là** quản trị viên, **tôi muốn** gán vai trò cho người dùng **để** mỗi người chỉ truy cập nghiệp vụ phù hợp.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Vai trò gồm Khách, Sale, Điều hành, HDV, Kế toán, Quản lý và Admin.
- Người dùng bị khóa không thể đăng nhập.
- Thay đổi quyền được ghi nhật ký.

### EPIC B – Khám phá tour

#### US-B01 – Tìm tour theo nhu cầu

**Là** khách hàng, **tôi muốn** lọc tour theo ngày, giá, thời lượng và loại tour **để** tìm lựa chọn phù hợp.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Kết quả hiển thị giá, ngày, số chỗ và trạng thái.
- Có trạng thái không còn chỗ.
- Bộ lọc có thể xóa và kết hợp.

#### US-B02 – Xem lịch trình trên bản đồ

**Là** khách hàng, **tôi muốn** xem điểm đến và thứ tự lịch trình trên bản đồ **để** hiểu chuyến đi trước khi đặt.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Mỗi điểm có tên, mô tả và thứ tự.
- Lịch trình không có dữ liệu bản đồ vẫn hiển thị dạng danh sách.

#### US-B03 – Xem chính sách rõ ràng

**Là** khách hàng, **tôi muốn** xem giá, điều kiện, phụ thu, hủy và đổi tour trước khi thanh toán **để** tránh nhầm lẫn.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Chính sách được hiển thị ngay trên chi tiết tour và booking.
- Mỗi phiên bản chính sách có thời điểm áp dụng.

### EPIC C – Booking

#### US-C01 – Tạo booking trực tuyến

**Là** khách hàng, **tôi muốn** chọn lịch, số người, điểm đón và dịch vụ kèm **để** đặt tour trong một quy trình.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Hệ thống kiểm tra slot trước khi tạo.
- Thông tin người đặt và khách đi là bắt buộc.
- Hệ thống tính tổng tiền và tiền cọc.
- Booking có mã duy nhất.

#### US-C02 – Sale tạo booking thay khách

**Là** nhân viên Sale, **tôi muốn** tạo booking từ thông tin khách qua điện thoại/Zalo **để** phục vụ khách chưa tự đặt trực tuyến.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Sale chọn được khách đã có hoặc tạo khách mới.
- Hệ thống lưu nguồn booking và người tạo.
- Khách nhận được thông tin booking sau khi tạo.

#### US-C03 – Theo dõi trạng thái booking

**Là** khách hàng, **tôi muốn** xem trạng thái, thanh toán, lịch đi và lịch sử thay đổi **để** biết booking đang ở bước nào.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Hiển thị trạng thái hiện tại và mốc thời gian.
- Hiển thị số tiền đã trả và còn lại.
- Không hiển thị dữ liệu nội bộ ngoài quyền khách.

#### US-C04 – Không nhận vượt slot

**Là** Điều hành, **tôi muốn** slot được cập nhật theo booking hợp lệ **để** không bán vượt khả năng phục vụ.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Hai yêu cầu đồng thời không thể cùng chiếm một slot cuối.
- Booking vượt slot bị từ chối hoặc đưa về chờ xử lý.
- Lịch sử cập nhật slot được truy xuất.

### EPIC D – Thanh toán

#### US-D01 – Thanh toán tiền cọc

**Là** khách hàng, **tôi muốn** thanh toán cọc bằng chuyển khoản, QR hoặc phương thức hỗ trợ **để** giữ chỗ.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Hiển thị số tiền tối thiểu và hạn thanh toán.
- Cho phép tải chứng từ nếu xác nhận thủ công.
- Booking không chuyển xác nhận khi chưa đạt điều kiện.

#### US-D02 – Đối soát giao dịch

**Là** Kế toán, **tôi muốn** liên kết giao dịch với booking **để** biết đúng số tiền đã thu và công nợ.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Có mã giao dịch, số tiền, phương thức và thời gian.
- Giao dịch trùng được cảnh báo.
- Không xóa giao dịch đã xác nhận.

#### US-D03 – Hủy và hoàn tiền

**Là** khách hàng, **tôi muốn** gửi yêu cầu hủy và biết số tiền hoàn dự kiến **để** chủ động quyết định.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Hệ thống áp dụng chính sách đang hiệu lực.
- Ngoài chính sách phải chuyển người có quyền phê duyệt.
- Slot được trả lại sau khi hủy hợp lệ.

### EPIC E – Dịch vụ và trải nghiệm

#### US-E01 – Đặt dịch vụ đi kèm

**Là** khách hàng, **tôi muốn** đặt homestay, xe, cắm trại hoặc HDV riêng cùng tour **để** chuẩn bị trọn chuyến đi.

**Ưu tiên:** Should  
**Tiêu chí chấp nhận:**
- Dịch vụ có giá, thời gian và trạng thái khả dụng.
- Chi phí được cộng vào booking.
- Dịch vụ được gửi cho Điều hành.

#### US-E02 – Dùng voucher

**Là** khách hàng, **tôi muốn** nhập voucher hợp lệ **để** nhận ưu đãi.

**Ưu tiên:** Should  
**Tiêu chí chấp nhận:**
- Kiểm tra thời hạn, điều kiện và số lần dùng.
- Hiển thị số tiền giảm trước xác nhận.

#### US-E03 – Đánh giá tour

**Là** khách hàng, **tôi muốn** đánh giá tour sau khi hoàn thành **để** chia sẻ trải nghiệm cho khách khác.

**Ưu tiên:** Could  
**Tiêu chí chấp nhận:**
- Chỉ booking hoàn thành mới được review.
- Review có điểm, nội dung và thời gian.
- Quản lý có thể ẩn nội dung vi phạm.

### EPIC F – Điều hành

#### US-F01 – Chốt danh sách đoàn

**Là** Điều hành, **tôi muốn** tổng hợp khách từ các booking đã xác nhận **để** chuẩn bị đoàn chính xác.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Danh sách gồm tên, liên hệ, số người, điểm đón và ghi chú.
- Booking chưa đủ điều kiện được cảnh báo.
- Có phiên bản danh sách sau mỗi lần chốt.

#### US-F02 – Phân công HDV và xe

**Là** Điều hành, **tôi muốn** phân công HDV, xe và tài xế **để** tour có đủ nguồn lực.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Hệ thống cảnh báo trùng lịch.
- Người được phân công xem được lịch và danh sách.
- Phân công có trạng thái nháp, đã gửi và xác nhận.

#### US-F03 – Xử lý thay đổi lịch trình

**Là** Quản lý, **tôi muốn** phê duyệt thay đổi do thời tiết hoặc sự cố **để** tránh quyết định không được kiểm soát.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Ghi rõ lý do, người đề xuất và người duyệt.
- Chưa xác định được quy tắc thì yêu cầu phê duyệt thủ công.
- Khách, HDV và Điều hành nhận cùng một thông tin mới.

#### US-F04 – HDV cập nhật thực hiện tour

**Là** HDV, **tôi muốn** xem danh sách khách, điểm đón và ghi nhận phát sinh **để** thực hiện tour đúng kế hoạch.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- HDV chỉ xem tour được phân công.
- Có thể ghi điểm danh, khách đến muộn và sự cố.
- Có thể cập nhật hoàn thành tour.

### EPIC G – Chi phí và báo cáo

#### US-G01 – Nộp bảng kê chi phí

**Là** HDV, **tôi muốn** nhập chi phí và tải chứng từ **để** quyết toán sau tour.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Mỗi khoản có loại, số tiền, thời gian và chứng từ tùy quy định.
- Hệ thống cảnh báo quá hạn 24 giờ.
- Kế toán có thể duyệt hoặc yêu cầu bổ sung.

#### US-G02 – Xem hiệu quả tour

**Là** Quản lý, **tôi muốn** xem doanh thu, chi phí và lợi nhuận theo tour **để** đánh giá hiệu quả kinh doanh.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Dữ liệu lấy từ booking, thanh toán và chi phí.
- Có bộ lọc theo ngày, tour và trạng thái.
- Số liệu có thể truy ngược về bản ghi nguồn.

#### US-G03 – Nhận thông báo đúng thời điểm

**Là** khách hàng, **tôi muốn** nhận nhắc lịch, xác nhận thanh toán và thay đổi tour **để** không bỏ lỡ thông tin quan trọng.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Có thông báo trước giờ khởi hành theo cấu hình.
- Có thông báo khi booking hoặc lịch trình thay đổi.
- Lưu trạng thái gửi và cho phép gửi lại khi lỗi.

#### US-G04 – Tra cứu nhật ký

**Là** Quản lý, **tôi muốn** biết ai đã thay đổi booking, thanh toán hoặc phân công **để** kiểm soát trách nhiệm.

**Ưu tiên:** Must  
**Tiêu chí chấp nhận:**
- Nhật ký có người, hành động, đối tượng và thời gian.
- Không cho người dùng thường sửa hoặc xóa nhật ký.
- Có thể lọc theo booking, tour và người thao tác.

## 3. Definition of Done

Một user story chỉ được xem là hoàn thành khi:

- Đã có giao diện/API và kiểm tra quyền.
- Đã xử lý luồng chính, lỗi nhập liệu và ngoại lệ liên quan.
- Đã có kiểm thử đơn vị và kiểm thử nghiệp vụ phù hợp.
- Dữ liệu và trạng thái được ghi nhận đúng.
- Có nhật ký cho thao tác nhạy cảm.
- Tiêu chí chấp nhận được kiểm thử và nghiệm thu.

## 4. Gợi ý thứ tự MVP

1. Tài khoản, vai trò, tour, lịch khởi hành và slot.
2. Khách hàng, booking và theo dõi trạng thái.
3. Thanh toán thủ công, đối soát và hủy/đổi.
4. Chốt đoàn, phân công HDV/xe và thông báo.
5. Thực hiện tour, chi phí, quyết toán và báo cáo.
6. Dịch vụ đi kèm, voucher, review và tích hợp thanh toán nâng cao.
