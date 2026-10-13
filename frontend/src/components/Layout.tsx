import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Compass,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  ShieldCheck,
  Sun,
  Moon,
  Ticket,
  ClipboardList,
} from 'lucide-react'
import { AdaptationPill } from './AdaptationControl'
import { useMotion } from './MotionContext'

export function Header() {
  const navigate = useNavigate()
  const token = localStorage.getItem('dalatgo_token')
  const isAdmin = localStorage.getItem('dalatgo_role') === 'ADMIN'
  const logout = () => {
    localStorage.removeItem('dalatgo_token')
    localStorage.removeItem('dalatgo_role')
    navigate('/login')
  }

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <Compass size={22} />
        </span>
        <span>
          DALAT <b>Go</b>
        </span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/tours">Khám phá tour</NavLink>
        <NavLink to="/lookup">
          <Ticket size={16} /> Tra cứu vé E-Ticket
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin">
            <LayoutDashboard size={16} /> Quản trị
          </NavLink>
        )}
      </nav>

      <div className="header-actions">
        <span className="location">
          <MapPin size={15} /> Đà Lạt, Lâm Đồng
        </span>
        <AdaptationPill />
        {token ? (
          <button className="icon-button" onClick={logout} title="Đăng xuất" aria-label="Đăng xuất">
            <LogOut size={18} />
          </button>
        ) : (
          <Link className="login-link" to="/login">
            <LogIn size={16} /> Đăng nhập
          </Link>
        )}
      </div>
    </header>
  )
}

export function AdminSidebar() {
  const { theme, toggleTheme } = useMotion()

  return (
    <aside className="admin-sidebar content-saas">
      <Link to="/admin" className="brand sidebar-brand">
        <span className="brand-mark">
          <ShieldCheck size={21} />
        </span>
        <span>
          DALAT <b>Go</b>
        </span>
      </Link>
      <p className="eyebrow">WORKSPACE</p>
      <NavLink end to="/admin">
        <LayoutDashboard size={18} /> <span>Tổng quan</span>
      </NavLink>
      <NavLink to="/admin/operations">
        <ClipboardList size={18} /> <span>Điều hành &amp; Điểm danh</span>
      </NavLink>
      <NavLink to="/admin/users">
        <span className="nav-dot" /> <span>Người dùng</span>
      </NavLink>
      <NavLink to="/admin/tours">
        <Compass size={18} /> <span>Tour &amp; lịch</span>
      </NavLink>
      <NavLink to="/admin/bookings">
        <span className="nav-dot" /> <span>Booking</span>
      </NavLink>
      <NavLink to="/admin/audit">
        <span className="nav-dot" /> <span>Nhật ký hệ thống</span>
      </NavLink>

      <div className="sidebar-bottom">
        <span>Administrator</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}
            aria-label="Đổi giao diện Sáng / Tối"
            style={{ cursor: 'pointer' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => {
              localStorage.clear()
              location.href = '/login'
            }}
            title="Đăng xuất"
            aria-label="Đăng xuất"
            style={{ cursor: 'pointer' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
