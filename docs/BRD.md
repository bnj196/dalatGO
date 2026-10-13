# BRD – DALAT Go

**Phiên bản:** 1.0  
**Ngày:** 2025-02-14  
**Nguồn:** Báo cáo khảo sát và đánh giá hiện trạng của Nhóm 6

## 1. Tổng quan

DALAT Go là nền tảng quản lý và đặt tour du lịch Đà Lạt. Hệ thống số hóa chuỗi nghiệp vụ từ giới thiệu tour, kiểm tra lịch và số chỗ, đặt tour, thanh toán, điều hành đoàn, thực hiện tour đến quyết toán và báo cáo.

## 2. Bối cảnh kinh doanh

Đơn vị hiện bán và điều hành tour qua Zalo, điện thoại, Excel/Google Sheets, Mobile Banking, Word/PDF và hồ sơ giấy. Dữ liệu của một booking bị phân tán giữa Sale, Điều hành, Hướng dẫn viên và Quản lý.

Khảo sát khách hàng ghi nhận:

- 80% từng phải liên hệ nhân viên để hỏi tour còn chỗ.
- 50% từng chờ xác nhận booking hoặc thanh toán.
- 80% cho rằng thông tin giá, lịch trình hoặc điều kiện tour chưa thật rõ ràng.
- 44% gặp khó khăn khi tìm chính sách hủy hoặc đổi tour.
- 85% có nhu cầu sử dụng dịch vụ đi kèm.
- 100% muốn đặt, theo dõi booking, xem lịch trình trên bản đồ và nhận thông báo.
- 96% quan tâm đến review hoặc voucher ưu đãi.

## 3. Vấn đề cần giải quyết

| Mã | Vấn đề | Nguyên nhân | Ảnh hưởng |
|---|---|---|---|
| P01 | Booking và khách hàng chưa được quản lý tập trung | Nhận yêu cầu qua nhiều kênh, nhập lại vào nhiều file | Khó truy vết, thiếu hoặc sai dữ liệu |
| P02 | Slot không được cập nhật nhất quán | Sale phải mở file hoặc hỏi Điều hành | Chậm phản hồi, nguy cơ nhận vượt chỗ |
| P03 | Thanh toán tách khỏi booking | Kiểm tra Mobile Banking và ảnh bill thủ công | Khó đối soát, khó biết còn công nợ |
| P04 | Điều hành và phân công còn thủ công | Tổng hợp file, gửi Zalo | Dễ thiếu thông tin khi lịch thay đổi |
| P05 | Chi phí và doanh thu chưa liên kết | HDV lập bảng kê riêng, Quản lý tổng hợp Excel | Mất thời gian, khó tính hiệu quả từng tour |
| P06 | Phụ thu đón/trả ngoài trung tâm chưa thống nhất | Các vai trò đưa ra cách xử lý khác nhau | Báo giá không nhất quán |
| P07 | Xử lý thời tiết xấu hoặc thay đổi lịch trình chưa rõ | Chưa xác định quyền phê duyệt | Chậm phối hợp, khách nhận thông tin khác nhau |
| P08 | Thời điểm thu tiền còn lại chưa thống nhất | Phụ thuộc từng HDV hoặc trường hợp | Khó theo dõi công nợ |

## 4. Mục tiêu kinh doanh

- Tạo một nguồn dữ liệu thống nhất cho tour, lịch, slot, khách hàng, booking và thanh toán.
- Rút ngắn thời gian tư vấn và xác nhận booking.
- Giảm nhập lại dữ liệu giữa Sale, Điều hành, HDV và Quản lý.
- Kiểm soát số chỗ, trạng thái thanh toán và lịch sử xử lý.
- Chuẩn hóa điều hành đoàn, phân công HDV/xe và cập nhật thay đổi.
- Liên kết doanh thu, chi phí và quyết toán theo tour.
- Cải thiện trải nghiệm khách hàng qua đặt tour, bản đồ, thông báo, review và voucher.

## 5. Các bên liên quan và vai trò

| Bên liên quan | Mối quan tâm |
|---|---|
| Khách hàng | Tìm tour, xem thông tin rõ ràng, đặt và theo dõi booking |
| Nhân viên Sale | Tư vấn, kiểm tra slot, tạo booking, xác nhận thanh toán |
| Điều hành/Tour Manager | Quản lý lịch, chốt đoàn, phân công nguồn lực |
| Hướng dẫn viên | Nhận lịch, danh sách khách, cập nhật thực hiện và chi phí |
| Thu ngân/Kế toán | Đối soát thanh toán, hoàn tiền, doanh thu |
| Quản lý | Quản lý chính sách, phê duyệt, báo cáo, hiệu quả kinh doanh |
| Đối tác | Cung cấp xe, lưu trú, ăn uống và dịch vụ kèm |
| Quản trị hệ thống | Tài khoản, phân quyền, cấu hình và nhật ký hệ thống |

## 6. Phạm vi sản phẩm

### 6.1. Trong phạm vi

1. Quản lý tài khoản, vai trò và phân quyền.
2. Quản lý danh mục tour, lịch trình, giá, chính sách và hình ảnh.
3. Quản lý lịch khởi hành, số chỗ và trạng thái tour.
4. Tìm kiếm, xem chi tiết và so sánh tour.
5. Tạo, xác nhận, cập nhật, hủy và đổi booking.
6. Quản lý khách hàng và thành viên đoàn.
7. Theo dõi tiền cọc, thanh toán còn lại, hoàn tiền và đối soát.
8. Quản lý dịch vụ đi kèm, voucher, review và đánh giá.
9. Chốt đoàn, phân công HDV, xe và đối tác.
10. Gửi thông báo lịch khởi hành, thay đổi và trạng thái booking.
11. Cập nhật thực hiện tour, phát sinh và bảng kê chi phí.
12. Báo cáo booking, khách, doanh thu, chi phí và tour hủy.

### 6.2. Ngoài phạm vi giai đoạn đầu

- Tự động đồng bộ trực tiếp với mọi ngân hàng.
- Điều hành đội xe theo GPS thời gian thực.
- Tự động quyết định xử lý thời tiết hoặc thiên tai.
- Thay thế hoàn toàn các kênh giao tiếp bên ngoài.
- Quản lý kế toán tổng thể ngoài doanh thu, chi phí và đối soát tour.

## 7. Yêu cầu nghiệp vụ cấp cao

| Mã | Yêu cầu |
|---|---|
| BR-01 | Hệ thống phải cung cấp nguồn dữ liệu tập trung cho toàn bộ vòng đời booking. |
| BR-02 | Người dùng phải xem được slot hiện tại trước khi tạo booking. |
| BR-03 | Booking phải có trạng thái, người xử lý, lịch sử và liên kết thanh toán. |
| BR-04 | Hệ thống phải hỗ trợ thanh toán cọc, thanh toán đủ, công nợ và hoàn tiền. |
| BR-05 | Điều hành phải lập được danh sách đoàn và phân công nguồn lực theo lịch. |
| BR-06 | Khách hàng phải nhận được thông báo quan trọng và thay đổi lịch trình. |
| BR-07 | Quản lý phải xem được báo cáo theo tour, thời gian, trạng thái và doanh thu. |
| BR-08 | Những quy tắc chưa thống nhất phải được cấu hình hoặc để trạng thái chờ xác minh, không tự áp đặt. |

## 8. Quy tắc nghiệp vụ đã xác nhận

- **BR-ASIS-01:** Booking chỉ được xác nhận khi khách đã thanh toán tối thiểu theo chính sách, hiện trạng thường là 50% hoặc 100%.
- **BR-ASIS-02:** Số khách không được vượt số chỗ còn lại của xe hoặc đoàn.
- **BR-ASIS-03:** Theo hiện trạng, hủy trước 24 giờ được hoàn 100% tiền cọc; hủy trong vòng 24 giờ không hoàn cọc. Quy tắc cần cho phép Quản lý cấu hình.
- **BR-ASIS-04:** Chính sách giá trẻ em theo chiều cao/độ tuổi phải được cấu hình theo bảng giá.
- **BR-ASIS-05:** Danh sách đoàn và phân công HDV, xe phải hoàn tất trước 21:00 đêm trước ngày khởi hành.
- **BR-ASIS-06:** HDV phải nộp bảng kê chi phí trong vòng 24 giờ sau khi kết thúc tour.
- **OI-01:** Phụ thu đón/trả ngoài trung tâm chưa thống nhất.
- **OI-02:** Quyền quyết định khi thời tiết xấu hoặc sạt lở chưa thống nhất.
- **OI-03:** Thời điểm thu phần tiền còn lại chưa thống nhất.

## 9. Chỉ số thành công đề xuất

- 100% booking được lưu tại một hệ thống tập trung.
- 100% booking có trạng thái thanh toán và lịch sử thao tác.
- Giảm các bước nhập lại thông tin khách và booking.
- Không phát sinh booking vượt slot do dữ liệu hệ thống.
- 100% tour sắp khởi hành có danh sách đoàn và phân công được ghi nhận.
- Báo cáo doanh thu, chi phí có thể truy ngược về booking/tour.
- Khách có thể tự xem thông tin tour, booking và lịch trình.

## 10. Giả định và phụ thuộc

- Đơn vị cung cấp dữ liệu tour, chính sách, lịch và biểu mẫu thật.
- Các quy tắc OI-01, OI-02, OI-03 được xác minh trước khi cấu hình chính thức.
- Thanh toán trực tuyến ở giai đoạn đầu có thể cần nhân viên xác nhận thủ công.
- Người dùng có thiết bị kết nối Internet và số điện thoại/email hợp lệ.

## 11. Tiêu chí chấp nhận cấp sản phẩm

Sản phẩm được xem là đáp ứng BRD khi một booking có thể đi xuyên suốt từ tư vấn, kiểm tra slot, đặt cọc, xác nhận, phân công, thực hiện tour đến quyết toán; mọi trạng thái và người xử lý đều truy xuất được; đồng thời khách và nhân viên nhận được thông tin nhất quán.
