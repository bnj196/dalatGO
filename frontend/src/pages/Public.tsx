import { useEffect, useState, useMemo } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Search,
  Star,
  Users,
  Sparkles,
  SlidersHorizontal,
  Compass,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { api, Tour, Review } from '../lib/api'
import { WeatherWidget } from '../components/WeatherWidget'
import { AIAssistantModal } from '../components/AIAssistantModal'

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

export const DEFAULT_TOURS: Tour[] = [
  {
    id: '746b83a2-7235-4fc5-9cc3-f424b6dd9935',
    code: 'DL-01',
    name: 'Săn mây Cầu Đất & đồi chè xanh',
    tour_type: 'NATURE',
    description: 'Bình minh trên đồi chè, biển mây bồng bềnh và một buổi sáng thật chậm giữa cao nguyên ngàn thông.',
    duration_minutes: 480,
    base_price: 690000,
    status: 'PUBLISHED',
  },
  {
    id: '0d47fa94-41b6-482d-8b07-ffcaf014ee1f',
    code: 'DL-02',
    name: 'Ba thác hoang sơ Đà Lạt',
    tour_type: 'ADVENTURE',
    description: 'Khám phá Datanla, Prenn và Pongour trong hành trình thiên nhiên giàu cảm xúc.',
    duration_minutes: 600,
    base_price: 890000,
    status: 'PUBLISHED',
  },
  {
    id: '9133b807-88e5-44ae-a633-bb6146eb44f7',
    code: 'DL-03',
    name: 'Đà Lạt bình yên: cà phê & hoàng hôn',
    tour_type: 'CHILL',
    description: 'Một ngày thảnh thơi qua những quán cà phê view thung lũng, ga cổ và đồi hoàng hôn lãng mạn.',
    duration_minutes: 420,
    base_price: 590000,
    status: 'PUBLISHED',
  },
  {
    id: '7a679c3c-673c-4a72-8e90-a8c975060edd',
    code: 'DL-05',
    name: 'Cắm trại bên hồ Tuyền Lâm',
    tour_type: 'CAMPING',
    description: 'Rời xa phố thị, dựng lều bên hồ thông reo, nướng BBQ ngắm bầu trời sao cao nguyên kỳ diệu.',
    duration_minutes: 1440,
    base_price: 1290000,
    status: 'PUBLISHED',
  },
  {
    id: 'e2d72d8b-2eca-4c5b-87af-1dcb23bdc28d',
    code: 'DL-07',
    name: 'Trekking Langbiang đón bình minh',
    tour_type: 'TREKKING',
    description: 'Chinh phục đỉnh núi huyền thoại cùng hướng dẫn viên địa phương, phóng tầm mắt bao trọn thung lũng.',
    duration_minutes: 540,
    base_price: 990000,
    status: 'PUBLISHED',
  },
  {
    id: '094acb25-48cf-4a06-8be2-11e1184b247e',
    code: 'DL-09',
    name: 'Nghỉ dưỡng villa giữa rừng thông',
    tour_type: 'RESORT',
    description: 'Hai ngày một đêm nghỉ dưỡng tại villa biệt lập, thưởng thức ẩm thực cao nguyên chuẩn vị.',
    duration_minutes: 2880,
    base_price: 2490000,
    status: 'PUBLISHED',
  },
]

export function tourImage(code: string): string | undefined {
  return TOUR_IMAGES[code]
}

export function HomePage() {
  const [showAI, setShowAI] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    void api.getReviews('').then(setReviews)
  }, [])

  return (
    <main className="content-ecommerce">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow light">ĐI ĐỂ NHỚ · SỐNG ĐỂ KỂ</p>
          <h1>
            Chạm vào vẻ đẹp<br />
            <em>rất riêng</em> của Đà Lạt.
          </h1>
          <p className="hero-text">
            Những hành trình tuyển chọn để bạn sống chậm lại, hít thở sương sớm và lưu giữ từng khoảnh khắc bình yên nhất.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/tours" className="button button-light">
              Khám phá hành trình <ArrowRight size={17} />
            </Link>
            <button
              className="button button-ghost ai-trigger-btn"
              onClick={() => setShowAI(true)}
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              <Sparkles size={16} color="#fcd34d" /> Trợ lý AI Lập lịch
            </button>
            <Link to="/lookup" className="text-link" style={{ color: '#fff', marginLeft: '6px' }}>
              Tra cứu vé E-Ticket →
            </Link>
          </div>
        </div>

        {/* Ambient Floating Badge */}
        <div className="hero-badge hero-badge-ambient" aria-hidden="true">
          <Star size={16} fill="currentColor" />
          <span>
            Được yêu thích bởi<br />
            <b>hàng nghìn du khách</b>
          </span>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="feature-strip">
        <div>
          <CheckCircle2 size={24} />
          <span>
            <b>Tour chọn lọc</b>
            <small>Trải nghiệm chân thực &amp; an tâm</small>
          </span>
        </div>
        <div>
          <Users size={24} />
          <span>
            <b>Nhóm nhỏ ấm áp</b>
            <small>Riêng tư, linh hoạt và thong thả</small>
          </span>
        </div>
        <div>
          <CalendarDays size={24} />
          <span>
            <b>Lịch trình linh hoạt</b>
            <small>Dễ dàng đặt chỗ và đổi ngày</small>
          </span>
        </div>
      </section>

      {/* Weather & Cloud Hunting Widget Strip */}
      <section className="section" style={{ paddingBottom: '20px' }}>
        <WeatherWidget />
      </section>

      {/* Featured Tours Grid */}
      <FeaturedTours />

      {/* Verified Reviews Section */}
      <section className="section reviews-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CHIA SẺ TỪ DU KHÁCH</p>
            <h2>Cảm xúc sau những chuyến đi</h2>
          </div>
          <span className="location">
            <Star size={16} fill="#f59e0b" color="#f59e0b" /> Đánh giá trung bình <b>4.9 / 5.0</b> (250+ lượt)
          </span>
        </div>

        <div className="reviews-grid">
          {reviews.slice(0, 3).map(rev => (
            <div key={rev.id} className="review-card">
              <div className="review-header">
                <div>
                  <strong>{rev.user_name}</strong>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < Math.floor(rev.rating) ? '#f59e0b' : 'none'}
                        color="#f59e0b"
                      />
                    ))}
                    <small>{rev.date}</small>
                  </div>
                </div>
                {rev.verified && (
                  <span className="verified-badge">
                    <ShieldCheck size={13} /> Đã trải nghiệm
                  </span>
                )}
              </div>
              <p className="review-comment">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant Modal */}
      {showAI && <AIAssistantModal onClose={() => setShowAI(false)} />}
    </main>
  )
}

function FeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([])

  useEffect(() => {
    api
      .tours()
      .then(res => {
        if (res && res.length > 0) setTours(res)
        else setTours(DEFAULT_TOURS)
      })
      .catch(() => setTours(DEFAULT_TOURS))
  }, [])

  return (
    <section className="section tour-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">GỢI Ý CHO BẠN</p>
          <h2>Những hành trình đang được yêu thích</h2>
        </div>
        <Link to="/tours" className="text-link">
          Xem tất cả <ArrowRight size={16} />
        </Link>
      </div>

      <div className="tour-grid">
        {tours.slice(0, 3).map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  )
}

export function ToursPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const [priceRange, setPriceRange] = useState('ALL')
  const [sortBy, setSortBy] = useState('POPULAR')
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [showAI, setShowAI] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .tours(search)
      .then(res => {
        if (res && res.length > 0) {
          setTours(res)
        } else {
          setTours(DEFAULT_TOURS)
        }
      })
      .catch(() => setTours(DEFAULT_TOURS))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  // Filter and sort computation
  const filteredTours = useMemo(() => {
    let result = [...tours]

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        t => t.name.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      )
    }

    // Category filter
    if (category !== 'ALL') {
      result = result.filter(t => t.tour_type === category)
    }

    // Price range filter
    if (priceRange === 'UNDER_700') {
      result = result.filter(t => t.base_price <= 700000)
    } else if (priceRange === '700_1500') {
      result = result.filter(t => t.base_price > 700000 && t.base_price <= 1500000)
    } else if (priceRange === 'OVER_1500') {
      result = result.filter(t => t.base_price > 1500000)
    }

    // Sorting
    if (sortBy === 'PRICE_ASC') {
      result.sort((a, b) => a.base_price - b.base_price)
    } else if (sortBy === 'PRICE_DESC') {
      result.sort((a, b) => b.base_price - a.base_price)
    } else if (sortBy === 'DURATION') {
      result.sort((a, b) => a.duration_minutes - b.duration_minutes)
    }

    return result
  }, [tours, search, category, priceRange, sortBy])

  return (
    <main className="page content-ecommerce">
      <section className="page-intro">
        <p className="eyebrow">DALAT GO JOURNAL</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1>
              Tìm hành trình<br />
              <em>của riêng bạn</em>
            </h1>
            <p>Chọn một lịch trình để bắt đầu câu chuyện Đà Lạt đầy cảm xúc của bạn.</p>
          </div>
          <button className="button button-ghost" onClick={() => setShowAI(true)}>
            <Sparkles size={16} color="var(--teal)" /> Trợ lý AI Gợi ý tour
          </button>
        </div>
      </section>

      {/* Search Input Bar */}
      <div className="search-bar">
        <Search size={19} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên tour, điểm đến (Cầu Đất, Langbiang, Tuyền Lâm)..."
          aria-label="Tìm kiếm hành trình"
        />
        <button className="button button-primary" onClick={load}>
          Tìm tour
        </button>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="filter-toolbar-card">
        {/* Category Chips */}
        <div className="category-chips">
          {[
            { id: 'ALL', label: 'Tất cả tour' },
            { id: 'NATURE', label: 'Săn mây & Đồi chè' },
            { id: 'ADVENTURE', label: 'Khám phá thác nước' },
            { id: 'CHILL', label: 'Cà phê & Hoàng hôn' },
            { id: 'CAMPING', label: 'Cắm trại ven hồ' },
            { id: 'TREKKING', label: 'Trekking đỉnh núi' },
            { id: 'RESORT', label: 'Nghỉ dưỡng Villa' },
          ].map(c => (
            <button
              key={c.id}
              className={`filter-chip ${category === c.id ? 'active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="filter-dropdowns-row">
          <div className="filter-select-group">
            <SlidersHorizontal size={14} />
            <span>Mức giá:</span>
            <select value={priceRange} onChange={e => setPriceRange(e.target.value)}>
              <option value="ALL">Tất cả mức giá</option>
              <option value="UNDER_700">Dưới 700.000 đ</option>
              <option value="700_1500">700.000 đ - 1.500.000 đ</option>
              <option value="OVER_1500">Trên 1.500.000 đ</option>
            </select>
          </div>

          <div className="filter-select-group">
            <span>Sắp xếp:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="POPULAR">Phổ biến nhất</option>
              <option value="PRICE_ASC">Giá tăng dần</option>
              <option value="PRICE_DESC">Giá giảm dần</option>
              <option value="DURATION">Thời lượng ngắn nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      <div className="tour-grid tour-grid-wide">
        {loading ? (
          <div className="empty-card">Đang tải danh sách hành trình...</div>
        ) : filteredTours.length ? (
          filteredTours.map(tour => <TourCard key={tour.id} tour={tour} />)
        ) : (
          <div className="empty-card">
            Không tìm thấy tour nào phù hợp với bộ lọc hiện tại. Hãy thử chọn mức giá hoặc danh mục khác!
          </div>
        )}
      </div>

      {/* AI Assistant Modal */}
      {showAI && <AIAssistantModal onClose={() => setShowAI(false)} />}
    </main>
  )
}

export function TourCard({ tour }: { tour: Tour }) {
  const imgSrc = tourImage(tour.code)

  return (
    <article className="tour-card">
      <div className="tour-image">
        <span className="tour-type">{tour.tour_type}</span>
        <div className="image-placeholder">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={tour.name}
              loading="lazy"
              onError={e => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            tour.name.slice(0, 1)
          )}
        </div>
      </div>
      <div className="tour-card-body">
        <div className="tour-meta">
          <span>
            <CalendarDays size={14} /> {Math.round(tour.duration_minutes / 60)} giờ
          </span>
          <span>
            <Star size={14} fill="currentColor" /> 4.9
          </span>
        </div>
        <h3>{tour.name}</h3>
        <p>{tour.description || 'Một hành trình được thiết kế để bạn tận hưởng trọn vẹn vẻ đẹp Đà Lạt.'}</p>
        <div className="card-footer">
          <strong>
            {tour.base_price.toLocaleString('vi-VN')} <small>đ / người</small>
          </strong>
          <Link
            to={`/tours/${tour.id}`}
            className="round-arrow"
            aria-label={`Xem chi tiết ${tour.name}`}
          >
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  )
}
