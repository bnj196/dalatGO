import { useState } from 'react'
import {
  Sun,
  Moon,
  Zap,
  Sliders,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  Tv,
  Watch,
  CheckCircle,
  X,
  Gauge,
  Sparkles,
} from 'lucide-react'
import { useMotion, PlatformType } from './MotionContext'

const PLATFORM_ICONS: Record<PlatformType, typeof Monitor> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
  watch: Watch,
  tv: Tv,
}

export function AdaptationPill() {
  const {
    theme,
    toggleTheme,
    reducedMotion,
    toggleReducedMotion,
    platform,
    durationModifier,
    motionIntensity,
    viewportWidth,
  } = useMotion()

  const [isOpen, setIsOpen] = useState(false)
  const Icon = PLATFORM_ICONS[platform]

  return (
    <>
      <div className="adaptation-pill-wrapper">
        <button
          className="adaptation-pill-btn"
          onClick={() => setIsOpen(prev => !prev)}
          title="Bảng điều khiển Thích ứng Bối cảnh (Context Adaptation)"
          aria-expanded={isOpen}
        >
          <span className="pill-dot" />
          <Icon size={14} />
          <span className="pill-text">
            {platform.toUpperCase()} · {durationModifier}x
          </span>
          {reducedMotion && <span className="pill-badge">A11y</span>}
          {theme === 'dark' && <span className="pill-badge dark-badge">-18% mtn</span>}
        </button>

        <button
          className="theme-toggle-quick"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối (giảm 18% cường độ chuyển động)'}
          aria-label="Đổi giao diện Sáng / Tối"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {isOpen && (
        <div className="adaptation-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="adaptation-modal"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label="Context Adaptation Settings"
          >
            <div className="adaptation-header">
              <div className="header-title">
                <Sliders size={18} />
                <h3>Context Adaptation System</h3>
              </div>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng bảng điều khiển"
              >
                <X size={18} />
              </button>
            </div>

            <div className="adaptation-body">
              {/* Platform Scaling Section */}
              <div className="spec-card">
                <div className="spec-card-head">
                  <div className="spec-icon">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4>Platform Scaling</h4>
                    <p className="spec-sub">
                      Khung nhìn hiện tại: <strong>{viewportWidth}px</strong> ({platform})
                    </p>
                  </div>
                </div>

                <div className="spec-metrics-grid">
                  <div className="metric-box">
                    <span>Duration Modifier</span>
                    <strong>{durationModifier}x</strong>
                  </div>
                  <div className="metric-box">
                    <span>Complexity</span>
                    <strong>{platform === 'mobile' ? 'Reduced (1-2 props)' : platform === 'watch' ? 'Minimal' : 'Full'}</strong>
                  </div>
                  <div className="metric-box">
                    <span>Physics Engine</span>
                    <strong>{platform === 'mobile' ? 'Snappy only' : platform === 'watch' ? 'None' : 'All types'}</strong>
                  </div>
                  <div className="metric-box">
                    <span>Touch Feedback</span>
                    <strong>&lt; 100ms ({platform === 'mobile' ? '70ms' : '80ms'})</strong>
                  </div>
                </div>

                {platform === 'mobile' && (
                  <div className="rule-alert">
                    <Zap size={14} />
                    <span>Mobile Rules: Ưu tiên opacity + transform, giảm 30% stagger budget, tắt parallax</span>
                  </div>
                )}
                {platform === 'desktop' && (
                  <div className="rule-alert">
                    <Sparkles size={14} />
                    <span>Desktop Opportunities: Hover states, cursor tracking, multi-column stagger, spatial choreography</span>
                  </div>
                )}
              </div>

              {/* Accessibility (prefers-reduced-motion) */}
              <div className="spec-card">
                <div className="spec-card-head">
                  <div className="spec-icon">
                    {reducedMotion ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                  <div>
                    <h4>Accessibility (prefers-reduced-motion)</h4>
                    <p className="spec-sub">Bảo vệ tiền đình &amp; hỗ trợ nhận thức</p>
                  </div>
                </div>

                <div className="toggle-row">
                  <div>
                    <strong>Chế độ giảm chuyển động (Reduced Motion)</strong>
                    <p>Bỏ dịch chuyển không gian (spatial movement), chỉ giữ opacity fade, giảm thời lượng &gt;50%</p>
                  </div>
                  <button
                    className={`toggle-switch ${reducedMotion ? 'active' : ''}`}
                    onClick={toggleReducedMotion}
                    aria-checked={reducedMotion}
                    role="switch"
                  >
                    <span className="switch-thumb" />
                  </button>
                </div>

                <div className="a11y-check-list">
                  <div className="a11y-item">
                    <CheckCircle size={13} /> Slide entrance → Opacity fade only
                  </div>
                  <div className="a11y-item">
                    <CheckCircle size={13} /> Bounce/spring → Instant / Simple ease-out
                  </div>
                  <div className="a11y-item">
                    <CheckCircle size={13} /> Parallax → Static positioning
                  </div>
                  <div className="a11y-item">
                    <CheckCircle size={13} /> Không truyền tải thông tin chỉ qua chuyển động
                  </div>
                </div>
              </div>

              {/* Dark Mode Motion Adaptation */}
              <div className="spec-card">
                <div className="spec-card-head">
                  <div className="spec-icon">
                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                  </div>
                  <div>
                    <h4>Dark Mode Motion Adaptation</h4>
                    <p className="spec-sub">Màu sáng trên nền tối có tác động thị giác mạnh hơn</p>
                  </div>
                </div>

                <div className="toggle-row">
                  <div>
                    <strong>Giao diện: {theme === 'dark' ? 'Chế độ Tối (Dark)' : 'Chế độ Sáng (Light)'}</strong>
                    <p>
                      {theme === 'dark'
                        ? 'Đang áp dụng: Giảm 18% cường độ chuyển động (10-20% theo chuẩn), làm dịu ánh sáng'
                        : 'Cường độ chuẩn 1.0x baseline'}
                    </p>
                  </div>
                  <button
                    className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                    onClick={toggleTheme}
                    aria-checked={theme === 'dark'}
                    role="switch"
                  >
                    <span className="switch-thumb" />
                  </button>
                </div>

                <div className="metric-box full-width">
                  <span>Current Motion Intensity Scale</span>
                  <strong>{motionIntensity}x {theme === 'dark' ? '(Giảm 18% displacement)' : '(100% baseline)'}</strong>
                </div>
              </div>

              {/* Performance Budgets */}
              <div className="spec-card">
                <div className="spec-card-head">
                  <div className="spec-icon">
                    <Gauge size={16} />
                  </div>
                  <div>
                    <h4>Performance Budgets (Target 60 FPS)</h4>
                    <p className="spec-sub">Tối ưu GPU, hạn chế layout reflow và repaint</p>
                  </div>
                </div>

                <div className="perf-tiers">
                  <div className="tier tier-optimal">
                    <span className="tier-tag">Optimal (GPU)</span>
                    <code>transform, opacity</code>
                    <small>Unlimited elements (hardware accelerated)</small>
                  </div>
                  <div className="tier tier-avoid">
                    <span className="tier-tag">Avoid</span>
                    <code>box-shadow, border-radius, filter</code>
                    <small>Đã thay thế bằng pseudo-element opacity shadow</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="adaptation-footer">
              <span>Đà Lạt Go · Hệ thống chuyển động thích ứng bối cảnh</span>
              <button className="button button-primary" onClick={() => setIsOpen(false)}>
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
