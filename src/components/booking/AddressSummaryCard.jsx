import { MapPin } from 'lucide-react'
import Card from '../ui/Card'

function AddressSummaryCard({ address }) {
  return (
    <Card className="rounded-[26px] bg-slate-50">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
        Pickup address
      </p>
      <div className="mt-3 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600">
          <MapPin size={18} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-ink-900">{address.label}</h3>
          <p className="mt-1 text-xs leading-5 text-ink-500">{address.address}</p>
        </div>
      </div>
    </Card>
  )
}

export default AddressSummaryCard
