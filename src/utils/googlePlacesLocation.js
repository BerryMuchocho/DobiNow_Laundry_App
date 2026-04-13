import { loadGoogleMapsLibrary, loadGooglePlacesLibrary } from './loadGooglePlacesLibrary'

const NAIROBI_CENTER = {
  lat: -1.2921,
  lng: 36.8219,
}

function safeText(value, fallback = '') {
  if (!value) return fallback
  if (typeof value === 'string') return value
  if (typeof value.text === 'string') return value.text
  if (typeof value.toString === 'function') return value.toString()
  return fallback
}

function getPredictionTexts(prediction) {
  const primaryText =
    safeText(prediction?.mainText) ||
    safeText(prediction?.text) ||
    safeText(prediction?.structuredFormat?.mainText)
  const secondaryText =
    safeText(prediction?.secondaryText) || safeText(prediction?.structuredFormat?.secondaryText)
  const fullText = safeText(prediction?.text) || [primaryText, secondaryText].filter(Boolean).join(', ')

  return {
    primaryText: primaryText || fullText || 'Suggested address',
    fullText: fullText || primaryText || 'Suggested address',
  }
}

export async function createGoogleAutocompleteSessionToken(apiKey) {
  await loadGooglePlacesLibrary(apiKey)
  return new window.google.maps.places.AutocompleteSessionToken()
}

export async function searchGooglePlaces(query, apiKey, sessionToken) {
  const placesLibrary = await loadGooglePlacesLibrary(apiKey)
  const request = {
    input: query,
    includedRegionCodes: ['ke'],
    origin: NAIROBI_CENTER,
    sessionToken,
  }

  const response = await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
  const suggestions = response?.suggestions ?? []

  return {
    suggestions: suggestions.map((suggestion, index) => {
      const prediction = suggestion.placePrediction ?? suggestion
      const { primaryText, fullText } = getPredictionTexts(prediction)

      return {
        id: prediction?.placeId ?? `${fullText}-${index}`,
        name: primaryText,
        fullAddress: fullText,
        placePrediction: prediction,
      }
    }),
  }
}

export async function retrieveGooglePlaceSuggestion(suggestion) {
  const place = suggestion.placePrediction?.toPlace?.()

  if (!place) {
    throw new Error('Could not load the selected Google place.')
  }

  await place.fetchFields({
    fields: ['displayName', 'formattedAddress', 'location'],
  })

  const lat = place.location?.lat?.()
  const lng = place.location?.lng?.()

  return {
    address: place.formattedAddress || place.displayName || suggestion.fullAddress,
    lat: typeof lat === 'number' ? lat : null,
    lng: typeof lng === 'number' ? lng : null,
  }
}

export async function reverseGeocodeGoogle(lat, lng, apiKey) {
  const geocodingLibrary = await loadGoogleMapsLibrary('geocoding', apiKey)
  const geocoder = new geocodingLibrary.Geocoder()
  const response = await geocoder.geocode({
    location: { lat, lng },
    region: 'KE',
  })

  return response.results?.[0] ?? null
}

export function getGoogleFeatureAddress(feature) {
  return feature?.formatted_address || feature?.formattedAddress || feature?.displayName || 'Selected address'
}
