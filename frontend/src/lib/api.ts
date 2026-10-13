export type Tour = {
  id: string
  code: string
  name: string
  tour_type: string
  description?: string
  duration_minutes: number
  base_price: number
  status: string
}

export type Departure = {
  id: string
  tour_id: string
  departure_date: string
  max_capacity: number
  booked_capacity: number
  status: string
}

export type Booking = {
  id: string
  code: string
  departure_id: string
  customer_id: string
  guest_count: number
  pickup_location: string
  total_amount: number
  status: string
}

export type User = {
  id: string
  full_name: string
  email: string
  role: string
  is_active: boolean
}

const API_URL = import.meta.env.VITE_API_URL || 'https://dalatgo-backend.wasmer.app/api/v1'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('dalatgo_token')
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || 'Không thể kết nối tới máy chủ')
  }
  return response.json()
}

export const api = {
  tours: (search = '') => request<Tour[]>(`/tours${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  adminDashboard: () => request<{ users: number; tours: number; departures: number; bookings: number; pending_bookings: number }>('/admin/dashboard'),
  adminUsers: () => request<User[]>('/admin/users'),
  adminTours: () => request<Tour[]>('/admin/tours'),
  adminDepartures: () => request<Departure[]>('/admin/departures'),

  departures: () => request<Departure[]>('/departures'),

  adminBookings: () => request<Booking[]>('/bookings'),
  auditLogs: () => request<Array<Record<string, unknown>>>('/admin/audit-logs'),
  login: async (email: string, password: string) => {
    const form = new URLSearchParams({ username: email, password })
    return request<{ access_token: string; token_type: string }>('/auth/login', { method: 'POST', body: form, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
  },
  me: () => request<User>('/auth/me'),
  createBooking: (payload: { departure_id: string; guest_count: number; pickup_location: string }) => request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
}
