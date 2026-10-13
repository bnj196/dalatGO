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
  guide_name?: string
  driver_name?: string
  vehicle_plate?: string
  vehicle_seats?: number
}

export type AddonOption = {
  id: string
  name: string
  price: number
  unit: string
  description: string
}

export type Booking = {
  id: string
  code: string
  departure_id: string
  customer_id: string
  guest_count: number
  pickup_location: string
  total_amount: number
  deposit_amount?: number
  balance_due?: number
  status: string
  customer_name?: string
  customer_phone?: string
  addons?: string[]
  promo_code?: string
  discount_amount?: number
  created_at?: string
}

export type User = {
  id: string
  full_name: string
  email: string
  role: string
  is_active: boolean
}

export type Review = {
  id: string
  tour_id: string
  user_name: string
  avatar?: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export type ItineraryStop = {
  time: string
  title: string
  description: string
  highlight?: string
}

export type PassengerManifest = {
  id: string
  booking_code: string
  name: string
  phone: string
  guest_count: number
  pickup_location: string
  status: 'PENDING' | 'PICKED_UP' | 'NO_SHOW'
  balance_due: number
  is_paid_full: boolean
  notes?: string
}

export type DispatchRecord = {
  departure_id: string
  tour_code: string
  tour_name: string
  departure_date: string
  guide_name: string
  driver_name: string
  vehicle_plate: string
  vehicle_seats: number
  total_guests: number
  passengers: PassengerManifest[]
  cost_estimate: {
    vehicle_cost: number
    guide_fee: number
    ticket_costs: number
    other_costs: number
  }
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
  tours: (search = '') =>
    request<Tour[]>(`/tours${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  adminDashboard: () =>
    request<{
      users: number
      tours: number
      departures: number
      bookings: number
      pending_bookings: number
      confirmed_bookings?: number
      revenue_total?: number
    }>('/admin/dashboard'),
  adminUsers: () => request<User[]>('/admin/users'),
  adminTours: () => request<Tour[]>('/admin/tours'),
  adminDepartures: () => request<Departure[]>('/admin/departures'),
  departures: () => request<Departure[]>('/departures'),
  adminBookings: () => request<Booking[]>('/bookings'),
  auditLogs: () => request<Array<Record<string, unknown>>>('/admin/audit-logs'),

  login: async (email: string, password: string) => {
    const form = new URLSearchParams({ username: email, password })
    return request<{ access_token: string; token_type: string }>('/auth/login', {
      method: 'POST',
      body: form,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  },
  me: () => request<User>('/auth/me'),

  createBooking: async (payload: {
    departure_id: string
    guest_count: number
    pickup_location: string
    customer_name?: string
    customer_phone?: string
    addons?: string[]
    promo_code?: string
    discount_amount?: number
    total_amount?: number
  }) => {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  lookupBooking: async (code: string, phone = ''): Promise<Booking | null> => {
    const cleanCode = code.trim().toUpperCase()
    const cleanPhone = phone.trim()
    try {
      return await request<Booking>(
        `/bookings/lookup?code=${encodeURIComponent(cleanCode)}${cleanPhone ? `&phone=${encodeURIComponent(cleanPhone)}` : ''}`
      )
    } catch {
      return null
    }
  },

  confirmPayment: async (code: string, method: string) => {
    const cleanCode = code.trim().toUpperCase()
    return request<Booking>(`/bookings/${encodeURIComponent(cleanCode)}/confirm-payment`, {
      method: 'POST',
      body: JSON.stringify({ method }),
    })
  },

  requestCancelBooking: async (code: string, reason: string) => {
    const cleanCode = code.trim().toUpperCase()
    await request<Booking>(`/bookings/${encodeURIComponent(cleanCode)}/cancel-request`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
    return { success: true, refundPercentage: 80 }
  },

  getReviews: async (tourId: string): Promise<Review[]> => {
    return request<Review[]>(`/reviews${tourId ? `?tour_id=${encodeURIComponent(tourId)}` : ''}`)
  },

  submitReview: async (review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
    return request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    })
  },

  getDispatches: async (): Promise<DispatchRecord[]> => {
    return request<DispatchRecord[]>('/admin/dispatches')
  },

  updatePassengerStatus: async (
    departureId: string,
    passengerId: string,
    status: 'PENDING' | 'PICKED_UP' | 'NO_SHOW',
    balanceCollected = false
  ) => {
    return request<DispatchRecord[]>(
      `/admin/dispatches/${departureId}/passengers/${passengerId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, balance_collected: balanceCollected }),
      }
    )
  },

  assignResource: async (
    departureId: string,
    guideName: string,
    vehiclePlate: string,
    driverName: string
  ) => {
    return request<DispatchRecord[]>(
      `/admin/dispatches/${departureId}/resources`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          guide_name: guideName,
          vehicle_plate: vehiclePlate,
          driver_name: driverName,
        }),
      }
    )
  },
}
