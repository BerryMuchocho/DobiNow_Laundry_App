import { Outlet, Route, Routes } from 'react-router-dom'
import BottomNav from '../components/ui/BottomNav'
import RouteErrorBoundary from '../components/ui/RouteErrorBoundary'
import CheckoutPage from '../pages/CheckoutPage'
import HomePage from '../pages/HomePage'
import LocationPage from '../pages/LocationPage'
import ProfilePage from '../pages/ProfilePage'
import ReferralPage from '../pages/ReferralPage'
import SchedulePage from '../pages/SchedulePage'
import ServicesPage from '../pages/ServicesPage'
import TrackingPage from '../pages/TrackingPage'

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

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/referral" element={<ReferralPage />} />
        <Route path="/profile" element={<ProfilePage />} />
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
    </Routes>
  )
}
