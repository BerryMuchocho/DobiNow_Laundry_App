import { MapPin, MapPinHouse, CreditCard, Gift, HeadphonesIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PaymentMethodCard from '../components/profile/PaymentMethodCard'
import ProfileSummaryCard from '../components/profile/ProfileSummaryCard'
import QuickActionCard from '../components/profile/QuickActionCard'
import RecentOrderCard from '../components/profile/RecentOrderCard'
import { recentOrders } from '../data/orders'
import { useAuthStore } from '../store/authStore'

function ProfilePage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  /*
   * Updated to match the design exactly — 4 tiles:
   * Addresses, Payment Methods, Refer a Friend (highlighted), Help Center.
   * "highlighted" adds the lavender background to the Refer a Friend tile.
   */
  const quickActions = [
    { icon: MapPinHouse,     title: 'Addresses',       route: '/addresses' },
    { icon: CreditCard,      title: 'Payment Methods', route: '/payments' },
    { icon: Gift,            title: 'Refer a Friend',  route: '/referral', highlighted: true },
    { icon: HeadphonesIcon,  title: 'Help Center',     route: '/help' },
  ]

  return (
    <div className="relative max-w-sm mx-auto min-h-screen bg-slate-100">
      <div className="overflow-y-auto px-5 pt-5 pb-10 space-y-6">

        {/* Header — MapPin + DobiNow left, circular avatar right */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-600">
            <MapPin size={18} />
            <span className="text-lg font-bold">DobiNow</span>
          </div>
          {/* Replace src with real user photo from your auth store when available */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-300">
            <img
              src="/avatar-placeholder.png"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Account overview label above the main heading */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-400">
            Account Overview
          </p>
          <h1 className="text-4xl font-extrabold text-ink-900 mt-1">
            My Account
          </h1>
        </div>

        {/* Profile summary — name, tier, loyalty count */}
        <ProfileSummaryCard />

        {/* Quick action tiles — 2x2 grid */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.title}
              icon={action.icon}
              title={action.title}
              highlighted={action.highlighted}
              onClick={() => navigate(action.route)}
            />
          ))}
        </div>

        {/* Primary payment method */}
        <section>
          <h2 className="text-base font-bold text-ink-900 mb-3">Primary Payment</h2>
          <PaymentMethodCard />
        </section>

        {/* Recent orders — header row with View All link */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-ink-900">Recent Orders</h2>
            <button
              onClick={() => navigate('/orders')}
              className="text-sm font-semibold text-brand-600"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {recentOrders.map((order) => (
              <RecentOrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>

        {/* Sign out — centred and red to match the design */}
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="w-full text-center text-base font-bold text-red-500 py-2"
        >
          Sign Out
        </button>

      </div>
    </div>
  )
}

export default ProfilePage
