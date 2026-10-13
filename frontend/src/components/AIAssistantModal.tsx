import { useState } from 'react'
import {
  Sparkles,
  X,
  Compass,
  ArrowRight,
  Clock,
  Users,
  Heart,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface AIAssistantModalProps {
  onClose: () => void
}

type Recommendation = {
  title: string
  highlight: string
  schedule: Array<{ period: string; activity: string }>
  recommendedTourId: string
  tourName: string
  price: string
}

export function AIAssistantModal({ onClose }: AIAssistantModalProps) {
  const [duration, setDuration] = useState('1_DAY')
  const [companion, setCompanion] = useState('COUPLE')
  const [vibe, setVibe] = useState('CLOUD_CHILL')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<Recommendation | null>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      // Deterministic intelligent recommendation
      if (vibe === 'TREK') {
        setResult({
          title: 'Hành trình Chinh phục & Thử thách Giới hạn',
          highlight: 'Cung trekking Langbiang kết hợp ngắm bình minh và khám phá rừng nguyên sinh.',
          schedule: [
            { period: '05:00 - 08:30', activity: 'Đón tại điểm hẹn, khởi động và trekking chinh phục đỉnh Radar Langbiang' },
            { period: '08:30 - 11:30', activity: 'Ngắm toàn cảnh Suối Vàng - Suối Bạc, thưởng thức trà atiso nóng' },
            { period: '12:00 - 14:00', activity: 'Ăn trưa cơm lam gà nướng đặc sản tại buôn Lát' },
          ],
          recommendedTourId: 'e2d72d8b-2eca-4c5b-87af-1dcb23bdc28d',
          tourName: 'Trekking Langbiang đón bình minh',
          price: '990.000 đ',
        })
      } else if (vibe === 'CAMPING') {
        setResult({
          title: 'Đêm Thơ Mộng Bên Bờ Hồ Tuyền Lâm',
          highlight: 'Cắm trại glamping bên hồ, tiệc BBQ bên lửa trại và thức dậy giữa rừng thông reo.',
          schedule: [
            { period: '15:00 - 17:30', activity: 'Nhận lều glamping cao cấp, chèo thuyền SUP hoàng hôn trên mặt hồ' },
            { period: '18:30 - 21:30', activity: 'Tiệc nướng BBQ thịt nướng cao nguyên, giao lưu lửa trại và ngắm sao' },
            { period: '06:00 - 08:00', activity: 'Đón sương sớm mặt hồ, thưởng thức cà phê phin nóng và điểm tâm' },
          ],
          recommendedTourId: '7a679c3c-673c-4a72-8e90-a8c975060edd',
          tourName: 'Cắm trại bên hồ Tuyền Lâm',
          price: '1.290.000 đ',
        })
      } else {
        setResult({
          title: 'Combo Chữa Lành: Săn Mây Sớm & Chiều Hoàng Hôn',
          highlight: 'Đón trọn vẹn vẻ đẹp thơ mộng nhất của Đà Lạt từ bình minh đồi chè đến hoàng hôn thung lũng.',
          schedule: [
            { period: '05:00 - 08:30', activity: 'Săn biển mây Cầu Đất, đón bình minh đồi chè cổ thụ xanh ngát' },
            { period: '09:00 - 11:30', activity: 'Thưởng thức cà phê đặc sản, check-in tua bin gió khổng lồ' },
            { period: '15:30 - 18:00', activity: 'Ngắm hoàng hôn tím buông xuống thung lũng thông reo' },
          ],
          recommendedTourId: '746b83a2-7235-4fc5-9cc3-f424b6dd9935',
          tourName: 'Săn mây Cầu Đất & đồi chè xanh',
          price: '690.000 đ',
        })
      }
      setIsGenerating(false)
    }, 600)
  }

  return (
    <div className="adaptation-modal-backdrop" onClick={onClose}>
      <div
        className="adaptation-modal ai-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Trợ lý AI Lập lịch trình"
      >
        <div className="adaptation-header">
          <div className="header-title">
            <Sparkles size={20} color="var(--teal)" />
            <h3>Trợ lý Lập lịch trình AI · DALAT Go</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="ai-modal-body">
          <p className="ai-intro-text">
            Cho AI biết mong muốn của bạn, hệ thống sẽ phối hợp lịch trình và đề xuất tour tối ưu nhất cho kỳ nghỉ của bạn.
          </p>

          <div className="ai-option-group">
            <label className="ai-group-label">
              <Clock size={15} /> 1. Bạn dự định dành bao nhiêu thời gian?
            </label>
            <div className="chip-group">
              {[
                { id: 'HALF_DAY', label: 'Nửa ngày (4-5h)' },
                { id: '1_DAY', label: 'Trọn 1 ngày' },
                { id: '2D1N', label: '2 Ngày 1 Đêm' },
                { id: '3D2N', label: '3 Ngày 2 Đêm' },
              ].map(item => (
                <button
                  key={item.id}
                  className={`chip-btn ${duration === item.id ? 'active' : ''}`}
                  onClick={() => setDuration(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-option-group">
            <label className="ai-group-label">
              <Users size={15} /> 2. Chuyến đi này bạn đi cùng ai?
            </label>
            <div className="chip-group">
              {[
                { id: 'COUPLE', label: 'Cặp đôi / Người yêu' },
                { id: 'FRIENDS', label: 'Nhóm bạn thân' },
                { id: 'FAMILY', label: 'Gia đình (Trẻ nhỏ/Người lớn tuổi)' },
                { id: 'SOLO', label: 'Đi một mình (Solo chill)' },
              ].map(item => (
                <button
                  key={item.id}
                  className={`chip-btn ${companion === item.id ? 'active' : ''}`}
                  onClick={() => setCompanion(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-option-group">
            <label className="ai-group-label">
              <Heart size={15} /> 3. Phong cách trải nghiệm bạn thích nhất?
            </label>
            <div className="chip-group">
              {[
                { id: 'CLOUD_CHILL', label: 'Săn mây & Chill cà phê' },
                { id: 'TREK', label: 'Trekking & Khám phá thác' },
                { id: 'CAMPING', label: 'Cắm trại ven hồ & Ngắm sao' },
                { id: 'RESORT', label: 'Nghỉ dưỡng & Ẩm thực ấm áp' },
              ].map(item => (
                <button
                  key={item.id}
                  className={`chip-btn ${vibe === item.id ? 'active' : ''}`}
                  onClick={() => setVibe(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="button button-primary full ai-generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Sparkles size={16} />
            {isGenerating ? 'AI đang phân tích và thiết kế lịch trình...' : 'Tạo lịch trình đề xuất'}
          </button>

          {/* AI Result Presentation */}
          {result && (
            <div className="ai-result-card">
              <div className="result-header">
                <span className="eyebrow">ĐỀ XUẤT PHÙ HỢP NHẤT</span>
                <h4>{result.title}</h4>
                <p className="result-highlight">{result.highlight}</p>
              </div>

              <div className="result-timeline">
                {result.schedule.map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <span className="time-badge">{item.period}</span>
                    <p className="activity-desc">{item.activity}</p>
                  </div>
                ))}
              </div>

              <div className="recommended-tour-box">
                <div>
                  <small>Tour khớp 98% với tiêu chí của bạn:</small>
                  <strong>{result.tourName}</strong>
                  <span className="price-tag">{result.price} / người</span>
                </div>
                <Link
                  to={`/tours/${result.recommendedTourId}`}
                  className="button button-primary"
                  onClick={onClose}
                >
                  Xem &amp; Đặt tour <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
