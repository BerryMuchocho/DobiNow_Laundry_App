import { useEffect, useMemo, useRef, useState } from 'react'
import { Home, Briefcase, MapPin, Search, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '../store/bookingStore'
import { nearbyAreas, savedPlaces } from '../data/places'

const PLACE_ICONS = {
  home: Home,
  work: Briefcase,
  default: MapPin,
}

const NAIROBI_BOUNDS = {
  west: 36.65,
  south: -1.45,
  east: 37.05,
  north: -1.15,
}

const NAIROBI_CENTER = {
  lng: 36.8219,
  lat: -1.2921,
}

async function geocodeWithMapbox(query, accessToken) {
  const params = new URLSearchParams({
    access_token: accessToken,
    country: 'KE',
    language: 'en',
    limit: '7',
    // v6 supports street results, which are better for pickup accuracy.
    types: 'address,street,neighborhood,locality,place',
    proximity: `${NAIROBI_CENTER.lng},${NAIROBI_CENTER.lat}`,
  })

  const response = await fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&${params}`
  )

  if (!response.ok) {
    let errorMessage = `Mapbox error: ${response.status}`

    try {
      const errorData = await response.json()
      errorMessage = errorData.message
        ? `Mapbox error: ${response.status} - ${errorData.message}`
        : errorMessage
    } catch {
      // We keep the generic status message if the body is not valid JSON.
    }

    throw new Error(errorMessage)
  }

  const data = await response.json()

  if (data.message) {
    throw new Error(data.message)
  }

  return data.features ?? []
}

function rankFeature(feature) {
  const featureType = feature.properties?.feature_type ?? feature.place_type?.[0] ?? ''

  if (featureType === 'address') return 0
  if (featureType === 'street') return 1
  if (featureType === 'neighborhood') return 2
  if (featureType === 'locality') return 3
  if (featureType === 'place') return 4
  return 5
}

function isBroadPlaceResult(feature) {
  const featureType = feature.properties?.feature_type ?? feature.place_type?.[0] ?? ''
  return featureType === 'place'
}

function getFeatureLabel(feature) {
  return (
    feature.properties?.name_preferred ||
    feature.properties?.name ||
    feature.text ||
    feature.place_name?.split(',')[0] ||
    'Selected address'
  )
}

function getFeatureAddress(feature) {
  return (
    feature.properties?.full_address ||
    feature.place_name ||
    feature.properties?.place_formatted ||
    getFeatureLabel(feature)
  )
}

function filterAndSortFeatures(features) {
  const sortedFeatures = [...features].sort((left, right) => rankFeature(left) - rankFeature(right))
  const preciseFeatures = sortedFeatures.filter((feature) => !isBroadPlaceResult(feature))

  // We only fall back to broad place results if Mapbox returned nothing more specific.
  return preciseFeatures.length ? preciseFeatures : sortedFeatures
}

function LocationPage() {
  const navigate = useNavigate()
  const rawMapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN?.trim()
  const mapboxAccessToken =
    rawMapboxAccessToken && !rawMapboxAccessToken.includes('your_mapbox_public_token_here')
      ? rawMapboxAccessToken
      : ''

  const selectedAddress = useBookingStore((state) => state.selectedAddress)
  const setSelectedAddress = useBookingStore((state) => state.setSelectedAddress)

  const [activeArea, setActiveArea] = useState(nearbyAreas[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchError, setSearchError] = useState('')
  const [mapboxResults, setMapboxResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const debounceRef = useRef(null)
  const canContinue = Boolean(selectedAddress?.id)

  const visiblePlaces = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return savedPlaces
    }

    return savedPlaces.filter((place) =>
      `${place.label} ${place.address}`.toLowerCase().includes(normalizedQuery)
    )
  }, [searchQuery])

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    const query = searchQuery.trim()

    clearTimeout(debounceRef.current)

    if (!mapboxAccessToken || query.length < 3) {
      setMapboxResults([])
      setSearchError('')
      setIsSearching(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setIsSearching(true)
        const results = await geocodeWithMapbox(query, mapboxAccessToken)
        setMapboxResults(filterAndSortFeatures(results))
        setSearchError('')
      } catch (error) {
        setMapboxResults([])
        setSearchError(
          error instanceof Error ? error.message : 'Could not load Mapbox suggestions.'
        )
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [mapboxAccessToken, searchQuery])

  function handleSelectAddress(place) {
    setSelectedAddress(place)
    // We keep the seamless auto-continue flow that is already working well.
    navigate('/schedule')
  }

  function handleSelectFeature(feature) {
    const coordinates = feature.properties?.coordinates
    const lng = coordinates?.longitude ?? feature.center?.[0]
    const lat = coordinates?.latitude ?? feature.center?.[1]
    const label = getFeatureLabel(feature)

    setMapboxResults([])
    setSearchQuery('')
    setSearchError('')

    handleSelectAddress({
      id: feature.id,
      label,
      address: getFeatureAddress(feature),
      coordinates:
        typeof lng === 'number' && typeof lat === 'number'
          ? { longitude: lng, latitude: lat }
          : undefined,
      source: 'mapbox',
    })
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-sm bg-slate-100">
      <div className="space-y-6 overflow-y-auto px-5 pb-36 pt-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-600">
            <MapPin size={18} />
            <span className="text-lg font-bold">DobiNow</span>
          </div>
        </header>

        <h1 className="text-3xl font-bold leading-tight text-ink-900">
          Where should we pick up your{' '}
          <span className="text-brand-600">laundry?</span>
        </h1>

        <div className="space-y-2">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={mapboxAccessToken ? 'Search pickup address...' : 'Search area or estate...'}
              className="w-full rounded-full bg-slate-200 py-3 pl-10 pr-4 text-sm text-ink-500 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {!mapboxAccessToken ? (
            <p className="text-xs leading-5 text-ink-500">
              Add `VITE_MAPBOX_ACCESS_TOKEN` in the root `.env` file to enable Mapbox search.
              Saved places still work right now.
            </p>
          ) : (
            <p className="text-xs leading-5 text-ink-500">
              Search for a real pickup address, then tap a result to continue to scheduling.
            </p>
          )}

          {searchError ? <p className="text-xs leading-5 text-red-500">{searchError}</p> : null}
        </div>

        {mapboxAccessToken && searchQuery.trim().length >= 3 ? (
          <section className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-500">
              Mapbox address results
            </p>

            {isSearching ? (
              <div className="rounded-2xl bg-white p-4 text-sm text-ink-500">Searching...</div>
            ) : mapboxResults.length ? (
              mapboxResults.map((feature) => (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => handleSelectFeature(feature)}
                  className="flex w-full items-center gap-3.5 rounded-2xl border border-transparent bg-white p-3.5 text-left transition-all hover:border-brand-200"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100">
                    <MapPin size={20} className="text-brand-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {getFeatureLabel(feature)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink-500">{getFeatureAddress(feature)}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl bg-white p-4 text-sm text-ink-500">
                No Mapbox results yet. Try a fuller address like "Fedha Estate Nairobi".
              </div>
            )}
          </section>
        ) : null}

        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Nearby Areas</p>
          <div className="flex flex-wrap gap-2">
            {nearbyAreas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setActiveArea(area)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  activeArea === area
                    ? 'border border-brand-200 bg-brand-50 text-brand-700'
                    : 'border border-transparent bg-slate-200 text-ink-700',
                ].join(' ')}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Saved Places</p>

          {visiblePlaces.map((place) => {
            const Icon = PLACE_ICONS[place.type] ?? PLACE_ICONS.default
            const isSelected = selectedAddress?.id === place.id

            return (
              <button
                key={place.id}
                type="button"
                onClick={() => handleSelectAddress(place)}
                aria-pressed={isSelected}
                className={[
                  'flex w-full items-center gap-3.5 rounded-2xl p-3.5 text-left transition-all',
                  isSelected
                    ? 'border-2 border-brand-500 bg-white'
                    : 'border border-transparent bg-white hover:border-brand-200',
                ].join(' ')}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100">
                  <Icon size={20} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{place.label}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{place.address}</p>
                </div>
              </button>
            )
          })}

          {!visiblePlaces.length ? (
            <div className="rounded-2xl bg-white p-4 text-sm text-ink-500">
              No saved places match that search.
            </div>
          ) : null}
        </section>

        <div className="flex items-center gap-2.5 rounded-xl bg-green-500 px-4 py-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-white ring-2 ring-white/30" />
          <p className="text-sm font-semibold text-white">DobiNow is available in your area</p>
        </div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 z-10 px-5">
        <button
          type="button"
          onClick={() => canContinue && navigate('/schedule')}
          disabled={!canContinue}
          className={[
            'flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-semibold text-white shadow-lg transition-all',
            canContinue
              ? 'bg-brand-600 hover:bg-brand-700 active:scale-[0.98]'
              : 'cursor-not-allowed bg-brand-300',
          ].join(' ')}
        >
          Continue to Services
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default LocationPage
