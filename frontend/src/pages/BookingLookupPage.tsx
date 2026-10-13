import { useState } from 'react'
import {
  Search,
  QrCode,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Printer,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { api, Booking } from '../lib/api'
import { VietQRModal } from '../components/VietQRModal'

export function BookingLookupPage() {
  const [code, setCode] = useState('DLG-9021')
  const [phone, setPhone] = useState('')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('')

  const handleSearch = async (targetCode = code, targetPhone = phone) => {
    if (!targetCode.trim()) return
    setLoading(true)
    setSearched(true)
    setCancelSuccessMsg('')
    try {
      const res = await api.lookupBooking(targetCode, targetPhone)
      setBooking(res)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRequest = async () => {
    if (!booking) return
    const res = await api.requestCancelBooking(booking.code, cancelReason || 'Kế hoạch cá nhân thay đổi')
    setCancelSuccessMsg(
      `Đã tiếp nhận yêu cầu hủy/đổi booking ${booking.code}. Mức hoàn dự kiến: ${res.refundPercentage}%. Nhân viên phụ trách sẽ liên hệ trong 2 giờ!`
    )
    setCancelModalOpen(false)
    setBooking(prev => (prev ? { ...prev, status: 'CANCEL_REQUESTED' } : null))
  }

  return (
    <main className="page content-ecommerce">
      <section className="page-intro">
        <p className="eyebrow">DALAT GO CUSTOMER PORTAL</p>
        <h1>
          Tra cứu Booking<br />
          <em>&amp; Vé điện tử (E-Ticket)</em>
        </h1>
        <p>Kiểm tra thông tin hành trình, mã QR điểm danh lên xe và lịch sử thanh toán.</p>
      </section>

      {/* Search Bar */}
      <div className="search-bar lookup-bar">
        <Search size={19} />
        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Nhập mã đặt chỗ (VD: DLG-9021)..."
          aria-label="Mã đặt chỗ"
        />
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Số điện thoại (tùy chọn)..."
          aria-label="Số điện thoại"
          style={{ maxWidth: '200px' }}
        />
        <button className="button button-primary" onClick={() => handleSearch(code, phone)}>
          {loading ? 'Đang tìm...' : 'Tra cứu vé'}
        </button>
      </div>

      <div className="demo-lookup-hints">
        <small>Thử nhanh mã mẫu:</small>
        <button
          className="hint-btn"
          onClick={() => {
            setCode('DLG-9021')
            handleSearch('DLG-9021', '')
          }}
        >
          DLG-9021 (Đã xác nhận &amp; Thanh toán đủ)
        </button>
        <button
          className="hint-btn"
          onClick={() => {
            setCode('DLG-8843')
            handleSearch('DLG-8843', '')
          }}
        >
          DLG-8843 (Chờ thanh toán cọc)
        </button>
      </div>

      {cancelSuccessMsg && <div className="form-success">{cancelSuccessMsg}</div>}

      {/* Result Section */}
      {searched && !loading && !booking && (
        <div className="empty-card">
          Không tìm thấy booking khớp với mã <b>{code}</b>. Vui lòng kiểm tra lại tin nhắn xác nhận hoặc liên hệ hotline 1900-DALAT.
        </div>
      )}

      {booking && (
        <div className="e-ticket-card">
          <div className="ticket-top-ribbon">
            <div className="ribbon-brand">
              <span className="brand-mark small">★</span>
              <span>DALAT <b>Go</b> OFFICIAL E-TICKET</span>
            </div>
            <span
              className={`status ${
                booking.status === 'CONFIRMED'
                  ? 'active'
                  : booking.status === 'CANCEL_REQUESTED'
                  ? 'inactive'
                  : 'warning'
              }`}
            >
              {booking.status === 'CONFIRMED'
                ? 'ĐÃ XÁC NHẬN CHỖ'
                : booking.status === 'CANCEL_REQUESTED'
                ? 'ĐANG XỬ LÝ HỦY/ĐỔI'
                : 'CHỜ THANH TOÁN CỌC'}
            </span>
          </div>

          <div className="ticket-main-grid">
            <div className="ticket-info-col">
              <span className="eyebrow">THÔNG TIN HÀNH TRÌNH</span>
              <h2 className="ticket-tour-title">
                {booking.code === 'DLG-9021'
                  ? 'Săn mây Cầu Đất & đồi chè xanh'
                  : 'Ba thác hoang sơ Đà Lạt'}
              </h2>

              <div className="ticket-details-grid">
                <div className="detail-item">
                  <Calendar size={16} />
                  <div>
                    <label>Ngày khởi hành</label>
                    <strong>18/10/2026</strong>
                  </div>
                </div>

                <div className="detail-item">
                  <Clock size={16} />
                  <div>
                    <label>Giờ đón dự kiến</label>
                    <strong>05:00 Sáng</strong>
                  </div>
                </div>

                <div className="detail-item">
                  <MapPin size={16} />
                  <div>
                    <label>Điểm đón</label>
                    <strong>{booking.pickup_location}</strong>
                  </div>
                </div>

                <div className="detail-item">
                  <Users size={16} />
                  <div>
                    <label>Số lượng khách</label>
                    <strong>{booking.guest_count} khách</strong>
                  </div>
                </div>
              </div>

              <div className="ticket-finance-strip">
                <div>
                  <span className="lbl">Tổng tiền tour:</span>
                  <strong>{booking.total_amount.toLocaleString('vi-VN')} đ</strong>
                </div>
                <div>
                  <span className="lbl">Đã thanh toán:</span>
                  <strong style={{ color: '#10b981' }}>
                    {(booking.deposit_amount || 0).toLocaleString('vi-VN')} đ
                  </strong>
                </div>
                <div>
                  <span className="lbl">Còn lại cần thu khi đón:</span>
                  <strong style={{ color: booking.balance_due ? 'var(--orange)' : 'var(--muted)' }}>
                    {(booking.balance_due || 0).toLocaleString('vi-VN')} đ
                  </strong>
                </div>
              </div>
            </div>

            {/* QR Check-in Box */}
            <div className="ticket-qr-col">
              <div className="qr-badge-card">
                <div className="qr-box">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      `DALATGO:${booking.code}:${booking.guest_count}PAX`
                    )}`}
                    alt={`Mã vé ${booking.code}`}
                    className="qr-img"
                  />
                </div>
                <strong className="qr-booking-code">{booking.code}</strong>
                <small>Xuất trình mã này cho Hướng dẫn viên khi lên xe</small>
              </div>

              <div className="ticket-actions">
                {booking.status === 'PENDING_PAYMENT' && (
                  <button
                    className="button button-primary full"
                    onClick={() => setShowQRModal(true)}
                  >
                    <CreditCard size={15} /> Thanh toán VietQR ngay
                  </button>
                )}

                <button
                  className="button button-ghost full"
                  onClick={() => window.print()}
                >
                  <Printer size={15} /> In / Lưu vé PDF
                </button>

                <button
                  className="cancel-link-btn"
                  onClick={() => setCancelModalOpen(true)}
                >
                  <RotateCcw size={14} /> Yêu cầu đổi ngày / hủy vé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VietQR Modal */}
      {showQRModal && booking && (
        <VietQRModal
          booking={booking}
          onClose={() => setShowQRModal(false)}
          onSuccess={updated => {
            setBooking(updated)
            setShowQRModal(false)
          }}
        />
      )}

      {/* Cancel / Reschedule Modal */}
      {cancelModalOpen && (
        <div className="adaptation-modal-backdrop" onClick={() => setCancelModalOpen(false)}>
          <div className="adaptation-modal" onClick={e => e.stopPropagation()}>
            <div className="adaptation-header">
              <div className="header-title">
                <AlertTriangle size={18} color="var(--orange)" />
                <h3>Chính sách Đổi ngày &amp; Hủy vé</h3>
              </div>
            </div>
            <div className="cancel-policy-box">
              <p>Mức hoàn phí theo thời điểm trước giờ khởi hành:</p>
              <ul>
                <li>• Trước 72h (3 ngày): <b>Hoàn 100% tiền cọc</b></li>
                <li>• Trước 24h - 48h: <b>Hoàn 70%</b> (phí giữ chỗ 30%)</li>
                <li>• Trong vòng 24h trước giờ đi: <b>Hoàn 50%</b></li>
              </ul>
              <label style={{ display: 'block', marginTop: '14px', fontSize: '13px', fontWeight: '700' }}>
                Lý do yêu cầu hủy hoặc dời ngày:
                <textarea
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    marginTop: '6px',
                    fontFamily: 'inherit',
                  }}
                  rows={3}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="Ví dụ: Thay đổi chuyến bay hoặc muốn đổi sang ngày 25/10..."
                />
              </label>
            </div>
            <div className="adaptation-footer">
              <button className="button button-ghost" onClick={() => setCancelModalOpen(false)}>
                Giữ lại vé
              </button>
              <button className="button button-primary" onClick={handleCancelRequest}>
                Gửi yêu cầu hủy/đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
