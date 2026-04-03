const NAIROBI_CENTER = {
  lng: 36.8219,
  lat: -1.2921,
}

function createSearchParams(accessToken, extra = {}) {
  return new URLSearchParams({
    access_token: accessToken,
    country: 'KE',
    language: 'en',
    limit: '7',
    proximity: `${NAIROBI_CENTER.lng},${NAIROBI_CENTER.lat}`,
    ...extra,
  })
}

async function readMapboxResponse(response) {
  if (!response.ok) {
    let errorMessage = `Mapbox error: ${response.status}`

    try {
      const data = await response.json()
      errorMessage = data.message ? `Mapbox error: ${response.status} - ${data.message}` : errorMessage
    } catch {
      // We keep the status message when Mapbox returns a non-JSON error body.
    }

    throw new Error(errorMessage)
  }

  const data = await response.json()

  if (data.message) {
    throw new Error(data.message)
  }

  return data
}

export async function searchMapboxLocations(query, accessToken) {
  const params = createSearchParams(accessToken, {
    // Keep results practical for laundry pickup instead of broad POI/category matches.
    types: 'address,street,neighborhood,locality,place',
    autocomplete: 'true',
  })

  const response = await fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&${params}`
  )

  const data = await readMapboxResponse(response)

  return {
    sessionToken: '',
    suggestions: (data.features ?? []).map((feature) => {
      const coordinates = getFeatureCoordinates(feature)

      return {
        id: feature.id,
        name: getFeatureLabel(feature),
        fullAddress: getFeatureAddress(feature),
        lat: coordinates.lat,
        lng: coordinates.lng,
      }
    }),
  }
}

export async function retrieveMapboxSuggestion(result) {
  return {
    address: result.fullAddress,
    lat: result.lat,
    lng: result.lng,
  }
}

export async function reverseGeocodeMapbox(lat, lng, accessToken) {
  const params = createSearchParams(accessToken, {
    limit: '1',
    types: 'address,street,neighborhood,locality,place',
  })

  const response = await fetch(
    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&${params}`
  )

  const data = await readMapboxResponse(response)
  return data.features?.[0] ?? null
}

export function getFeatureLabel(feature) {
  return (
    feature.properties?.name_preferred ||
    feature.properties?.name ||
    feature.text ||
    feature.place_name?.split(',')[0] ||
    'Selected address'
  )
}

export function getFeatureAddress(feature) {
  return (
    feature.properties?.full_address ||
    feature.place_name ||
    feature.properties?.place_formatted ||
    getFeatureLabel(feature)
  )
}

export function getFeatureCoordinates(feature) {
  const coordinates = feature.properties?.coordinates
  const geometryCoordinates = feature.geometry?.coordinates

  return {
    lng: coordinates?.longitude ?? geometryCoordinates?.[0] ?? feature.center?.[0] ?? null,
    lat: coordinates?.latitude ?? geometryCoordinates?.[1] ?? feature.center?.[1] ?? null,
  }
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

export function sortSearchResults(features) {
  return [...features].sort((left, right) => rankFeature(left) - rankFeature(right))
}

export function createStaticMapUrl(lat, lng, accessToken) {
  if (!accessToken || typeof lat !== 'number' || typeof lng !== 'number') {
    return ''
  }

  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+2b78ff(${lng},${lat})/${lng},${lat},14,0/640x280?access_token=${accessToken}`
}
