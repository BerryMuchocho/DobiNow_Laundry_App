import { SERVICE_AREA_CONFIG } from '../config/location'

function toRadians(value) {
  return (value * Math.PI) / 180
}

export function calculateDistanceKm(start, end) {
  const earthRadiusKm = 6371
  const deltaLat = toRadians(end.lat - start.lat)
  const deltaLng = toRadians(end.lng - start.lng)
  const startLat = toRadians(start.lat)
  const endLat = toRadians(end.lat)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

export function validateServiceArea(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return {
      isEligible: false,
      message: 'Choose a pin on the map before continuing.',
      distanceKm: null,
    }
  }

  const distanceKm = calculateDistanceKm(SERVICE_AREA_CONFIG.center, { lat, lng })
  const isEligible = distanceKm <= SERVICE_AREA_CONFIG.radiusKm

  return {
    isEligible,
    distanceKm,
    message: isEligible
      ? `This pin is inside our ${SERVICE_AREA_CONFIG.label} service area.`
      : `This pin is outside our ${SERVICE_AREA_CONFIG.label} service area.`,
  }
}
