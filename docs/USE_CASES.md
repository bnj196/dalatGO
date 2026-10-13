# Use Cases – DALAT Go

## 1. Quy ước

- **Actor chính:** vai trò khởi tạo và chịu trách nhiệm hoàn tất ca sử dụng.
- **Tiền điều kiện:** điều kiện phải có trước khi bắt đầu.
- **Hậu điều kiện:** trạng thái đạt được sau khi kết thúc.
- **Ngoại lệ:** tình huống không đi theo luồng chính.

## UC-01 – Tìm kiếm và xem tour

**Actor:** Khách hàng  
**Mục tiêu:** Tìm tour phù hợp và xem đủ thông tin trước khi đặt.

**Tiền điều kiện:** Tour ở trạng thái công khai.

**Luồng chính:**
1. Khách mở trang tìm tour.
2. Hệ thống hiển thị bộ lọc ngày đi, giá, loại tour, thời lượng, điểm đến và số chỗ.
3. Khách nhập tiêu chí.
4. Hệ thống trả về danh sách tour và lịch khởi hành phù hợp.
5. Khách chọn một tour.
6. Hệ thống hiển thị mô tả, giá, lịch trình, bản đồ, điểm đón, chính sách, dịch vụ kèm và review.

**Ngoại lệ:** Không có kết quả thì hệ thống gợi ý bỏ bớt bộ lọc; lịch đã hết chỗ được hiển thị là hết chỗ và không cho đặt.

**Hậu điều kiện:** Khách có thể chuyển sang UC-02.

## UC-02 – Tạo booking

**Actor:** Khách hàng; Sale hỗ trợ khi cần  
**Mục tiêu:** Đặt chỗ cho một lịch khởi hành.

**Tiền điều kiện:** Khách đã chọn tour; lịch còn slot.

**Luồng chính:**
1. Khách chọn ngày đi, số lượng khách và dịch vụ đi kèm.
2. Hệ thống tạm giữ slot trong thời gian cấu hình.
3. Khách nhập thông tin người đặt, thành viên đoàn, điểm đón và yêu cầu đặc biệt.
4. Hệ thống tính giá tour, phụ thu, dịch vụ và voucher.
5. Khách xác nhận thông tin và chính sách.
6. Hệ thống tạo mã booking ở trạng thái Chờ thanh toán.
7. Hệ thống hiển thị số tiền cọc tối thiểu và hướng dẫn thanh toán.

**Ngoại lệ:** Slot không còn đủ thì giải phóng giữ chỗ; voucher không hợp lệ thì không áp dụng; thiếu thông tin bắt buộc thì báo trường lỗi.

**Hậu điều kiện:** Booking được lưu và có thể thanh toán.

## UC-03 – Thanh toán và xác nhận booking

**Actor:** Khách hàng, Sale, Thu ngân/Kế toán  
**Mục tiêu:** Ghi nhận khoản thanh toán và xác nhận booking.

**Luồng chính:**
1. Khách chọn phương thức thanh toán.
2. Hệ thống tạo yêu cầu thanh toán hoặc hướng dẫn chuyển khoản.
3. Khách thanh toán và tải chứng từ nếu cần.
4. Hệ thống ghi nhận giao dịch ở trạng thái Chờ xác nhận.
5. Thu ngân/Sale kiểm tra số tiền, thời gian và mã giao dịch.
6. Nhân viên xác nhận giao dịch.
7. Hệ thống cập nhật số tiền đã thu, công nợ và trạng thái booking.
8. Nếu đủ điều kiện, booking chuyển sang Đã cọc hoặc Đã xác nhận.
9. Hệ thống gửi thông báo cho khách.

**Ngoại lệ:** Chứng từ sai, giao dịch không tìm thấy hoặc trùng mã thì chuyển Cần bổ sung/Cần đối soát; không cộng tiền lần hai.

## UC-04 – Quản lý hủy hoặc đổi booking

**Actor:** Khách hàng, Sale, Quản lý  
**Mục tiêu:** Xử lý yêu cầu hủy/đổi minh bạch theo chính sách.

**Luồng chính:**
1. Khách mở booking và chọn Hủy hoặc Đổi lịch.
2. Hệ thống hiển thị điều kiện, phí và số tiền hoàn dự kiến.
3. Khách nhập lý do và gửi yêu cầu.
4. Hệ thống kiểm tra thời điểm, trạng thái booking và chính sách.
5. Nếu đúng chính sách, hệ thống tạo yêu cầu xử lý.
6. Người có quyền phê duyệt.
7. Hệ thống cập nhật booking, slot và khoản hoàn/thu thêm.
8. Hệ thống thông báo kết quả.

**Ngoại lệ:** Ngoài chính sách thì chuyển phê duyệt thủ công; không đủ slot cho ngày đổi thì đề xuất ngày khác.

## UC-05 – Quản lý tour và lịch khởi hành

**Actor:** Quản lý, Điều hành  
**Mục tiêu:** Cung cấp dữ liệu tour và slot chính xác.

**Luồng chính:**
1. Người dùng tạo hoặc mở tour.
2. Nhập thông tin tour, lịch trình, điểm bản đồ, giá và chính sách.
3. Tạo lịch khởi hành, slot tối đa và thời gian tập trung.
4. Hệ thống kiểm tra dữ liệu bắt buộc.
5. Người dùng lưu bản nháp hoặc công khai.
6. Hệ thống ghi phiên bản và nhật ký.

**Ngoại lệ:** Không cho công khai nếu thiếu giá, lịch trình, slot hoặc chính sách; thay đổi lịch đã có booking cần quy trình thông báo/phê duyệt.

## UC-06 – Chốt đoàn và phân công nguồn lực

**Actor:** Điều hành  
**Mục tiêu:** Chuẩn bị nhân sự và phương tiện cho tour.

**Tiền điều kiện:** Có booking đã xác nhận.

**Luồng chính:**
1. Điều hành mở lịch khởi hành.
2. Hệ thống tổng hợp danh sách khách từ booking.
3. Điều hành kiểm tra thanh toán, điểm đón và yêu cầu đặc biệt.
4. Điều hành chọn HDV, xe, tài xế và đối tác.
5. Hệ thống kiểm tra trùng lịch và khả dụng.
6. Điều hành chốt danh sách và phân công.
7. Hệ thống gửi thông tin cho HDV, đối tác và khách liên quan.

**Ngoại lệ:** Nguồn lực bị trùng hoặc không khả dụng thì không cho chốt; booking thay đổi sau khi chốt tạo cảnh báo cần xử lý.

## UC-07 – Thực hiện và cập nhật tour

**Actor:** HDV, Điều hành  
**Mục tiêu:** Theo dõi tình trạng tour và phát sinh thực tế.

**Luồng chính:**
1. HDV xem lịch, danh sách khách và điểm đón.
2. HDV cập nhật đã nhận tour và điểm danh.
3. Hệ thống ghi nhận khách đến muộn, vắng hoặc yêu cầu đặc biệt.
4. HDV cập nhật trạng thái đang thực hiện.
5. HDV ghi nhận phát sinh, thay đổi lịch trình và chi phí.
6. Điều hành/Quản lý phê duyệt thay đổi nếu cần.
7. HDV cập nhật hoàn thành tour.

**Ngoại lệ:** Thời tiết xấu hoặc sạt lở thì mở yêu cầu xử lý, ghi người quyết định và gửi thông báo mới; không tự áp dụng OI-02 khi chưa có quy tắc.

## UC-08 – Quyết toán tour

**Actor:** HDV, Thu ngân/Kế toán, Quản lý  
**Mục tiêu:** Liên kết doanh thu và chi phí theo tour.

**Luồng chính:**
1. HDV mở tour đã hoàn thành.
2. Nhập khoản chi, loại chi, số tiền và tải chứng từ.
3. Gửi bảng kê trong thời hạn.
4. Kế toán kiểm tra chứng từ và đối chiếu tiền đã thu.
5. Kế toán duyệt hoặc trả lại để bổ sung.
6. Hệ thống tổng hợp doanh thu, chi phí và lợi nhuận.
7. Quản lý xem báo cáo.

**Ngoại lệ:** Thiếu chứng từ hoặc sai số tiền thì trả lại và ghi lý do; quá hạn tạo cảnh báo.

## UC-09 – Gửi thông báo

**Actor:** Hệ thống, Nhân viên  
**Mục tiêu:** Đảm bảo thông tin đúng người, đúng thời điểm.

**Luồng chính:**
1. Sự kiện nghiệp vụ phát sinh.
2. Hệ thống xác định người nhận và mẫu thông báo.
3. Gửi qua push/email/SMS hoặc kênh được cấu hình.
4. Lưu trạng thái gửi.
5. Retry hoặc tạo cảnh báo khi thất bại.

## UC-10 – Báo cáo và tra cứu nhật ký

**Actor:** Quản lý, Kế toán, Quản trị hệ thống  
**Mục tiêu:** Theo dõi hoạt động và truy vết thay đổi.

**Luồng chính:**
1. Người dùng chọn loại báo cáo, khoảng thời gian và bộ lọc.
2. Hệ thống kiểm tra quyền.
3. Hệ thống tổng hợp dữ liệu từ tour, booking, thanh toán và chi phí.
4. Hiển thị, cho phép xuất file.
5. Quản trị viên tra cứu AuditLog theo người dùng, hành động, đối tượng và thời gian.

## Ma trận actor – use case

| Use case | Khách | Sale | Điều hành | HDV | Kế toán | Quản lý | Admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| UC-01 Tìm tour | ✓ | ✓ |  |  |  | ✓ |  |
| UC-02 Booking | ✓ | ✓ |  |  |  |  |  |
| UC-03 Thanh toán | ✓ | ✓ |  |  | ✓ |  |  |
| UC-04 Hủy/đổi | ✓ | ✓ |  |  | ✓ | ✓ |  |
| UC-05 Quản lý tour |  |  | ✓ |  |  | ✓ |  |
| UC-06 Phân công |  |  | ✓ |  |  | ✓ |  |
| UC-07 Thực hiện tour |  |  | ✓ | ✓ |  |  |  |
| UC-08 Quyết toán |  |  |  | ✓ | ✓ | ✓ |  |
| UC-09 Thông báo | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| UC-10 Báo cáo |  |  | ✓ |  | ✓ | ✓ | ✓ |
