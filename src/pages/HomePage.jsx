import { CircleUserRound, Shirt, Sparkles, CalendarClock, Clock3, PackageCheck, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ActiveOrderCard from '../components/home/ActiveOrderCard'
import HeroCard from '../components/home/HeroCard'
import ServiceMiniCard from '../components/home/ServiceMiniCard'
import Card from '../components/ui/Card'
import { useAuthStore } from '../store/authStore'

function HomePage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // These small cards give the home screen quick-entry shortcuts.
  const serviceCards = [
    { icon: Shirt, title: 'Wash & Fold', caption: 'KES 150/kg' },
    { icon: Sparkles, title: 'Ironing', caption: 'KES 80/item' },
  ]

  return (
    <div className="mx-auto flex w-full max-w-88 flex-col gap-5">
      <header className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="flex min-w-0 items-center gap-1 text-[11px] font-semibold text-ink-500">
          <MapPin size={14} className="shrink-0 text-blue-700" />
          <span className="truncate">Fedha, Embakasi</span>
        </div>

        <div className="justify-self-center text-center text-[19px] font-extrabold tracking-[-0.04em] text-brand-600">
          DobiNow
        </div>

        <div className="flex justify-self-end">
          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffe4d2] text-[#f2a46f] ring-2 ring-white"
          >
            <CircleUserRound size={16} />
          </button>
        </div>
      </header>

      <section className="space-y-0.5">
        <h1 className="text-4xl font-extrabold leading-[1.06] tracking-[-0.06em] text-ink-900">
          Book pickup,
        </h1>
        <h1 className="text-4xl font-extrabold leading-[1.06] tracking-[-0.06em] text-brand-600">
          We clean,
        </h1>
        <h1 className="text-4xl font-extrabold leading-[1.06] tracking-[-0.06em] text-ink-900">
          We deliver.
        </h1>
      </section>

      <HeroCard />

      <ActiveOrderCard />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-ink-900">
            Our Services
          </h2>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="text-xs font-extrabold text-brand-600"
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {serviceCards.map((item) => (
            <ServiceMiniCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <Card className="rounded-3xl bg-[#202342] p-5 text-white">
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold leading-[1.08] tracking-[-0.05em]">
            Our hassle-free cycle
          </h3>
          <p className="max-w-70 text-[13px] leading-5 text-white/70">
            We do laundry. You get your time back.
          </p>
        </div>

        <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <CalendarClock size={18} className="text-white"/> 
            </div>
            <p className="text-[12px] font-medium text-white/85">
              Schedule in seconds 
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Clock3 size={18} className="text-white" />
            </div>
            <p className="text-[12px] font-medium text-white/85">
              24h turnaround
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <PackageCheck size={18} className="text-white" />
            </div>
            <p className="text-[12px] font-medium text-white/85">
              Fresh, folded, delivered
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default HomePage
