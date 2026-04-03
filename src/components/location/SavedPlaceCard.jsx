import { Check, MapPinned } from 'lucide-react'
import Card from '../ui/Card'

function SavedPlaceCard({ place, selected, onSelect }) {
  return (
    <button type="button" onClick={onSelect} className="w-full text-left">
      <Card
        className={[
          'rounded-[26px] transition-colors',
          selected ? 'border-brand-500 bg-brand-50' : 'bg-white',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-ink-700">
              <MapPinned size={18} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-ink-900">{place.label}</h3>
              <p className="mt-1 text-xs leading-5 text-ink-500">{place.address}</p>
            </div>
          </div>

          <div
            className={[
              'flex h-6 w-6 items-center justify-center rounded-full',
              selected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-transparent',
            ].join(' ')}
          >
            <Check size={14} />
          </div>
        </div>
      </Card>
    </button>
  )
}

export default SavedPlaceCard
