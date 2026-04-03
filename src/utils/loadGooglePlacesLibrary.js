let googlePlacesPromise

export function loadGooglePlacesLibrary(apiKey) {
  if (!apiKey) {
    return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY.'))
  }

  if (window.google?.maps?.importLibrary) {
    return window.google.maps.importLibrary('places')
  }

  if (googlePlacesPromise) {
    return googlePlacesPromise
  }

  googlePlacesPromise = new Promise((resolve, reject) => {
    const callbackName = '__dobiNowGoogleMapsInit'
    const existingScript = document.querySelector('script[data-google-maps-loader="true"]')

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true })
      existingScript.addEventListener('error', handleError, { once: true })
      return
    }

    const script = document.createElement('script')
    const params = new URLSearchParams({
      key: apiKey,
      libraries: 'places',
      loading: 'async',
      v: 'weekly',
      callback: callbackName,
    })

    script.src = `https://maps.googleapis.com/maps/api/js?${params}`
    script.async = true
    script.defer = true
    script.dataset.googleMapsLoader = 'true'
    script.addEventListener('error', handleError, { once: true })

    window[callbackName] = handleLoad
    document.head.appendChild(script)

    function handleLoad() {
      delete window[callbackName]
      window.google.maps
        .importLibrary('places')
        .then(resolve)
        .catch(reject)
    }

    function handleError() {
      delete window[callbackName]
      reject(new Error('Google Maps script failed to load.'))
    }
  })

  return googlePlacesPromise
}
