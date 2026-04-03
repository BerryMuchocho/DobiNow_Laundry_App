import { CheckCircle2 } from 'lucide-react'
import Card from '../ui/Card'
import StatusBadge from '../ui/StatusBadge'

function ServiceOptionCard({ service, selected, onSelect }) {
  return (
    <button type="button" onClick={onSelect} className="w-full text-left">
      <Card
        className={[
          'rounded-[28px] p-5 transition-colors',
          selected ? 'border-brand-500 bg-brand-50' : 'bg-white',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-ink-900">{service.title}</h3>
              <StatusBadge tone="neutral">{service.tag}</StatusBadge>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-500">{service.description}</p>
          </div>
          <CheckCircle2
            size={22}
            className={selected ? 'text-brand-500' : 'text-slate-300'}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-extrabold text-ink-900">{service.priceLabel}</p>
          <p className="text-xs font-bold text-ink-500">{service.turnaround}</p>
        </div>
      </Card>
    </button>
  )
}

export default ServiceOptionCard
