import { MapPin, MoveDiagonal, Navigation } from 'lucide-react'
import Card from '../ui/Card'
import { createStaticMapUrl } from '../../utils/mapboxLocation'

function formatCoordinate(value) {
  return typeof value === 'number' ? value.toFixed(5) : '--'
}

function LocationMapPreview({ address, lat, lng, accessToken, source }) {
  const mapPreviewUrl = createStaticMapUrl(lat, lng, accessToken)

  return (
    <Card className="overflow-hidden rounded-[26px] bg-white p-0">
      <div className="relative h-44 bg-slate-100">
        {mapPreviewUrl ? (
          <img src={mapPreviewUrl} alt={address || 'Selected map pin'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(43,120,255,0.16),_transparent_55%),linear-gradient(135deg,_#f8fbff,_#eef2f8)]">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-700 shadow-[0_8px_24px_rgba(34,35,63,0.08)]">
              <MoveDiagonal size={16} className="text-brand-600" />
              Map preview unlocks with Mapbox
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-600 shadow-[0_10px_30px_rgba(34,35,63,0.18)]">
            <MapPin size={22} />
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">Confirmed pin</p>
            <p className="mt-1 text-sm font-semibold text-ink-900">{address || 'Move or search for a location'}</p>
          </div>
          {source ? (
            <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700">
              {source}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2 rounded-[20px] bg-slate-50 px-3 py-3 text-xs text-ink-500">
          <Navigation size={14} className="shrink-0 text-brand-600" />
          <span>
            Lat {formatCoordinate(lat)} | Lng {formatCoordinate(lng)}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default LocationMapPreview
