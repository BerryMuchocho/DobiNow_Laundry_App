import { Clock3 } from 'lucide-react'
import Card from '../ui/Card'

function TimeSlotCard({ slot, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <Card
        className={[
          'rounded-3xl p-4 transition-colors',
          selected ? 'border-brand-500 bg-brand-50' : 'bg-white',
          slot.disabled ? 'cursor-not-allowed opacity-50' : '',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-600">
              <Clock3 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-ink-900">{slot.label}</h3>
              <p className="text-xs text-ink-500">{slot.capacity}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-ink-500">{slot.fee}</span>
        </div>
      </Card>
    </button>
  )
}

export default TimeSlotCard
