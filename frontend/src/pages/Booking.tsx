import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
  Camera,
  Shirt,
  Tent,
  Ticket,
  Star,
  Clock,
  Compass,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, Departure, Tour, Booking, Review } from '../lib/api'
import { tourImage } from './Public'
import { VietQRModal } from '../components/VietQRModal'


const AVAILABLE_ADDONS = [
  {
    id: 'addon_costume',
    name: 'Thuê trang phục vintage chụp ảnh',
    price: 90000,
    unit: 'bộ',
    icon: Shirt,
  },
  {
    id: 'addon_flycam',
    name: 'Gói chụp ảnh & quay Flycam kỷ niệm',
    price: 250000,
    unit: 'người',
    icon: Camera,
  },
  {
    id: 'addon_glamping',
    name: 'Nâng cấp Lều Glamping cao cấp ven hồ',
    price: 350000,
    unit: 'lều',
    icon: Tent,
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@dalatgo.local')
  const [password, setPassword] = useState('Admin123!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await api.login(email, password)
      localStorage.setItem('dalatgo_token', result.access_token)
      const me = await api.me()
      localStorage.setItem('dalatgo_role', me.role)
      navigate(me.role === 'ADMIN' ? '/admin' : '/tours')
    } catch {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page content-ecommerce">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="brand-mark">
            <ShieldCheck size={22} />
          </span>
          <span>
            DALAT <b>Go</b>
          </span>
        </div>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Chào mừng trở lại.</h1>
        <p className="muted">Đăng nhập tài khoản để quản lý đặt tour và vận hành chuyến đi.</p>

        <form onSubmit={submit} className="form-stack">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="button button-primary full" type="submit" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="back-link">
            <ArrowLeft size={15} /> Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  )
}

export function TourDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tour, setTour] = useState<Tour>()
  const [departures, setDepartures] = useState<Departure[]>([])
  const [selected, setSelected] = useState('')
  const [guests, setGuests] = useState(1)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [pickup, setPickup] = useState('Chợ Đà Lạt, Phường 1')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMsg, setPromoMsg] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  // Review form
  const [reviewerName, setReviewerName] = useState('')
  const [reviewerRating, setReviewerRating] = useState(5)
  const [reviewerComment, setReviewerComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  useEffect(() => {
    api
      .tours()
      .then(items => {
        const found = items.find(x => x.id === id || x.code === id) || items[0]
        setTour(found)
        if (found) {
          api
            .departures()
            .then(deps => {
              const matched = deps.filter(item => item.tour_id === found.id)
              setDepartures(matched)
            })
            .catch(() => setDepartures([]))
          void api.getReviews(found.id).then(setReviews).catch(() => setReviews([]))
        }
      })
      .catch(() => {
        setTour(undefined)
        setDepartures([])
      })
  }, [id])

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId) ? prev.filter(x => x !== addonId) : [...prev, addonId]
    )
  }

  const applyPromo = () => {
    const codeUpper = promoCode.trim().toUpperCase()
    if (codeUpper === 'DALAT2026') {
      setPromoDiscount(100000)
      setPromoMsg('Đã áp dụng mã DALAT2026: Giảm 100.000 đ!')
    } else if (codeUpper === 'CHILLDALAT') {
      setPromoDiscount(150000)
      setPromoMsg('Đã áp dụng mã CHILLDALAT: Giảm 150.000 đ!')
    } else {
      setPromoDiscount(0)
      setPromoMsg('Mã ưu đãi không hợp lệ hoặc đã hết hạn.')
    }
  }

  // Calculate pricing breakdown
  const basePrice = tour ? tour.base_price : 690000
  const tourTotal = basePrice * guests
  const addonsTotal = selectedAddons.reduce((sum, addId) => {
    const item = AVAILABLE_ADDONS.find(a => a.id === addId)
    return sum + (item ? item.price : 0)
  }, 0)

  // Group discount: >= 4 guests get 5% off
  const groupDiscount = guests >= 4 ? Math.round(tourTotal * 0.05) : 0
  const totalDiscount = promoDiscount + groupDiscount
  const finalTotal = Math.max(0, tourTotal + addonsTotal - totalDiscount)
  const depositRequired = Math.round(finalTotal * 0.5)

  const handleBooking = async () => {
    if (!selected) {
      setMessage('Vui lòng chọn ngày khởi hành phù hợp.')
      return
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setMessage('Vui lòng nhập Họ tên và Số điện thoại liên hệ để nhận vé.')
      return
    }

    setSubmitting(true)
    setMessage('')
    try {
      const newBooking = await api.createBooking({
        departure_id: selected,
        guest_count: guests,
        pickup_location: pickup,
        customer_name: customerName,
        customer_phone: customerPhone,
        addons: selectedAddons,
        promo_code: promoCode,
        discount_amount: totalDiscount,
        total_amount: finalTotal,
      })
      setActiveBooking(newBooking)
      setMessage(`Tạo booking thành công (${newBooking.code}). Vui lòng quét mã cọc giữ chỗ!`)
    } catch {
      setMessage('Không thể kết nối máy chủ, vui lòng thử lại!')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!reviewerName || !reviewerComment || !tour) return
    const newRev = await api.submitReview({
      tour_id: tour.id,
      user_name: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment,
      verified: true,
    })
    setReviews(prev => [newRev, ...prev])
    setReviewerComment('')
    setReviewSubmitted(true)
  }

  if (!tour) {
    return (
      <main className="page content-ecommerce">
        <div className="empty-card">Đang tải chi tiết hành trình...</div>
      </main>
    )
  }

  const imgSrc = tourImage(tour.code)

  return (
    <main className="page content-ecommerce">
      <Link to="/tours" className="back-link">
        <ArrowLeft size={15} /> Tất cả hành trình
      </Link>

      <section className="detail-layout">
        <div>
          <div className="detail-image">
            <span>{tour.tour_type}</span>
            <div className="image-placeholder large">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={tour.name}
                  onError={e => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                tour.name.slice(0, 1)
              )}
            </div>
          </div>

          <div className="detail-copy">
            <p className="eyebrow">{tour.tour_type} · DALAT GO SIGNATURE</p>
            <h1>{tour.name}</h1>
            <p className="lead">
              {tour.description ||
                'Một hành trình chậm rãi qua những điểm đến đẹp nhất của Đà Lạt, lưu lại những bức ảnh kỷ niệm khó quên.'}
            </p>

            <div className="detail-facts">
              <span>
                <CalendarDays /> {Math.round(tour.duration_minutes / 60)} giờ trải nghiệm
              </span>
              <span>
                <MapPin /> Đà Lạt, Lâm Đồng
              </span>
              <span>
                <CheckCircle2 /> Nhóm nhỏ chu đáo (dưới 12 khách)
              </span>
            </div>

            {/* Interactive Timeline Stops */}
            <h2>Lộ trình chi tiết theo giờ</h2>
            <div className="itinerary-timeline">
              <div className="timeline-stop">
                <span className="stop-time">05:00 - 05:30</span>
                <div className="stop-content">
                  <strong>Xe đón tại khách sạn / homestay trung tâm Đà Lạt</strong>
                  <p>HDV điểm danh, phát nước suối và kiểm tra trang phục ấm của quý khách.</p>
                </div>
              </div>

              <div className="timeline-stop">
                <span className="stop-time">05:45 - 07:30</span>
                <div className="stop-content">
                  <strong>Đón bình minh &amp; Săn biển mây Cầu Đất</strong>
                  <p>Chiêm ngưỡng thung lũng mây bồng bềnh, chụp ảnh với đồi chè cổ thụ xanh mướt và quạt gió khổng lồ.</p>
                </div>
              </div>

              <div className="timeline-stop">
                <span className="stop-time">08:00 - 09:30</span>
                <div className="stop-content">
                  <strong>Thưởng thức cà phê đặc sản view thung lũng</strong>
                  <p>Dùng điểm tâm sáng nhẹ, nhâm nhi ly cà phê Arabica Cầu Đất ấm áp ngắm nắng sớm.</p>
                </div>
              </div>

              <div className="timeline-stop">
                <span className="stop-time">10:00 - 11:30</span>
                <div className="stop-content">
                  <strong>Khám phá vườn dâu tây công nghệ cao &amp; mua quà lưu niệm</strong>
                  <p>Tự tay hái những trái dâu chín mọng, chụp ảnh tại vườn hoa cẩm tú cầu rực rỡ.</p>
                </div>
              </div>

              <div className="timeline-stop">
                <span className="stop-time">12:00</span>
                <div className="stop-content">
                  <strong>Xe đưa quý khách về lại khách sạn</strong>
                  <p>Kết thúc chuyến đi trọn vẹn, HDV hỗ trợ gửi ảnh lưu niệm chất lượng cao qua Zalo.</p>
                </div>
              </div>
            </div>

            {/* Tour Reviews Section */}
            <div className="tour-reviews-box" style={{ marginTop: '40px' }}>
              <h2>Đánh giá từ du khách ({reviews.length})</h2>
              <div className="reviews-list-compact">
                {reviews.map(rev => (
                  <div key={rev.id} className="review-card-compact">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{rev.user_name}</strong>
                      <span style={{ color: '#f59e0b', fontSize: '12px' }}>★ {rev.rating}</span>
                    </div>
                    <p>"{rev.comment}"</p>
                    <small style={{ color: 'var(--muted)' }}>{rev.date}</small>
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <form onSubmit={handleReviewSubmit} className="add-review-form">
                <h4>Gửi cảm nhận chuyến đi của bạn</h4>
                {reviewSubmitted && (
                  <div className="form-success">Cảm ơn bạn đã gửi đánh giá! Cảm nhận đã được ghi nhận.</div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    placeholder="Họ tên của bạn..."
                    value={reviewerName}
                    onChange={e => setReviewerName(e.target.value)}
                    required
                  />
                  <select
                    value={reviewerRating}
                    onChange={e => setReviewerRating(Number(e.target.value))}
                  >
                    <option value={5}>5 sao (Tuyệt vời)</option>
                    <option value={4}>4 sao (Hài lòng)</option>
                    <option value={3}>3 sao (Bình thường)</option>
                  </select>
                </div>
                <textarea
                  placeholder="Chia sẻ khoảnh khắc và trải nghiệm của bạn..."
                  rows={2}
                  value={reviewerComment}
                  onChange={e => setReviewerComment(e.target.value)}
                  required
                />
                <button type="submit" className="button button-ghost" style={{ alignSelf: 'flex-start' }}>
                  Đăng đánh giá
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Booking Sidebar Panel */}
        <aside className="booking-panel">
          <p className="eyebrow">ĐẶT HÀNH TRÌNH</p>
          <h2>
            {tour.base_price.toLocaleString('vi-VN')} <small>đ / người</small>
          </h2>

          <label>
            Họ tên người đại diện
            <input
              placeholder="Nguyễn Văn A..."
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              required
            />
          </label>

          <label>
            Số điện thoại nhận vé
            <input
              placeholder="09xx xxx xxx..."
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Ngày khởi hành
            <select value={selected} onChange={e => setSelected(e.target.value)}>
              <option value="">Chọn ngày khởi hành</option>
              {departures.map(d => (
                <option key={d.id} value={d.id}>
                  {d.departure_date} · Còn {d.max_capacity - d.booked_capacity} chỗ
                </option>
              ))}
            </select>
          </label>

          <label>
            Số khách tham gia
            <input
              type="number"
              min="1"
              max="20"
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
            />
            {guests >= 4 && (
              <small style={{ color: '#10b981', display: 'block', marginTop: '4px' }}>
                🎉 Ưu đãi nhóm: Giảm 5% cho đoàn từ 4 khách!
              </small>
            )}
          </label>

          <label>
            Điểm đón tại Đà Lạt
            <input value={pickup} onChange={e => setPickup(e.target.value)} />
          </label>

          {/* Add-ons selection */}
          <div className="addons-section">
            <span className="addons-title">Dịch vụ bổ sung (Add-ons):</span>
            {AVAILABLE_ADDONS.map(addon => {
              const Icon = addon.icon
              const isChecked = selectedAddons.includes(addon.id)
              return (
                <div
                  key={addon.id}
                  className={`addon-item ${isChecked ? 'selected' : ''}`}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <input type="checkbox" checked={isChecked} readOnly />
                  <Icon size={16} color="var(--teal)" />
                  <div className="addon-info">
                    <span>{addon.name}</span>
                    <small>+{addon.price.toLocaleString('vi-VN')} đ / {addon.unit}</small>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Promo Code Input */}
          <div className="promo-section">
            <span className="addons-title">Mã giảm giá (Voucher):</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                placeholder="Nhập DALAT2026..."
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                style={{ flex: 1, textTransform: 'uppercase' }}
              />
              <button
                type="button"
                className="button button-ghost"
                onClick={applyPromo}
                style={{ padding: '0 14px' }}
              >
                Áp dụng
              </button>
            </div>
            {promoMsg && (
              <small style={{ color: promoDiscount > 0 ? '#10b981' : 'var(--orange)', display: 'block', marginTop: '4px' }}>
                {promoMsg}
              </small>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="booking-breakdown-card">
            <div className="breakdown-row">
              <span>Vé tour ({guests} khách):</span>
              <span>{tourTotal.toLocaleString('vi-VN')} đ</span>
            </div>
            {addonsTotal > 0 && (
              <div className="breakdown-row">
                <span>Dịch vụ thêm:</span>
                <span>+{addonsTotal.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
            {totalDiscount > 0 && (
              <div className="breakdown-row discount">
                <span>Giảm giá ưu đãi:</span>
                <span>-{totalDiscount.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
            <div className="breakdown-row total">
              <span>Tổng thanh toán:</span>
              <strong>{finalTotal.toLocaleString('vi-VN')} đ</strong>
            </div>
            <div className="breakdown-row deposit">
              <span>Tiền cọc giữ chỗ (50%):</span>
              <b>{depositRequired.toLocaleString('vi-VN')} đ</b>
            </div>
          </div>

          {message && (
            <div className={message.includes('Vui lòng') ? 'form-error' : 'form-success'}>
              {message}
            </div>
          )}

          <button
            onClick={handleBooking}
            className="button button-primary full"
            disabled={submitting}
          >
            {submitting ? 'Đang tạo booking...' : 'Đặt tour & Nhận vé ngay'} <ArrowRight size={16} />
          </button>

          <p className="secure-note">
            <LockKeyhole size={14} /> Tự động giữ chỗ 15 phút · Bảo mật an toàn
          </p>
        </aside>
      </section>

      {/* VietQR Payment Modal */}
      {activeBooking && (
        <VietQRModal
          booking={activeBooking}
          onClose={() => setActiveBooking(null)}
          onSuccess={updated => {
            setActiveBooking(null)
            navigate('/lookup')
          }}
        />
      )}
    </main>
  )
}
