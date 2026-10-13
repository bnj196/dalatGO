import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Layout'
import { MotionProvider } from './components/MotionContext'
import {
  AdminAuditPage,
  AdminBookingsPage,
  AdminDashboardPage,
  AdminToursPage,
  AdminUsersPage,
} from './pages/Admin'
import { AdminOperationsPage } from './pages/AdminOperationsPage'
import { HomePage, ToursPage } from './pages/Public'
import { LoginPage, TourDetailPage } from './pages/Booking'
import { BookingLookupPage } from './pages/BookingLookupPage'

import type { ReactElement, ReactNode } from 'react'

function ProtectedAdmin({ children }: { children: ReactElement }) {
  return localStorage.getItem('dalatgo_role') === 'ADMIN' ? children : <Navigate to="/login" replace />
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/tours"
          element={
            <PublicLayout>
              <ToursPage />
            </PublicLayout>
          }
        />
        <Route
          path="/tours/:id"
          element={
            <PublicLayout>
              <TourDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/lookup"
          element={
            <PublicLayout>
              <BookingLookupPage />
            </PublicLayout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminDashboardPage />
            </ProtectedAdmin>
          }
        />
        <Route
          path="/admin/operations"
          element={
            <ProtectedAdmin>
              <AdminOperationsPage />
            </ProtectedAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdmin>
              <AdminUsersPage />
            </ProtectedAdmin>
          }
        />
        <Route
          path="/admin/tours"
          element={
            <ProtectedAdmin>
              <AdminToursPage />
            </ProtectedAdmin>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedAdmin>
              <AdminBookingsPage />
            </ProtectedAdmin>
          }
        />
        <Route
          path="/admin/audit"
          element={
            <ProtectedAdmin>
              <AdminAuditPage />
            </ProtectedAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MotionProvider>
  )
}
