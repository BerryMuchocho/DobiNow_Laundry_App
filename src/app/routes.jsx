import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import BottomNav from '../components/ui/BottomNav'
import RouteErrorBoundary from '../components/ui/RouteErrorBoundary'
import CheckoutPage from '../pages/CheckoutPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import LocationPage from '../pages/LocationPage'
import ProfilePage from '../pages/ProfilePage'
import ReferralPage from '../pages/ReferralPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import SchedulePage from '../pages/SchedulePage'
import ServicesPage from '../pages/ServicesPage'
import SignupPage from '../pages/SignupPage'
import TrackingPage from '../pages/TrackingPage'
import VerifyOtpPage from '../pages/VerifyOtpPage'
import { useAuthStore } from '../store/authStore'

function RootLayout() {
  // Pages in the main tab bar share the same mobile shell and bottom navigation.
  return (
    <div className="app-shell">
      <div className="page-scroll">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

function FlowLayout() {
  // Booking steps hide the tab bar so the call-to-action area stays focused.
  return (
    <div className="app-shell">
      <div className="flow-scroll">
        <Outlet />
      </div>
    </div>
  )
}

function AuthLayout() {
  return (
    <div className="app-shell">
      <div className="flow-scroll">
        <Outlet />
      </div>
    </div>
  )
}

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function GuestOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return isAuthenticated ? <Navigate to="/profile" replace /> : <Outlet />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/referral" element={<ReferralPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RootLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<FlowLayout />}>
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route
          path="/checkout"
          element={
            <RouteErrorBoundary>
              <CheckoutPage />
            </RouteErrorBoundary>
          }
        />
      </Route>

      <Route element={<GuestOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
