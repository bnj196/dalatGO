import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, Search, Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api, Tour } from '../lib/api'
const TOUR_IMAGES: Record<string, string> = {
  'DL-01': 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
  'DL-02': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
  'DL-03': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
  'DL-04': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
  'DL-05': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=85',
  'DL-06': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=85',
  'DL-07': 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
  'DL-08': 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85',
  'DL-09': 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85',
  'DL-10': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85',
  'DL-11': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85',
  'DL-12': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=85',
}

export function tourImage(code: string): string | undefined { return TOUR_IMAGES[code] }

export function HomePage() {
  return <main>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow light">ĐI ĐỂ NHỚ · SỐNG ĐỂ KỂ</p>
        <h1>Chạm vào vẻ đẹp<br /><em>rất riêng</em> của Đà Lạt.</h1>
        <p className="hero-text">Những hành trình được tuyển chọn để bạn chậm lại, hít thở và lưu giữ những khoảnh khắc đẹp nhất.</p>
        <Link to="/tours" className="button button-light">Khám phá hành trình <ArrowRight size={17} /></Link>
      </div>
      <div className="hero-badge"><Star size={15} fill="currentColor" /> <span>Được yêu thích bởi<br /><b>hàng nghìn du khách</b></span></div>
    </section>
    <section className="feature-strip"><div><CheckCircle2 /> <span><b>Tour chọn lọc</b><small>Trải nghiệm đáng tin cậy</small></span></div><div><Users /> <span><b>Nhóm nhỏ</b><small>Riêng tư và thoải mái</small></span></div><div><CalendarDays /> <span><b>Lịch linh hoạt</b><small>Dễ dàng đặt và đổi lịch</small></span></div></section>
    <FeaturedTours />
  </main>
}

function FeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([])
  useEffect(() => { api.tours().then(setTours).catch(() => setTours([])) }, [])
  return <section className="section tour-section"><div className="section-heading"><div><p className="eyebrow">GỢI Ý CHO BẠN</p><h2>Những hành trình đang được yêu thích</h2></div><Link to="/tours" className="text-link">Xem tất cả <ArrowRight size={16} /></Link></div><div className="tour-grid">{tours.length ? tours.slice(0, 3).map(tour => <TourCard key={tour.id} tour={tour} />) : <div className="empty-card">Chưa có tour công khai. Hãy đăng nhập quản trị để tạo tour đầu tiên.</div>}</div></section>
}

export function ToursPage() {
  const [search, setSearch] = useState('')
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { setLoading(true); api.tours(search).then(setTours).catch(() => setTours([])).finally(() => setLoading(false)) }
  useEffect(load, [])
  return <main className="page"><section className="page-intro"><p className="eyebrow">DALAT GO JOURNAL</p><h1>Tìm hành trình<br /><em>của riêng bạn</em></h1><p>Chọn một lịch trình để bắt đầu câu chuyện Đà Lạt của bạn.</p></section><div className="search-bar"><Search size={19} /><input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} placeholder="Tìm theo tên tour, địa điểm..." /><button className="button button-primary" onClick={load}>Tìm tour</button></div><div className="tour-grid tour-grid-wide">{loading ? <div className="empty-card">Đang tải hành trình...</div> : tours.length ? tours.map(tour => <TourCard key={tour.id} tour={tour} />) : <div className="empty-card">Không tìm thấy tour phù hợp.</div>}</div></main>
}

function TourCard({ tour }: { tour: Tour }) {
  return <article className="tour-card"><div className="tour-image"><span className="tour-type">{tour.tour_type}</span><div className="image-placeholder">{tourImage(tour.code) ? <img src={tourImage(tour.code)} alt={tour.name} loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} /> : tour.name.slice(0, 1)}</div></div><div className="tour-card-body"><div className="tour-meta"><span><CalendarDays size={14} /> {Math.round(tour.duration_minutes / 60)} giờ</span><span><Star size={14} fill="currentColor" /> 4.9</span></div><h3>{tour.name}</h3><p>{tour.description || 'Một hành trình được thiết kế để bạn tận hưởng trọn vẹn vẻ đẹp Đà Lạt.'}</p><div className="card-footer"><strong>{tour.base_price.toLocaleString('vi-VN')} <small>đ / người</small></strong><Link to={`/tours/${tour.id}`} className="round-arrow"><ArrowRight size={17} /></Link></div></div></article>
}
