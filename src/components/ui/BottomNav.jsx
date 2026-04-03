import { CirclePlus, Gift, Home, Package, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/tracking', icon: Package, label: 'Orders' },
  { to: '/location', icon: CirclePlus, label: 'Book' },
  { to: '/referral', icon: Gift, label: 'Offers' },
  { to: '/profile', icon: User, label: 'Profile' },
]

function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-40 bg-white/92 px-3 pb-4 pt-2 backdrop-blur">
      <div className="mx-auto grid max-w-88 grid-cols-5 gap-1 rounded-[26px] border border-line bg-white px-2 py-2 shadow-[0_-8px_24px_rgba(34,35,63,0.04)]">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-1 rounded-[18px] px-1 py-2 text-[9px] font-extrabold uppercase tracking-[0.08em] transition-colors',
                  isActive ? 'text-brand-600' : 'text-ink-500',
                ].join(' ')
              }
            >
              {item.label === 'Book' ? (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_8px_20px_rgba(43,120,255,0.3)]">
                  <Icon size={18} />
                </span>
              ) : (
                <Icon size={18} />
              )}
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
