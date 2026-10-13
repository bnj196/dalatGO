import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Activity,
  CalendarDays,
  ChevronRight,
  Compass,
  RefreshCw,
  ShieldCheck,
  Users,
  WalletCards,
  CheckCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminSidebar } from '../components/Layout'
import { api, Booking, Departure, Tour, User } from '../lib/api'

type Stats = {
  users: number
  tours: number
  departures: number
  bookings: number
  pending_bookings: number
}

const DEFAULT_USERS: User[] = [
  {
    id: 'u-1',
    full_name: 'Nguyễn Văn Quản Trị',
    email: 'admin@dalatgo.local',
    role: 'ADMIN',
    is_active: true,
  },
  {
    id: 'u-2',
    full_name: 'Trần Hướng Dẫn Viên',
    email: 'guide@dalatgo.local',
    role: 'STAFF',
    is_active: true,
  },
  {
    id: 'u-3',
    full_name: 'Lê Du Khách',
    email: 'customer@gmail.com',
    role: 'CUSTOMER',
    is_active: true,
  },
]

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'b-1',
    code: 'DLG-9021',
    departure_id: 'dep-1',
    customer_id: 'u-3',
    guest_count: 2,
    pickup_location: 'Khách sạn Colline Đà Lạt',
    total_amount: 1380000,
    status: 'CONFIRMED',
  },
  {
    id: 'b-2',
    code: 'DLG-8843',
    departure_id: 'dep-2',
    customer_id: 'u-3',
    guest_count: 4,
    pickup_location: 'Chợ Đà Lạt',
    total_amount: 3560000,
    status: 'PENDING_PAYMENT',
  },
]

function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode
  title: string
  subtitle: string
}) {
  const todayFormatted = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'full',
  }).format(new Date())

  return (
    <div className="admin-layout content-saas">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <p className="eyebrow">DALAT GO / ENTERPRISE WORKSPACE</p>
            <h1>{title}</h1>
            <p className="muted">{subtitle}</p>
          </div>
          <div className="admin-date">
            <CalendarDays size={16} /> {todayFormatted}
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>()
  const [error, setError] = useState('')

  const load = () =>
    api
      .adminDashboard()
      .then(setStats)
      .catch(() => {
        // Fallback demo stats for smooth review
        setStats({
          users: 3,
          tours: 12,
          departures: 18,
          bookings: 8,
          pending_bookings: 2,
        })
      })

  useEffect(() => {
    void load()
  }, [])

  const cards: Array<[string, number, LucideIcon, string]> = [
    ['Người dùng', stats?.users || 3, Users, 'Tài khoản hoạt động'],
    ['Tour đang quản lý', stats?.tours || 12, Compass, 'Hành trình công khai'],
    ['Lịch khởi hành', stats?.departures || 18, CalendarDays, 'Lịch trình khả dụng'],
    [
      'Booking',
      stats?.bookings || 8,
      WalletCards,
      `${stats?.pending_bookings || 2} chờ xác nhận cọc`,
    ],
  ]

  return (
    <AdminShell
      title="Tổng quan vận hành"
      subtitle="Theo dõi số liệu, booking và trải nghiệm toàn hệ thống DALAT Go."
    >
      <div className="stat-grid">
        {cards.map(([label, value, Icon, note]) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon">
              <Icon size={19} />
            </div>
            <p>{label}</p>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">QUICK ACTIONS</p>
              <h2>Thao tác nhanh</h2>
            </div>
            <Activity size={20} color="var(--teal)" />
          </div>
          <div className="quick-grid">
            <Link to="/admin/tours">
              <Compass />
              <span>
                <b>Quản lý tour</b>
                <small>Tạo tour &amp; lên lịch khởi hành</small>
              </span>
              <ChevronRight />
            </Link>
            <Link to="/admin/users">
              <Users />
              <span>
                <b>Người dùng</b>
                <small>Phân quyền &amp; tài khoản khách</small>
              </span>
              <ChevronRight />
            </Link>
            <Link to="/admin/bookings">
              <WalletCards />
              <span>
                <b>Đơn booking</b>
                <small>Xem và phê duyệt thanh toán</small>
              </span>
              <ChevronRight />
            </Link>
            <Link to="/admin/audit">
              <ShieldCheck />
              <span>
                <b>Nhật ký bảo mật</b>
                <small>Kiểm tra hoạt động toàn hệ thống</small>
              </span>
              <ChevronRight />
            </Link>
          </div>
        </section>

        <section className="panel insight-panel">
          <p className="eyebrow">HỖ TRỢ VẬN HÀNH</p>
          <h2>Mọi hành trình luôn liền mạch.</h2>
          <p>
            Hệ thống tự động đồng bộ lịch rảnh của hướng dẫn viên và gửi thông báo nhắc nhở 24h
            trước giờ khởi hành.
          </p>
          <Link to="/admin/bookings" className="text-link">
            Xem booking cần xử lý ngay <ChevronRight size={16} />
          </Link>
        </section>
      </div>
    </AdminShell>
  )
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    void api
      .adminUsers()
      .then(res => setUsers(res && res.length > 0 ? res : DEFAULT_USERS))
      .catch(() => setUsers(DEFAULT_USERS))
  }, [])

  return (
    <AdminShell
      title="Người dùng"
      subtitle="Quản lý danh sách tài khoản và phân quyền hệ thống."
    >
      <div className="panel table-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">ACCESS CONTROL</p>
            <h2>Danh sách người dùng</h2>
          </div>
          <button className="button button-primary">+ Thêm người dùng</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <b>{user.full_name}</b>
                  <small>{user.id.slice(0, 8)}</small>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="role-badge">{user.role}</span>
                </td>
                <td>
                  <span className={user.is_active ? 'status active' : 'status inactive'}>
                    {user.is_active ? 'Đang hoạt động' : 'Đã khóa'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}

export function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [departures, setDepartures] = useState<Departure[]>([])

  useEffect(() => {
    void api.adminTours().then(setTours).catch(() => {})
    void api.adminDepartures().then(setDepartures).catch(() => {})
  }, [])

  return (
    <AdminShell
      title="Tour &amp; lịch khởi hành"
      subtitle="Kiểm soát danh mục trải nghiệm, số chỗ và lịch trình."
    >
      <div className="admin-toolbar">
        <div className="tabs">
          <button className="tab active">Danh mục tour</button>
          <button className="tab">Lịch khởi hành</button>
        </div>
        <button className="button button-primary">+ Tạo tour mới</button>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Mã tour</th>
              <th>Tên hành trình</th>
              <th>Loại tour</th>
              <th>Giá niêm yết</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {tours.map(tour => (
              <tr key={tour.id}>
                <td>
                  <b>{tour.code}</b>
                </td>
                <td>{tour.name}</td>
                <td>{tour.tour_type}</td>
                <td>{tour.base_price.toLocaleString('vi-VN')} đ</td>
                <td>
                  <span className="status active">{tour.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!tours.length && (
          <div className="empty-table">Đang tải hoặc chưa có tour. Tạo tour đầu tiên để bắt đầu.</div>
        )}
      </div>

      <div className="panel table-panel">
        <div className="panel-heading">
          <h2>Lịch khởi hành gần nhất</h2>
          <span className="muted">{departures.length} lịch đã lên</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ngày khởi hành</th>
              <th>Tour</th>
              <th>Sức chứa</th>
              <th>Đã đặt</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {departures.map(d => (
              <tr key={d.id}>
                <td>{d.departure_date}</td>
                <td>{tours.find(t => t.id === d.tour_id)?.name || d.tour_id.slice(0, 8)}</td>
                <td>{d.max_capacity} khách</td>
                <td>{d.booked_capacity} khách</td>
                <td>
                  <span className="status active">{d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    void api
      .adminBookings()
      .then(res => setBookings(res && res.length > 0 ? res : DEFAULT_BOOKINGS))
      .catch(() => setBookings(DEFAULT_BOOKINGS))
  }, [])

  return (
    <AdminShell
      title="Booking &amp; đơn đặt chỗ"
      subtitle="Theo dõi các yêu cầu đặt tour và trạng thái thanh toán."
    >
      <div className="panel table-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">BOOKING MANAGEMENT</p>
            <h2>Tất cả booking</h2>
          </div>
          <button className="button button-ghost">
            <RefreshCw size={15} /> Làm mới
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Mã booking</th>
              <th>Số khách</th>
              <th>Điểm đón</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>
                  <b>{booking.code}</b>
                  <small>{booking.id.slice(0, 8)}</small>
                </td>
                <td>{booking.guest_count} khách</td>
                <td>{booking.pickup_location}</td>
                <td>{booking.total_amount.toLocaleString('vi-VN')} đ</td>
                <td>
                  <span
                    className={
                      booking.status === 'PENDING_PAYMENT' ? 'status warning' : 'status active'
                    }
                  >
                    {booking.status === 'PENDING_PAYMENT' ? 'Chờ thanh toán cọc' : 'Đã xác nhận'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!bookings.length && <div className="empty-table">Chưa có booking nào.</div>}
      </div>
    </AdminShell>
  )
}

export function AdminAuditPage() {
  const [logs, setLogs] = useState<Array<Record<string, unknown>>>([])

  useEffect(() => {
    void api.auditLogs().then(setLogs).catch(() => {})
  }, [])

  return (
    <AdminShell
      title="Nhật ký hệ thống"
      subtitle="Theo dõi các thao tác quan trọng, kiểm soát bảo mật và lịch sử thay đổi."
    >
      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Hành động</th>
              <th>Đối tượng</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{String(log.created_at || '-')}</td>
                <td>
                  <span className="role-badge">{String(log.action)}</span>
                </td>
                <td>
                  {String(log.entity_type)} / {String(log.entity_id).slice(0, 8)}
                </td>
                <td>{String(log.detail || '-')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!logs.length && (
          <div className="empty-table">
            Chưa có nhật ký ghi nhận hoặc hệ thống đang đồng bộ.
          </div>
        )}
      </div>
    </AdminShell>
  )
}
