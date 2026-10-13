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

// Local mock storage keys
const STORAGE_BOOKINGS_KEY = 'dalatgo_user_bookings'
const STORAGE_DISPATCHES_KEY = 'dalatgo_dispatches'
const STORAGE_REVIEWS_KEY = 'dalatgo_reviews'

function getStoredBookings(): Booking[] {
  try {
    const data = localStorage.getItem(STORAGE_BOOKINGS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveStoredBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings))
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    tour_id: '746b83a2-7235-4fc5-9cc3-f424b6dd9935',
    user_name: 'Nguyễn Thu Trang',
    rating: 5,
    comment:
      'Chuyến săn mây Cầu Đất thật sự tuyệt vời! Biển mây bồng bềnh lúc 5h30 sáng, anh HDV rất nhiệt tình chụp ảnh cho cả đoàn.',
    date: '10/10/2026',
    verified: true,
  },
  {
    id: 'rev-2',
    tour_id: '746b83a2-7235-4fc5-9cc3-f424b6dd9935',
    user_name: 'Hoàng Minh Quân',
    rating: 5,
    comment:
      'Xe đón đúng giờ, bữa sáng cà phê ngắm đồi chè rất ngon và yên bình. Sẽ rủ bạn bè đi tiếp lần sau.',
    date: '08/10/2026',
    verified: true,
  },
  {
    id: 'rev-3',
    tour_id: '0d47fa94-41b6-482d-8b07-ffcaf014ee1f',
    user_name: 'Trần Bảo Anh',
    rating: 5,
    comment:
      'Thác Pongour mùa này nước đẹp hùng vĩ. Đội ngũ tổ chức chu đáo, trang bị bảo hộ cẩn thận.',
    date: '05/10/2026',
    verified: true,
  },
  {
    id: 'rev-4',
    tour_id: '9133b807-88e5-44ae-a633-bb6146eb44f7',
    user_name: 'Vũ Lan Phương',
    rating: 4.8,
    comment:
      'Quán cà phê view hoàng hôn siêu thơ mộng. Một trải nghiệm chữa lành đúng nghĩa tại Đà Lạt!',
    date: '02/10/2026',
    verified: true,
  },
]

const INITIAL_DISPATCHES: DispatchRecord[] = [
  {
    departure_id: 'dep-1',
    tour_code: 'DL-01',
    tour_name: 'Săn mây Cầu Đất & đồi chè xanh',
    departure_date: 'Hôm nay · 05:00',
    guide_name: 'Trần Văn Hưng (0912.345.678)',
    driver_name: 'Nguyễn Tấn Đạt',
    vehicle_plate: '49B-018.92 (Ford Transit 16 chỗ)',
    vehicle_seats: 16,
    total_guests: 8,
    passengers: [
      {
        id: 'psg-1',
        booking_code: 'DLG-9021',
        name: 'Nguyễn Văn An',
        phone: '0903.112.233',
        guest_count: 2,
        pickup_location: 'Khách sạn Colline (10 Phan Bội Châu)',
        status: 'PICKED_UP',
        balance_due: 0,
        is_paid_full: true,
        notes: 'Có 1 khách ăn chay nhẹ',
      },
      {
        id: 'psg-2',
        booking_code: 'DLG-8843',
        name: 'Trần Thị Mai',
        phone: '0988.445.566',
        guest_count: 4,
        pickup_location: 'Chợ Đà Lạt (Khu Hòa Bình)',
        status: 'PENDING',
        balance_due: 1400000,
        is_paid_full: false,
        notes: 'Thu tiền mặt tại chỗ',
      },
      {
        id: 'psg-3',
        booking_code: 'DLG-7712',
        name: 'Lê Hoàng Long',
        phone: '0918.990.112',
        guest_count: 2,
        pickup_location: 'Homestay Ngàn Thông (Trần Hưng Đạo)',
        status: 'PENDING',
        balance_due: 0,
        is_paid_full: true,
      },
    ],
    cost_estimate: {
      vehicle_cost: 1200000,
      guide_fee: 700000,
      ticket_costs: 800000,
      other_costs: 300000,
    },
  },
  {
    departure_id: 'dep-2',
    tour_code: 'DL-02',
    tour_name: 'Ba thác hoang sơ Đà Lạt',
    departure_date: 'Ngày mai · 08:00',
    guide_name: 'Lê Thanh Tùng (0933.889.900)',
    driver_name: 'Phạm Văn Hòa',
    vehicle_plate: '49B-024.55 (Hyundai Solati 16 chỗ)',
    vehicle_seats: 16,
    total_guests: 6,
    passengers: [
      {
        id: 'psg-4',
        booking_code: 'DLG-6523',
        name: 'Võ Quốc Huy',
        phone: '0945.678.901',
        guest_count: 3,
        pickup_location: 'Terracotta Resort (Hồ Tuyền Lâm)',
        status: 'PENDING',
        balance_due: 1200000,
        is_paid_full: false,
        notes: 'Đón ngoại thành (đã tính phụ thu)',
      },
      {
        id: 'psg-5',
        booking_code: 'DLG-5519',
        name: 'Đặng Kim Yến',
        phone: '0977.123.456',
        guest_count: 3,
        pickup_location: 'Ana Mandara Villas',
        status: 'PENDING',
        balance_due: 0,
        is_paid_full: true,
      },
    ],
    cost_estimate: {
      vehicle_cost: 1500000,
      guide_fee: 800000,
      ticket_costs: 1200000,
      other_costs: 400000,
    },
  },
]

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
    try {
      const serverRes = await request<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          departure_id: payload.departure_id,
          guest_count: payload.guest_count,
          pickup_location: payload.pickup_location,
          customer_name: payload.customer_name,
          customer_phone: payload.customer_phone,
          addons: payload.addons,
          promo_code: payload.promo_code,
          discount_amount: payload.discount_amount || 0,
          total_amount: payload.total_amount,
        }),
      })
      // Enhance with full details
      const enhanced: Booking = {
        ...serverRes,
        customer_name: payload.customer_name || serverRes.customer_name || 'Khách hàng',
        customer_phone: payload.customer_phone || serverRes.customer_phone || '',
        addons: payload.addons || (Array.isArray(serverRes.addons) ? serverRes.addons : []),
        promo_code: payload.promo_code || serverRes.promo_code,
        discount_amount: payload.discount_amount ?? serverRes.discount_amount ?? 0,
        total_amount: payload.total_amount ?? serverRes.total_amount,
        deposit_amount: serverRes.deposit_amount ?? Math.round((payload.total_amount || serverRes.total_amount) * 0.5),
        balance_due: serverRes.balance_due ?? Math.round((payload.total_amount || serverRes.total_amount) * 0.5),
        created_at: serverRes.created_at || new Date().toISOString(),
      }
      const stored = getStoredBookings()
      saveStoredBookings([enhanced, ...stored])
      return enhanced
    } catch {
      // Local fallback booking
      const code = `DLG-${Math.floor(1000 + Math.random() * 9000)}`
      const total = payload.total_amount || 690000 * payload.guest_count
      const deposit = Math.round(total * 0.5)
      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        code,
        departure_id: payload.departure_id,
        customer_id: 'guest',
        customer_name: payload.customer_name || 'Khách hàng',
        customer_phone: payload.customer_phone || '',
        guest_count: payload.guest_count,
        pickup_location: payload.pickup_location,
        total_amount: total,
        deposit_amount: deposit,
        balance_due: total - deposit,
        status: 'PENDING_PAYMENT',
        addons: payload.addons || [],
        promo_code: payload.promo_code,
        discount_amount: payload.discount_amount || 0,
        created_at: new Date().toISOString(),
      }
      const stored = getStoredBookings()
      saveStoredBookings([newBooking, ...stored])
      return newBooking
    }
  },

  lookupBooking: async (code: string, phone = ''): Promise<Booking | null> => {
    const cleanCode = code.trim().toUpperCase()
    const cleanPhone = phone.trim()

    // 1. Try server lookup first
    try {
      const serverRes = await request<Booking>(
        `/bookings/lookup?code=${encodeURIComponent(cleanCode)}${cleanPhone ? `&phone=${encodeURIComponent(cleanPhone)}` : ''}`
      )
      if (serverRes) return serverRes
    } catch {
      // Server not reachable or 404, fall through to local cache
    }

    // 2. Check stored user bookings
    const stored = getStoredBookings()
    const found = stored.find(
      b =>
        b.code.toUpperCase() === cleanCode &&
        (!cleanPhone || b.customer_phone?.includes(cleanPhone))
    )
    if (found) return found

    // 3. Built-in demo bookings for testing
    if (cleanCode === 'DLG-9021') {
      return {
        id: 'b-demo-1',
        code: 'DLG-9021',
        departure_id: 'dep-1',
        customer_id: 'u-3',
        customer_name: 'Nguyễn Văn An',
        customer_phone: '0903112233',
        guest_count: 2,
        pickup_location: 'Khách sạn Colline (10 Phan Bội Châu)',
        total_amount: 1380000,
        deposit_amount: 1380000,
        balance_due: 0,
        status: 'CONFIRMED',
        created_at: '2026-10-12T08:30:00Z',
      }
    }
    if (cleanCode === 'DLG-8843') {
      return {
        id: 'b-demo-2',
        code: 'DLG-8843',
        departure_id: 'dep-1',
        customer_id: 'u-3',
        customer_name: 'Trần Thị Mai',
        customer_phone: '0988445566',
        guest_count: 4,
        pickup_location: 'Chợ Đà Lạt (Khu Hòa Bình)',
        total_amount: 2760000,
        deposit_amount: 1380000,
        balance_due: 1380000,
        status: 'PENDING_PAYMENT',
        created_at: '2026-10-13T09:15:00Z',
      }
    }
    return null
  },

  confirmPayment: async (code: string, method: string) => {
    const cleanCode = code.trim().toUpperCase()
    try {
      await request<Booking>(`/bookings/${encodeURIComponent(cleanCode)}/confirm-payment`, {
        method: 'POST',
        body: JSON.stringify({ method }),
      })
    } catch {
      // Fallback to local storage update
    }
    const stored = getStoredBookings()
    const updated = stored.map(b => {
      if (b.code.toUpperCase() === cleanCode) {
        return {
          ...b,
          status: 'CONFIRMED',
          deposit_amount: b.total_amount,
          balance_due: 0,
        }
      }
      return b
    })
    saveStoredBookings(updated)
    return { success: true, method, code: cleanCode }
  },

  requestCancelBooking: async (code: string, reason: string) => {
    const cleanCode = code.trim().toUpperCase()
    try {
      await request<Booking>(`/bookings/${encodeURIComponent(cleanCode)}/cancel-request`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      })
    } catch {
      // Fallback
    }
    const stored = getStoredBookings()
    const updated = stored.map(b => {
      if (b.code.toUpperCase() === cleanCode) {
        return { ...b, status: 'CANCEL_REQUESTED', notes: reason }
      }
      return b
    })
    saveStoredBookings(updated)
    return { success: true, refundPercentage: 80 }
  },

  getReviews: async (tourId: string): Promise<Review[]> => {
    try {
      const serverReviews = await request<Review[]>(`/reviews${tourId ? `?tour_id=${encodeURIComponent(tourId)}` : ''}`)
      if (serverReviews && serverReviews.length > 0) return serverReviews
    } catch {
      // Fallback
    }
    try {
      const data = localStorage.getItem(STORAGE_REVIEWS_KEY)
      const all: Review[] = data ? JSON.parse(data) : INITIAL_REVIEWS
      return all.filter(r => !tourId || r.tour_id === tourId)
    } catch {
      return INITIAL_REVIEWS
    }
  },

  submitReview: async (review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
    try {
      const serverRes = await request<Review>('/reviews', {
        method: 'POST',
        body: JSON.stringify(review),
      })
      if (serverRes) return serverRes
    } catch {
      // Fallback
    }
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
    }
    const current = await api.getReviews('')
    const updated = [newRev, ...current]
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updated))
    return newRev
  },

  getDispatches: async (): Promise<DispatchRecord[]> => {
    try {
      const serverRes = await request<DispatchRecord[]>('/admin/dispatches')
      if (serverRes && serverRes.length > 0) return serverRes
    } catch {
      // Fallback
    }
    try {
      const data = localStorage.getItem(STORAGE_DISPATCHES_KEY)
      return data ? JSON.parse(data) : INITIAL_DISPATCHES
    } catch {
      return INITIAL_DISPATCHES
    }
  },

  updatePassengerStatus: async (
    departureId: string,
    passengerId: string,
    status: 'PENDING' | 'PICKED_UP' | 'NO_SHOW',
    balanceCollected = false
  ) => {
    try {
      const serverRes = await request<DispatchRecord[]>(
        `/admin/dispatches/${departureId}/passengers/${passengerId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status, balance_collected: balanceCollected }),
        }
      )
      if (serverRes && serverRes.length > 0) return serverRes
    } catch {
      // Fallback
    }
    const dispatches = await api.getDispatches()
    const updated = dispatches.map(disp => {
      if (disp.departure_id === departureId) {
        return {
          ...disp,
          passengers: disp.passengers.map(p => {
            if (p.id === passengerId) {
              return {
                ...p,
                status,
                is_paid_full: balanceCollected ? true : p.is_paid_full,
                balance_due: balanceCollected ? 0 : p.balance_due,
              }
            }
            return p
          }),
        }
      }
      return disp
    })
    localStorage.setItem(STORAGE_DISPATCHES_KEY, JSON.stringify(updated))
    return updated
  },

  assignResource: async (
    departureId: string,
    guideName: string,
    vehiclePlate: string,
    driverName: string
  ) => {
    try {
      const serverRes = await request<DispatchRecord[]>(
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
      if (serverRes && serverRes.length > 0) return serverRes
    } catch {
      // Fallback
    }
    const dispatches = await api.getDispatches()
    const updated = dispatches.map(disp => {
      if (disp.departure_id === departureId) {
        return {
          ...disp,
          guide_name: guideName,
          vehicle_plate: vehiclePlate,
          driver_name: driverName,
        }
      }
      return disp
    })
    localStorage.setItem(STORAGE_DISPATCHES_KEY, JSON.stringify(updated))
    return updated
  },

}
