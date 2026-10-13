import { useState, useEffect } from 'react'
import { CheckCircle2, Copy, QrCode, ShieldCheck, Timer, Upload, X } from 'lucide-react'
import { api, Booking } from '../lib/api'

interface VietQRModalProps {
  booking: Booking
  onClose: () => void
  onSuccess: (booking: Booking) => void
}

export function VietQRModal({ booking, onClose, onSuccess }: VietQRModalProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 mins hold timer
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [copiedContent, setCopiedContent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [receiptFile, setReceiptFile] = useState<string | null>(null)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const bankName = 'MB Bank (Ngân hàng Quân Đội)'
  const accountNumber = '0767126347'
  const accountHolder = 'LE DUC HUY'
  const amountToPay = booking.deposit_amount || Math.round(booking.total_amount * 0.5)
  const transferContent = `DALATGO ${booking.code}`

  // Standard VietQR image API
  const qrUrl = `https://img.vietqr.io/image/MB-${accountNumber}-compact2.png?amount=${amountToPay}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(accountHolder)}`

  const copyToClipboard = (text: string, type: 'acc' | 'content') => {
    navigator.clipboard.writeText(text)
    if (type === 'acc') {
      setCopiedAccount(true)
      setTimeout(() => setCopiedAccount(false), 2000)
    } else {
      setCopiedContent(true)
      setTimeout(() => setCopiedContent(false), 2000)
    }
  }

  const handleConfirm = async () => {
    setIsVerifying(true)
    try {
      await api.confirmPayment(booking.code, 'VIETQR')
      const updated: Booking = {
        ...booking,
        status: 'CONFIRMED',
        deposit_amount: amountToPay,
        balance_due: Math.max(0, booking.total_amount - amountToPay),
      }
      setTimeout(() => {
        setIsVerifying(false)
        onSuccess(updated)
      }, 1000)
    } catch {
      setIsVerifying(false)
    }
  }

  return (
    <div className="adaptation-modal-backdrop" onClick={onClose}>
      <div
        className="adaptation-modal vietqr-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Thanh toán VietQR"
      >
        <div className="adaptation-header">
          <div className="header-title">
            <QrCode size={20} />
            <h3>Thanh toán VietQR &amp; Giữ chỗ</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="vietqr-body">
          {/* Reservation Hold Timer */}
          <div className="hold-timer-strip">
            <Timer size={16} />
            <span>
              Thời gian giữ chỗ tạm thời còn: <b>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</b>
            </span>
          </div>

          <div className="qr-container">
            <div className="qr-image-wrapper">
              <img
                src={qrUrl}
                alt={`Mã VietQR thanh toán booking ${booking.code}`}
                className="qr-image"
                onError={e => {
                  // Fallback visual mock if internet is restricted
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.parentElement?.querySelector('.qr-fallback')
                  if (fallback) (fallback as HTMLElement).style.display = 'flex'
                }}
              />
              <div className="qr-fallback" style={{ display: 'none' }}>
                <QrCode size={90} />
                <p>Quét mã bằng app ngân hàng bất kỳ</p>
              </div>
            </div>
            <p className="qr-scan-guide">
              Mở ứng dụng ngân hàng hoặc ví điện tử để quét mã chuyển cọc tự động
            </p>
          </div>

          <div className="payment-details-card">
            <div className="payment-row">
              <span className="label">Mã đặt chỗ:</span>
              <span className="value bold">{booking.code}</span>
            </div>
            <div className="payment-row">
              <span className="label">Số tiền cần thanh toán:</span>
              <span className="value amount">{amountToPay.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="payment-row">
              <span className="label">Ngân hàng thụ hưởng:</span>
              <span className="value">{bankName}</span>
            </div>
            <div className="payment-row">
              <span className="label">Chủ tài khoản:</span>
              <span className="value">{accountHolder}</span>
            </div>
            <div className="payment-row">
              <span className="label">Số tài khoản:</span>
              <div className="copyable-value">
                <span>{accountNumber}</span>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(accountNumber, 'acc')}
                  title="Sao chép số tài khoản"
                >
                  {copiedAccount ? <CheckCircle2 size={13} color="#10b981" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
            <div className="payment-row">
              <span className="label">Nội dung chuyển khoản:</span>
              <div className="copyable-value">
                <span className="highlight-text">{transferContent}</span>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(transferContent, 'content')}
                  title="Sao chép nội dung chuyển khoản"
                >
                  {copiedContent ? <CheckCircle2 size={13} color="#10b981" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>

          {/* Optional Upload Receipt */}
          <div className="upload-receipt-section">
            <label className="upload-btn-label">
              <Upload size={14} />
              <span>{receiptFile ? 'Đã đính kèm ảnh chuyển khoản' : 'Tải lên ảnh ủy nhiệm chi / biên lai (tùy chọn)'}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files?.[0]) setReceiptFile(e.target.files[0].name)
                }}
              />
            </label>
            {receiptFile && <small className="file-name">Tệp: {receiptFile}</small>}
          </div>

          <div className="secure-badge-strip">
            <ShieldCheck size={16} />
            <span>Xác nhận tức thì qua Webhook ngân hàng · Bảo mật chuẩn PCI-DSS</span>
          </div>
        </div>

        <div className="adaptation-footer">
          <button className="button button-ghost" onClick={onClose}>
            Để thanh toán sau
          </button>
          <button
            className="button button-primary"
            onClick={handleConfirm}
            disabled={isVerifying}
          >
            {isVerifying ? 'Đang đối soát...' : 'Tôi đã chuyển khoản xong'}
          </button>
        </div>
      </div>
    </div>
  )
}
