import { Sparkles } from 'lucide-react'
import Card from '../ui/Card'
import StatusBadge from '../ui/StatusBadge'

function AvailabilityCard() {
  return (
    <Card className="rounded-[26px] bg-ink-900 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
            Service area
          </p>
          <h3 className="mt-2 text-lg font-extrabold">Fedha and nearby Embakasi zones</h3>
        </div>
        <StatusBadge tone="success">Open now</StatusBadge>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[22px] bg-white/8 p-4">
        <Sparkles size={18} className="mt-0.5 text-brand-100" />
        <p className="text-sm leading-6 text-white/82">
          Same-day pickup is available for bookings made before 4:00 PM.
        </p>
      </div>
    </Card>
  )
}

export default AvailabilityCard
