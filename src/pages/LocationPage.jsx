import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, ArrowRight, CheckCircle2, Crosshair, LoaderCircle, MapPin, Navigation, Search, Store } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AvailabilityCard from '../components/location/AvailabilityCard'
import LocationMapPreview from '../components/location/LocationMapPreview'
import SavedPlaceCard from '../components/location/SavedPlaceCard'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import SectionHeader from '../components/ui/SectionHeader'
import { DOBINOW_LAUNDRY_MART } from '../config/location'
import { savedPlaces } from '../data/places'
import { useBookingStore } from '../store/bookingStore'
import {
  createGoogleAutocompleteSessionToken,
  getGoogleFeatureAddress,
  retrieveGooglePlaceSuggestion,
  reverseGeocodeGoogle,
  searchGooglePlaces,
} from '../utils/googlePlacesLocation'
import {
  getFeatureAddress,
  reverseGeocodeMapbox,
  retrieveMapboxSuggestion,
  searchMapboxLocations,
  sortSearchResults,
} from '../utils/mapboxLocation'
import { validateServiceArea } from '../utils/serviceArea'

const LAUNDRY_MART_COLLECTION_INSTRUCTIONS = 'Collect from the front desk inside DobiNow Laundry Mart.'

function createEmptyDraft(existingLocation) {
  return {
    address: existingLocation?.address ?? '',
    lat: existingLocation?.lat ?? null,
    lng: existingLocation?.lng ?? null,
    instructions: existingLocation?.instructions ?? '',
    isConfirmed: existingLocation?.isConfirmed ?? false,
    source: existingLocation?.source ?? '',
  }
}

function getSuggestionLabel(suggestion) {
  return suggestion.name || 'Suggested address'
}

function getSuggestionAddress(suggestion) {
  return suggestion.fullAddress || getSuggestionLabel(suggestion)
}

function getLaundryMartLabel(type) {
  return type === 'pickup'
    ? 'I will drop off at DobiNow Laundry Mart'
    : 'I will collect from DobiNow Laundry Mart'
}

function getStepStatus(type, location, validation) {
  if (!location.address && typeof location.lat !== 'number') {
    return {
      tone: 'idle',
      message:
        type === 'pickup'
          ? 'Search, use your current location, or choose to drop off at DobiNow Laundry Mart.'
          : 'Search a return location or choose to collect from DobiNow Laundry Mart.',
    }
  }

  if (!location.isConfirmed) {
    return {
      tone: 'warning',
      message: 'Review the pin preview and confirm it before continuing.',
    }
  }

  if (!validation.isEligible) {
    return {
      tone: 'danger',
      message: validation.message,
    }
  }

  return {
    tone: 'success',
    message: 'Location confirmed and inside the service area.',
  }
}

function StatusMessage({ tone, message }) {
  const styles = {
    idle: 'bg-slate-100 text-ink-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-600',
    success: 'bg-emerald-50 text-emerald-700',
  }

  return (
    <div className={['rounded-[20px] px-4 py-3 text-sm font-medium', styles[tone] ?? styles.idle].join(' ')}>
      {message}
    </div>
  )
}

function SectionToggle({ active, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex-1 rounded-[22px] border px-4 py-3 text-left transition-all',
        active ? 'border-brand-500 bg-brand-50' : 'border-line bg-white',
      ].join(' ')}
    >
      <p className="text-sm font-extrabold text-ink-900">{title}</p>
      <p className="mt-1 text-xs leading-5 text-ink-500">{description}</p>
    </button>
  )
}

function LocationSection({
  type,
  title,
  subtitle,
  draft,
  searchQuery,
  onSearchChange,
  results,
  isSearching,
  searchError,
  actionError,
  permissionStatus,
  validation,
  onSelectResult,
  onUseCurrentLocation,
  onUseLaundryMart,
  onSelectSavedPlace,
  onInstructionsChange,
  onConfirm,
}) {
  const stepStatus = getStepStatus(type, draft, validation)
  const savedPlaceOptions = useMemo(() => savedPlaces.slice(0, 3), [])
  const showPermissionFallback = permissionStatus === 'denied' || Boolean(actionError)

  return (
    <Card className="space-y-4 rounded-[30px] bg-white">
      <div className="space-y-1">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-600">{title}</p>
        <h2 className="text-xl font-extrabold text-ink-900">{subtitle}</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button fullWidth variant="secondary" className="gap-2" onClick={onUseCurrentLocation}>
          <Navigation size={16} />
          Use my current location
        </Button>
        <Button fullWidth variant="outline" className="gap-2" onClick={onUseLaundryMart}>
          <Store size={16} />
          {getLaundryMartLabel(type)}
        </Button>
      </div>

      <div className="space-y-2">
        <Input
          icon={Search}
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={`Search ${type === 'pickup' ? 'pickup' : 'drop-off'} address or landmark`}
        />
        <p className="text-xs leading-5 text-ink-500">
          Search fills the pin preview. We only save this location after you confirm the map pin.
        </p>
        {searchError ? <p className="text-xs leading-5 text-red-500">{searchError}</p> : null}
        {actionError ? <p className="text-xs leading-5 text-red-500">{actionError}</p> : null}
      </div>

      {results.length || isSearching ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">Search results</p>
            {isSearching ? (
              <span className="text-xs font-medium text-ink-500">Updating...</span>
            ) : null}
          </div>
          {results.length ? (
            results.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => onSelectResult(suggestion)}
                className="flex w-full items-start gap-3 rounded-[22px] border border-line bg-slate-50 px-4 py-3 text-left transition-all hover:border-brand-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-900">{getSuggestionLabel(suggestion)}</p>
                  <p className="mt-1 text-xs leading-5 text-ink-500">{getSuggestionAddress(suggestion)}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-[20px] bg-slate-50 px-4 py-4 text-sm text-ink-500">
              Searching locations...
            </div>
          )}
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">Quick pinned places</p>
        {savedPlaceOptions.map((place) => (
          <SavedPlaceCard
            key={`${type}-${place.id}`}
            place={place}
            selected={draft.address === place.address && draft.source === 'manual-pin'}
            onSelect={() => onSelectSavedPlace(place)}
          />
        ))}
      </div>

      <LocationMapPreview
        address={draft.address}
        lat={draft.lat}
        lng={draft.lng}
        source={draft.source}
      />

      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">
          Extra location instructions
        </span>
        <textarea
          value={draft.instructions}
          onChange={(event) => onInstructionsChange(event.target.value)}
          rows={3}
          placeholder="Gate color, floor, landmark, or call-on-arrival notes"
          className="w-full rounded-[22px] border border-line bg-surface-soft px-4 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-500 focus:border-brand-300"
        />
      </label>

      <StatusMessage tone={stepStatus.tone} message={stepStatus.message} />

      {validation.distanceKm ? (
        <p className="text-xs leading-5 text-ink-500">
          Approximate distance from our service hub: {validation.distanceKm.toFixed(1)} km
        </p>
      ) : null}

      {showPermissionFallback ? (
        <div className="rounded-[22px] bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Fallback options are ready.</p>
              <p className="mt-1">
                {type === 'pickup'
                  ? 'Search manually or choose to drop off at DobiNow Laundry Mart if browser location is unavailable.'
                  : 'Search manually or choose to collect from DobiNow Laundry Mart if browser location is unavailable.'}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!validation.isEligible && draft.address && draft.isConfirmed ? (
        <div className="rounded-[22px] bg-red-50 px-4 py-4 text-sm leading-6 text-red-600">
          {type === 'pickup'
            ? 'This pin is outside the current service area. Choose another nearby address or plan to drop off at DobiNow Laundry Mart.'
            : 'This pin is outside the current service area. Choose another nearby address or collect from DobiNow Laundry Mart.'}
        </div>
      ) : null}

      <Button
        fullWidth
        className="gap-2"
        onClick={onConfirm}
        disabled={!draft.address || typeof draft.lat !== 'number' || typeof draft.lng !== 'number'}
      >
        {draft.isConfirmed ? <CheckCircle2 size={16} /> : <Crosshair size={16} />}
        {draft.isConfirmed ? 'Pin confirmed' : 'Confirm this pin'}
      </Button>
    </Card>
  )
}

function LocationPage() {
  const navigate = useNavigate()
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || ''
  const rawMapboxAccessToken =
    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN?.trim() || import.meta.env.VITE_MAPBOX_TOKEN?.trim()
  const mapboxAccessToken =
    rawMapboxAccessToken && !rawMapboxAccessToken.includes('your_mapbox_access_token_here')
      ? rawMapboxAccessToken
      : ''
  const locationProvider = googleMapsApiKey ? 'google' : mapboxAccessToken ? 'mapbox' : 'none'
  const isLocationSearchConfigured = locationProvider !== 'none'

  const orderFlow = useBookingStore((state) => state.orderFlow)
  const serviceArea = useBookingStore((state) => state.serviceArea)
  const locationLoading = useBookingStore((state) => state.locationLoading)
  const locationError = useBookingStore((state) => state.locationError)
  const locationPermissionStatus = useBookingStore((state) => state.locationPermissionStatus)
  const saveLocation = useBookingStore((state) => state.saveLocation)
  const setReturnToPickup = useBookingStore((state) => state.setReturnToPickup)
  const setLocationLoading = useBookingStore((state) => state.setLocationLoading)
  const setLocationError = useBookingStore((state) => state.setLocationError)
  const setLocationPermissionStatus = useBookingStore((state) => state.setLocationPermissionStatus)

  const [searchQueryByType, setSearchQueryByType] = useState({
    pickup: '',
    dropoff: '',
  })
  const [searchResultsByType, setSearchResultsByType] = useState({
    pickup: [],
    dropoff: [],
  })
  const [draftByType, setDraftByType] = useState({
    pickup: createEmptyDraft(orderFlow.pickup),
    dropoff: createEmptyDraft(orderFlow.returnToPickup ? orderFlow.pickup : orderFlow.dropoff),
  })
  const isAnyLocationActionLoading =
    locationLoading.pickup.currentLocation ||
    locationLoading.pickup.reverseGeocode ||
    locationLoading.dropoff.currentLocation ||
    locationLoading.dropoff.reverseGeocode

  const debounceRefs = useRef({
    pickup: null,
    dropoff: null,
  })
  const activeSearchRequestIds = useRef({
    pickup: 0,
    dropoff: 0,
  })
  const googleSessionTokens = useRef({
    pickup: null,
    dropoff: null,
  })

  useEffect(() => {
    setDraftByType((previous) => ({
      pickup: orderFlow.pickup.isConfirmed ? createEmptyDraft(orderFlow.pickup) : previous.pickup,
      dropoff:
        orderFlow.returnToPickup
          ? createEmptyDraft(orderFlow.pickup)
          : orderFlow.dropoff.isConfirmed
            ? createEmptyDraft(orderFlow.dropoff)
            : previous.dropoff,
    }))
  }, [orderFlow.dropoff, orderFlow.pickup, orderFlow.returnToPickup])

  useEffect(() => {
    const debounceRefValues = debounceRefs.current

    return () => {
      clearTimeout(debounceRefValues.pickup)
      clearTimeout(debounceRefValues.dropoff)
    }
  }, [])

  useEffect(() => {
    const locationTypes = orderFlow.returnToPickup ? ['pickup'] : ['pickup', 'dropoff']

    locationTypes.forEach((type) => {
      const query = searchQueryByType[type].trim()
      clearTimeout(debounceRefs.current[type])

      if (!isLocationSearchConfigured || query.length < 3) {
        activeSearchRequestIds.current[type] += 1
        setSearchResultsByType((previous) => ({
          ...previous,
          [type]: [],
        }))
        setLocationLoading(type, 'search', false)
        return
      }

      debounceRefs.current[type] = setTimeout(async () => {
        const requestId = activeSearchRequestIds.current[type] + 1
        activeSearchRequestIds.current[type] = requestId

        try {
          setLocationLoading(type, 'search', true)
          let suggestions = []

          if (locationProvider === 'google') {
            if (!googleSessionTokens.current[type]) {
              googleSessionTokens.current[type] = await createGoogleAutocompleteSessionToken(
                googleMapsApiKey
              )
            }

            const response = await searchGooglePlaces(
              query,
              googleMapsApiKey,
              googleSessionTokens.current[type]
            )
            suggestions = response.suggestions
          } else {
            const response = await searchMapboxLocations(query, mapboxAccessToken)
            suggestions = response.suggestions
          }

          if (activeSearchRequestIds.current[type] !== requestId) {
            return
          }

          setSearchResultsByType((previous) => ({
            ...previous,
            [type]: sortSearchResults(suggestions),
          }))
          setLocationError(type, 'search', '')
        } catch (error) {
          if (activeSearchRequestIds.current[type] !== requestId) {
            return
          }

          setSearchResultsByType((previous) => ({
            ...previous,
            [type]: [],
          }))
          setLocationError(
            type,
            'search',
            error instanceof Error ? error.message : 'Could not load location suggestions.'
          )
        } finally {
          if (activeSearchRequestIds.current[type] === requestId) {
            setLocationLoading(type, 'search', false)
          }
        }
      }, 250)
    })
  }, [
    googleMapsApiKey,
    isLocationSearchConfigured,
    locationProvider,
    mapboxAccessToken,
    orderFlow.returnToPickup,
    searchQueryByType,
    setLocationError,
    setLocationLoading,
  ])

  const canContinue =
    orderFlow.pickup.isConfirmed &&
    serviceArea.pickup.isEligible &&
    (orderFlow.returnToPickup || (orderFlow.dropoff.isConfirmed && serviceArea.dropoff.isEligible))

  function updateDraft(type, updater) {
    setDraftByType((previous) => ({
      ...previous,
      [type]:
        typeof updater === 'function'
          ? updater(previous[type])
          : {
              ...previous[type],
              ...updater,
            },
    }))
  }

  function resetSearch(type) {
    setSearchQueryByType((previous) => ({
      ...previous,
      [type]: '',
    }))
    setSearchResultsByType((previous) => ({
      ...previous,
      [type]: [],
    }))
    googleSessionTokens.current[type] = null
  }

  function applyPendingLocation(type, nextLocation) {
    updateDraft(type, {
      ...nextLocation,
      isConfirmed: false,
    })
    setLocationError(type, 'currentLocation', '')
    setLocationError(type, 'reverseGeocode', '')
  }

  async function handleSelectResult(type, suggestion) {
    try {
      setLocationLoading(type, 'search', true)
      const retrievedFeature =
        locationProvider === 'google'
          ? await retrieveGooglePlaceSuggestion(suggestion)
          : await retrieveMapboxSuggestion(suggestion, mapboxAccessToken)

      if (!retrievedFeature) {
        throw new Error('Could not retrieve the selected location result.')
      }

      applyPendingLocation(type, {
        address: retrievedFeature.address,
        lat: retrievedFeature.lat,
        lng: retrievedFeature.lng,
        instructions: draftByType[type].instructions,
        source: 'search',
      })
      resetSearch(type)
    } catch (error) {
      setLocationError(
        type,
        'search',
        error instanceof Error ? error.message : 'Could not load the selected location result.'
      )
    } finally {
      setLocationLoading(type, 'search', false)
    }
  }

  function handleSelectSavedPlace(type, place) {
    applyPendingLocation(type, {
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      instructions: draftByType[type].instructions || place.instructions || '',
      source: 'manual-pin',
    })
  }

  function handleUseLaundryMart(type) {
    const nextLocation = {
      ...DOBINOW_LAUNDRY_MART,
      instructions:
        draftByType[type].instructions ||
        (type === 'pickup' ? DOBINOW_LAUNDRY_MART.instructions : LAUNDRY_MART_COLLECTION_INSTRUCTIONS),
      isConfirmed: true,
    }

    updateDraft(type, nextLocation)
    if (type === 'dropoff') {
      setReturnToPickup(false)
    }
    saveLocation(type, nextLocation)
    resetSearch(type)

    if (type === 'dropoff' && orderFlow.pickup.isConfirmed) {
      navigate('/schedule')
    }
  }

  async function handleUseCurrentLocation(type) {
    if (!navigator.geolocation) {
      setLocationPermissionStatus('unsupported')
      setLocationError(type, 'currentLocation', 'This browser does not support location access.')
      return
    }

    setLocationLoading(type, 'currentLocation', true)
    setLocationError(type, 'currentLocation', '')
    setLocationPermissionStatus('pending')

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const nextLocation = {
            address: 'Current location pin',
            lat: coords.latitude,
            lng: coords.longitude,
            instructions: draftByType[type].instructions,
            source: 'current-location',
          }

          if (locationProvider === 'google') {
            setLocationLoading(type, 'reverseGeocode', true)
            const feature = await reverseGeocodeGoogle(
              coords.latitude,
              coords.longitude,
              googleMapsApiKey
            )

            if (feature) {
              nextLocation.address = getGoogleFeatureAddress(feature)
            }
          } else if (mapboxAccessToken) {
            setLocationLoading(type, 'reverseGeocode', true)
            const feature = await reverseGeocodeMapbox(
              coords.latitude,
              coords.longitude,
              mapboxAccessToken
            )

            if (feature) {
              nextLocation.address = getFeatureAddress(feature)
            }
          }

          applyPendingLocation(type, nextLocation)
          setLocationPermissionStatus('granted')
          resetSearch(type)
        } catch (error) {
          setLocationError(
            type,
            'reverseGeocode',
            error instanceof Error ? error.message : 'Could not read the address for this pin.'
          )
          applyPendingLocation(type, {
            address: 'Current location pin',
            lat: coords.latitude,
            lng: coords.longitude,
            instructions: draftByType[type].instructions,
            source: 'current-location',
          })
        } finally {
          setLocationLoading(type, 'currentLocation', false)
          setLocationLoading(type, 'reverseGeocode', false)
        }
      },
      (error) => {
        setLocationLoading(type, 'currentLocation', false)
        setLocationPermissionStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'error')
        setLocationError(
          type,
          'currentLocation',
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied.'
            : 'We could not read your current location.'
        )
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function handleConfirm(type) {
    const draft = draftByType[type]
    const validation = validateServiceArea(draft.lat, draft.lng)
    const nextLocation = {
      ...draft,
      isConfirmed: true,
    }

    updateDraft(type, nextLocation)
    saveLocation(type, nextLocation)

    if (!validation.isEligible && nextLocation.source !== 'laundry-mart') {
      setLocationError(
        type,
        'currentLocation',
        'That confirmed pin is outside the service area. Choose another location or use DobiNow Laundry Mart.'
      )
      return
    }

    setLocationError(type, 'currentLocation', '')

    if (type === 'dropoff' && validation.isEligible) {
      setReturnToPickup(false)
      navigate('/schedule')
    }
  }

  function renderLocationSection(type) {
    const draft = draftByType[type]
    const validation = validateServiceArea(draft.lat, draft.lng)

    return (
      <LocationSection
        type={type}
        title={type === 'pickup' ? 'Step 1' : 'Step 2'}
        subtitle={type === 'pickup' ? 'Set your pickup location' : 'Set your return location'}
        draft={draft}
        searchQuery={searchQueryByType[type]}
        onSearchChange={(value) =>
          setSearchQueryByType((previous) => ({
            ...previous,
            [type]: value,
          }))
        }
        results={searchResultsByType[type]}
        isSearching={locationLoading[type].search}
        searchError={locationError[type].search}
        actionError={[locationError[type].currentLocation, locationError[type].reverseGeocode].filter(Boolean).join(' ')}
        permissionStatus={locationPermissionStatus}
        validation={validation}
        onSelectResult={(feature) => handleSelectResult(type, feature)}
        onUseCurrentLocation={() => handleUseCurrentLocation(type)}
        onUseLaundryMart={() => handleUseLaundryMart(type)}
        onSelectSavedPlace={(place) => handleSelectSavedPlace(type, place)}
        onInstructionsChange={(instructions) =>
          updateDraft(type, (previous) => ({
            ...previous,
            instructions,
            isConfirmed: false,
          }))
        }
        onConfirm={() => handleConfirm(type)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-600">
          <MapPin size={18} />
          <span className="text-lg font-bold">DobiNow</span>
        </div>
        {isAnyLocationActionLoading ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-ink-700">
            <LoaderCircle size={14} className="animate-spin text-brand-600" />
            Locating
          </span>
        ) : null}
      </header>

      <SectionHeader
        eyebrow="Booking flow"
        title="Choose your start and return locations."
        subtitle="Set where the order starts, then choose where the clean laundry should go after cleaning."
      />

      {!isLocationSearchConfigured ? (
        <Card className="rounded-[26px] bg-amber-50 text-amber-800">
          <p className="text-sm font-bold">Location search is not configured.</p>
          <p className="mt-2 text-sm leading-6">
            Add `VITE_GOOGLE_MAPS_API_KEY` to enable Google Places search, or keep
            `VITE_MAPBOX_ACCESS_TOKEN` as a fallback.
          </p>
        </Card>
      ) : locationProvider === 'google' ? (
        <Card className="rounded-[26px] bg-emerald-50 text-emerald-800">
          <p className="text-sm font-bold">Google Places search is active.</p>
          <p className="mt-2 text-sm leading-6">
            Search suggestions and current-location address lookup are now powered by Google.
          </p>
        </Card>
      ) : null}

      <AvailabilityCard />

      {renderLocationSection('pickup')}

      <Card className="space-y-4 rounded-[30px] bg-white">
        <div className="space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-600">After cleaning</p>
          <h2 className="text-xl font-extrabold text-ink-900">Where should the clean laundry go?</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SectionToggle
            active={orderFlow.returnToPickup}
            title={orderFlow.pickup.source === 'laundry-mart' ? 'Collect from DobiNow Laundry Mart' : 'Return to starting location'}
            description={
              orderFlow.pickup.source === 'laundry-mart'
                ? 'Use DobiNow Laundry Mart as the collection point after cleaning.'
                : 'Send the clean laundry back to the same confirmed address.'
            }
            onClick={() => {
              setReturnToPickup(true)

              if (orderFlow.pickup.isConfirmed && serviceArea.pickup.isEligible) {
                navigate('/schedule')
              }
            }}
          />
          <SectionToggle
            active={!orderFlow.returnToPickup}
            title="Choose another return point"
            description="Set a different address for delivery or choose collection at the mart."
            onClick={() => setReturnToPickup(false)}
          />
        </div>

        {orderFlow.returnToPickup ? (
          <div className="rounded-[22px] bg-brand-50 px-4 py-4 text-sm leading-6 text-brand-700">
            {orderFlow.pickup.source === 'laundry-mart'
              ? 'Your order will be ready for collection at DobiNow Laundry Mart after cleaning, with no delivery charge.'
              : 'Your clean laundry will return to the same confirmed starting address after cleaning.'}
          </div>
        ) : (
          renderLocationSection('dropoff')
        )}
      </Card>

      {locationPermissionStatus === 'denied' ? (
        <Card className="rounded-[26px] bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 text-amber-700" />
            <div className="text-sm leading-6 text-amber-800">
              <p className="font-bold">Location permission denied</p>
              <p className="mt-1">
                Search manually or switch to dropping off at DobiNow Laundry Mart. You can still complete the
                booking without browser location access.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="sticky-action">
        <div className="mb-3 space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-ink-500">Start location</span>
            <span className="text-right font-bold text-ink-900">
              {orderFlow.pickup.isConfirmed ? 'Confirmed' : 'Needs confirmation'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-ink-500">Return location</span>
            <span className="text-right font-bold text-ink-900">
              {orderFlow.returnToPickup || orderFlow.dropoff.isConfirmed ? 'Confirmed' : 'Needs confirmation'}
            </span>
          </div>
          {!canContinue ? (
            <p className="text-xs leading-5 text-red-500">
              Confirm both the starting location and the return location before continuing to scheduling.
            </p>
          ) : null}
        </div>
        <Button
          fullWidth
          onClick={() => navigate('/schedule')}
          disabled={!canContinue}
        >
          <span className="flex items-center gap-2">
            Continue to scheduling
            <ArrowRight size={16} />
          </span>
        </Button>
      </div>
    </div>
  )
}

export default LocationPage
