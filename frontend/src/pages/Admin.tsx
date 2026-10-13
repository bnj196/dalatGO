import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Activity, CalendarDays, ChevronRight, Compass, RefreshCw, ShieldCheck, Users, WalletCards } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminSidebar } from '../components/Layout'
import { api, Booking, Departure, Tour, User } from '../lib/api'

type Stats = { users: number; tours: number; departures: number; bookings: number; pending_bookings: number }

function AdminShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return <div className="admin-layout"><AdminSidebar /><main className="admin-main"><div className="admin-header"><div><p className="eyebrow">DALAT GO / ADMIN</p><h1>{title}</h1><p className="muted">{subtitle}</p></div><div className="admin-date"><CalendarDays size={16} /> Hôm nay, 14 tháng 6, 2025</div></div>{children}</main></div>
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>(); const [error, setError] = useState('')
  const load = () => api.adminDashboard().then(setStats).catch(err => setError(err.message))
  useEffect(() => { void load() }, [])
  const cards: Array<[string, number, LucideIcon, string]> = [['Người dùng', stats?.users || 0, Users, 'Tổng tài khoản'], ['Tour đang quản lý', stats?.tours || 0, Compass, 'Danh mục hệ thống'], ['Lịch khởi hành', stats?.departures || 0, CalendarDays, 'Tất cả lịch'], ['Booking', stats?.bookings || 0, WalletCards, `${stats?.pending_bookings || 0} chờ thanh toán`]]
  return <AdminShell title="Tổng quan" subtitle="Theo dõi toàn bộ hoạt động của DALAT Go."><div className="stat-grid">{cards.map(([label, value, Icon, note]) => <div className="stat-card" key={label}><div className="stat-icon"><Icon size={19} /></div><p>{label}</p><strong>{value}</strong><small>{note}</small></div>)}</div>{error ? <div className="form-error">{error}. Hãy đăng nhập bằng tài khoản quản trị.</div> : <div className="admin-grid"><section className="panel"><div className="panel-heading"><div><p className="eyebrow">QUICK ACTIONS</p><h2>Thao tác nhanh</h2></div><Activity size={20} /></div><div className="quick-grid"><Link to="/admin/tours"><Compass /><span><b>Quản lý tour</b><small>Tạo tour và lịch mới</small></span><ChevronRight /></Link><Link to="/admin/users"><Users /><span><b>Người dùng</b><small>Phân quyền tài khoản</small></span><ChevronRight /></Link><Link to="/admin/bookings"><WalletCards /><span><b>Booking</b><small>Xem và xử lý đặt tour</small></span><ChevronRight /></Link><Link to="/admin/audit"><ShieldCheck /><span><b>Nhật ký</b><small>Kiểm tra hoạt động hệ thống</small></span><ChevronRight /></Link></div></section><section className="panel insight-panel"><p className="eyebrow">GỢI Ý VẬN HÀNH</p><h2>Giữ mọi hành trình liền mạch.</h2><p>Kiểm tra các booking đang chờ thanh toán trước khi chốt danh sách đoàn.</p><Link to="/admin/bookings" className="text-link">Xem booking cần xử lý <ChevronRight size={16} /></Link></section></div>}</AdminShell>
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => { void api.adminUsers().then(setUsers) }, [])
  return <AdminShell title="Người dùng" subtitle="Quản lý tài khoản và vai trò trong hệ thống."><div className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">ACCESS CONTROL</p><h2>Danh sách người dùng</h2></div><button className="button button-primary">+ Tạo người dùng</button></div><table><thead><tr><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th></tr></thead><tbody>{users.map(user => <tr key={user.id}><td><b>{user.full_name}</b><small>{user.id.slice(0, 8)}</small></td><td>{user.email}</td><td><span className="role-badge">{user.role}</span></td><td><span className={user.is_active ? 'status active' : 'status inactive'}>{user.is_active ? 'Đang hoạt động' : 'Đã khóa'}</span></td></tr>)}</tbody></table></div></AdminShell>
}

export function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]); const [departures, setDepartures] = useState<Departure[]>([])
  useEffect(() => { void api.adminTours().then(setTours); void api.adminDepartures().then(setDepartures) }, [])
  return <AdminShell title="Tour & lịch khởi hành" subtitle="Kiểm soát danh mục trải nghiệm và số chỗ."><div className="admin-toolbar"><div className="tabs"><button className="tab active">Danh mục tour</button><button className="tab">Lịch khởi hành</button></div><button className="button button-primary">+ Tạo tour</button></div><div className="panel table-panel"><table><thead><tr><th>Mã tour</th><th>Tên hành trình</th><th>Loại</th><th>Giá</th><th>Trạng thái</th></tr></thead><tbody>{tours.map(tour => <tr key={tour.id}><td><b>{tour.code}</b></td><td>{tour.name}</td><td>{tour.tour_type}</td><td>{tour.base_price.toLocaleString('vi-VN')} đ</td><td><span className="status active">{tour.status}</span></td></tr>)}</tbody></table>{!tours.length && <div className="empty-table">Chưa có tour. Tạo tour đầu tiên để bắt đầu.</div>}</div><div className="panel table-panel"><div className="panel-heading"><h2>Lịch khởi hành</h2><span className="muted">{departures.length} lịch</span></div><table><thead><tr><th>Ngày đi</th><th>Tour</th><th>Sức chứa</th><th>Đã đặt</th><th>Trạng thái</th></tr></thead><tbody>{departures.map(d => <tr key={d.id}><td>{d.departure_date}</td><td>{tours.find(t => t.id === d.tour_id)?.name || d.tour_id.slice(0, 8)}</td><td>{d.max_capacity}</td><td>{d.booked_capacity}</td><td><span className="status active">{d.status}</span></td></tr>)}</tbody></table></div></AdminShell>
}

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  useEffect(() => { void api.adminBookings().then(setBookings) }, [])
  return <AdminShell title="Booking" subtitle="Theo dõi các yêu cầu đặt tour và trạng thái thanh toán."><div className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">BOOKING MANAGEMENT</p><h2>Tất cả booking</h2></div><button className="button button-ghost"><RefreshCw size={15} /> Làm mới</button></div><table><thead><tr><th>Mã booking</th><th>Số khách</th><th>Điểm đón</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead><tbody>{bookings.map(booking => <tr key={booking.id}><td><b>{booking.code}</b><small>{booking.id.slice(0, 8)}</small></td><td>{booking.guest_count}</td><td>{booking.pickup_location}</td><td>{booking.total_amount.toLocaleString('vi-VN')} đ</td><td><span className={booking.status === 'PENDING_PAYMENT' ? 'status warning' : 'status active'}>{booking.status}</span></td></tr>)}</tbody></table>{!bookings.length && <div className="empty-table">Chưa có booking.</div>}</div></AdminShell>
}

export function AdminAuditPage() {
  const [logs, setLogs] = useState<Array<Record<string, unknown>>>([])
  useEffect(() => { void api.auditLogs().then(setLogs) }, [])
  return <AdminShell title="Nhật ký hệ thống" subtitle="Theo dõi các thao tác quan trọng và trách nhiệm người dùng."><div className="panel table-panel"><table><thead><tr><th>Thời gian</th><th>Hành động</th><th>Đối tượng</th><th>Chi tiết</th></tr></thead><tbody>{logs.map((log, index) => <tr key={index}><td>{String(log.created_at || '-')}</td><td><span className="role-badge">{String(log.action)}</span></td><td>{String(log.entity_type)} / {String(log.entity_id).slice(0, 8)}</td><td>{String(log.detail || '-')}</td></tr>)}</tbody></table>{!logs.length && <div className="empty-table">Chưa có nhật ký.</div>}</div></AdminShell>
}
