import { useState, useEffect } from 'react'
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  UserCheck,
  AlertTriangle,
  Banknote,
  TrendingUp,
  RefreshCw,
  Edit2,
  Save,
} from 'lucide-react'
import { AdminSidebar } from '../components/Layout'
import { api, DispatchRecord, PassengerManifest } from '../lib/api'

export function AdminOperationsPage() {
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([])
  const [activeDepartureId, setActiveDepartureId] = useState<string>('dep-1')
  const [editingResource, setEditingResource] = useState(false)
  const [guideInput, setGuideInput] = useState('')
  const [vehicleInput, setVehicleInput] = useState('')
  const [driverInput, setDriverInput] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  const loadData = async () => {
    const data = await api.getDispatches()
    setDispatches(data)
    if (data.length > 0 && !activeDepartureId) {
      setActiveDepartureId(data[0].departure_id)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const currentDispatch = dispatches.find(d => d.departure_id === activeDepartureId) || dispatches[0]

  useEffect(() => {
    if (currentDispatch) {
      setGuideInput(currentDispatch.guide_name)
      setVehicleInput(currentDispatch.vehicle_plate)
      setDriverInput(currentDispatch.driver_name)
    }
  }, [currentDispatch])

  const handleStatusChange = async (
    passengerId: string,
    newStatus: 'PENDING' | 'PICKED_UP' | 'NO_SHOW'
  ) => {
    if (!currentDispatch) return
    const updated = await api.updatePassengerStatus(
      currentDispatch.departure_id,
      passengerId,
      newStatus
    )
    setDispatches(updated)
  }

  const handleCollectCash = async (passengerId: string) => {
    if (!currentDispatch) return
    const updated = await api.updatePassengerStatus(
      currentDispatch.departure_id,
      passengerId,
      'PICKED_UP',
      true
    )
    setDispatches(updated)
  }

  const handleSaveResource = async () => {
    if (!currentDispatch) return
    const updated = await api.assignResource(
      currentDispatch.departure_id,
      guideInput,
      vehicleInput,
      driverInput
    )
    setDispatches(updated)
    setEditingResource(false)
    setSaveMsg('Đã lưu phân công nguồn lực thành công!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  // Calculate tour financials
  const ticketRevenue = currentDispatch
    ? currentDispatch.passengers.reduce((sum, p) => sum + p.guest_count * 690000, 0)
    : 0
  const totalCost = currentDispatch
    ? Object.values(currentDispatch.cost_estimate).reduce((a, b) => a + b, 0)
    : 0
  const grossProfit = ticketRevenue - totalCost
  const profitMargin = ticketRevenue > 0 ? Math.round((grossProfit / ticketRevenue) * 100) : 0

  return (
    <div className="admin-layout content-saas">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <p className="eyebrow">DALAT GO / OPERATIONS &amp; DISPATCH</p>
            <h1>Điều hành đoàn &amp; Điểm danh</h1>
            <p className="muted">
              Phân công Hướng dẫn viên, xe du lịch, điểm danh đón khách và theo dõi quyết toán chuyến.
            </p>
          </div>
          <button className="button button-ghost" onClick={loadData}>
            <RefreshCw size={15} /> Làm mới danh sách
          </button>
        </div>

        {saveMsg && <div className="form-success">{saveMsg}</div>}

        {/* Departure Selector Tabs */}
        <div className="admin-toolbar">
          <div className="tabs">
            {dispatches.map(d => (
              <button
                key={d.departure_id}
                className={`tab ${activeDepartureId === d.departure_id ? 'active' : ''}`}
                onClick={() => {
                  setActiveDepartureId(d.departure_id)
                  setEditingResource(false)
                }}
              >
                <b>{d.tour_code}</b> · {d.departure_date} ({d.total_guests} khách)
              </button>
            ))}
          </div>
        </div>

        {currentDispatch && (
          <div className="operations-grid">
            {/* Left: Manifest & Check-in table */}
            <div className="panel table-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">PASSENGER MANIFEST ({currentDispatch.total_guests} KHÁCH)</p>
                  <h2>{currentDispatch.tour_name}</h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="role-badge">
                    Đã đón:{' '}
                    {
                      currentDispatch.passengers.filter(p => p.status === 'PICKED_UP').length
                    }
                    /{currentDispatch.passengers.length} booking
                  </span>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Khách hàng &amp; Mã</th>
                    <th>Số khách</th>
                    <th>Điểm đón</th>
                    <th>Công nợ thu tại chỗ</th>
                    <th>Trạng thái đón</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDispatch.passengers.map(p => (
                    <tr key={p.id}>
                      <td>
                        <b>{p.name}</b>
                        <small>{p.phone} · {p.booking_code}</small>
                        {p.notes && <small style={{ color: 'var(--orange)' }}>Lưu ý: {p.notes}</small>}
                      </td>
                      <td>
                        <b>{p.guest_count} khách</b>
                      </td>
                      <td>
                        <span style={{ fontSize: '12.5px' }}>{p.pickup_location}</span>
                      </td>
                      <td>
                        {p.is_paid_full ? (
                          <span className="status active">Đã thanh toán đủ</span>
                        ) : (
                          <div>
                            <b style={{ color: 'var(--orange)' }}>
                              {p.balance_due.toLocaleString('vi-VN')} đ
                            </b>
                            <button
                              className="collect-btn"
                              onClick={() => handleCollectCash(p.id)}
                              title="Xác nhận đã thu tiền mặt khi đón"
                            >
                              <Banknote size={12} /> Thu tiền mặt
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="checkin-buttons">
                          <button
                            className={`checkin-btn ${p.status === 'PICKED_UP' ? 'picked' : ''}`}
                            onClick={() => handleStatusChange(p.id, 'PICKED_UP')}
                            title="Đã đón lên xe"
                          >
                            <CheckCircle2 size={14} /> Đã đón
                          </button>
                          <button
                            className={`checkin-btn ${p.status === 'PENDING' ? 'pending' : ''}`}
                            onClick={() => handleStatusChange(p.id, 'PENDING')}
                            title="Chờ xe đến"
                          >
                            <Clock size={14} /> Chờ đón
                          </button>
                          <button
                            className={`checkin-btn ${p.status === 'NO_SHOW' ? 'noshow' : ''}`}
                            onClick={() => handleStatusChange(p.id, 'NO_SHOW')}
                            title="Vắng mặt"
                          >
                            <XCircle size={14} /> Vắng
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right: Resource Assignment & Financials */}
            <div className="operations-side-col">
              {/* Resource Assignment Card */}
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">ĐIỀU PHỐI NGUỒN LỰC</p>
                    <h2>Xe &amp; Hướng dẫn viên</h2>
                  </div>
                  {!editingResource ? (
                    <button
                      className="button button-ghost"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      onClick={() => setEditingResource(true)}
                    >
                      <Edit2 size={13} /> Sửa
                    </button>
                  ) : (
                    <button
                      className="button button-primary"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      onClick={handleSaveResource}
                    >
                      <Save size={13} /> Lưu
                    </button>
                  )}
                </div>

                {!editingResource ? (
                  <div className="resource-view-list">
                    <div className="resource-item">
                      <UserCheck size={18} color="var(--teal)" />
                      <div>
                        <label>Hướng dẫn viên chính:</label>
                        <strong>{currentDispatch.guide_name}</strong>
                      </div>
                    </div>
                    <div className="resource-item">
                      <Car size={18} color="var(--teal)" />
                      <div>
                        <label>Phương tiện vận chuyển:</label>
                        <strong>{currentDispatch.vehicle_plate}</strong>
                      </div>
                    </div>
                    <div className="resource-item">
                      <Users size={18} color="var(--teal)" />
                      <div>
                        <label>Tài xế phụ trách:</label>
                        <strong>{currentDispatch.driver_name}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="resource-edit-form">
                    <label>
                      Hướng dẫn viên:
                      <input
                        value={guideInput}
                        onChange={e => setGuideInput(e.target.value)}
                        placeholder="Tên HDV & SĐT..."
                      />
                    </label>
                    <label>
                      Phương tiện / Biển số:
                      <input
                        value={vehicleInput}
                        onChange={e => setVehicleInput(e.target.value)}
                        placeholder="Biển số & loại xe..."
                      />
                    </label>
                    <label>
                      Tài xế:
                      <input
                        value={driverInput}
                        onChange={e => setDriverInput(e.target.value)}
                        placeholder="Tên tài xế..."
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Tour P&L Card */}
              <div className="panel financial-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow" style={{ color: '#a5d6a7' }}>
                      BÁO CÁO TÀI CHÍNH CHUYẾN
                    </p>
                    <h2 style={{ color: '#fff' }}>Ước tính Lãi / Lỗ (P&amp;L)</h2>
                  </div>
                  <TrendingUp size={22} color="#81c784" />
                </div>

                <div className="pnl-rows">
                  <div className="pnl-row">
                    <span>Doanh thu vé ({currentDispatch.total_guests} khách):</span>
                    <b>+{ticketRevenue.toLocaleString('vi-VN')} đ</b>
                  </div>
                  <div className="pnl-row">
                    <span>Chi phí xe &amp; tài xế:</span>
                    <span>-{currentDispatch.cost_estimate.vehicle_cost.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="pnl-row">
                    <span>Thù lao HDV:</span>
                    <span>-{currentDispatch.cost_estimate.guide_fee.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="pnl-row">
                    <span>Vé thắng cảnh &amp; chi phí khác:</span>
                    <span>
                      -
                      {(
                        currentDispatch.cost_estimate.ticket_costs +
                        currentDispatch.cost_estimate.other_costs
                      ).toLocaleString('vi-VN')}{' '}
                      đ
                    </span>
                  </div>

                  <div className="pnl-divider" />

                  <div className="pnl-row total">
                    <span>Lợi nhuận gộp chuyến:</span>
                    <strong style={{ color: '#69f0ae', fontSize: '18px' }}>
                      +{grossProfit.toLocaleString('vi-VN')} đ ({profitMargin}%)
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
