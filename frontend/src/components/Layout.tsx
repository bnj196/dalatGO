import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Compass, LayoutDashboard, LogIn, LogOut, MapPin, ShieldCheck } from 'lucide-react'

export function Header() {
  const navigate = useNavigate()
  const token = localStorage.getItem('dalatgo_token')
  const isAdmin = localStorage.getItem('dalatgo_role') === 'ADMIN'
  const logout = () => {
    localStorage.removeItem('dalatgo_token')
    localStorage.removeItem('dalatgo_role')
    navigate('/login')
  }
  return <header className="topbar">
    <Link to="/" className="brand"><span className="brand-mark"><Compass size={22} /></span><span>DALAT <b>Go</b></span></Link>
    <nav className="nav-links">
      <NavLink to="/tours">Khám phá tour</NavLink>
      {isAdmin && <NavLink to="/admin"><LayoutDashboard size={16} /> Quản trị</NavLink>}
    </nav>
    <div className="header-actions">
      <span className="location"><MapPin size={15} /> Đà Lạt, Lâm Đồng</span>
      {token ? <button className="icon-button" onClick={logout} title="Đăng xuất"><LogOut size={18} /></button> : <Link className="login-link" to="/login"><LogIn size={16} /> Đăng nhập</Link>}
    </div>
  </header>
}

export function AdminSidebar() {
  return <aside className="admin-sidebar">
    <Link to="/admin" className="brand sidebar-brand"><span className="brand-mark"><ShieldCheck size={21} /></span><span>DALAT <b>Go</b></span></Link>
    <p className="eyebrow">WORKSPACE</p>
    <NavLink end to="/admin"><LayoutDashboard size={18} /> Tổng quan</NavLink>
    <NavLink to="/admin/users"><span className="nav-dot" /> Người dùng</NavLink>
    <NavLink to="/admin/tours"><Compass size={18} /> Tour & lịch</NavLink>
    <NavLink to="/admin/bookings"><span className="nav-dot" /> Booking</NavLink>
    <NavLink to="/admin/audit"><span className="nav-dot" /> Nhật ký hệ thống</NavLink>
    <div className="sidebar-bottom"><span>Administrator</span><button onClick={() => { localStorage.clear(); location.href = '/login' }}><LogOut size={17} /></button></div>
  </aside>
}
