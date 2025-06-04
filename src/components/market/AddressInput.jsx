// src/components/market/AddressInput.jsx - Google Places Integration
import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, CheckCircle } from 'lucide-react'

export default function AddressInput({ 
  address, 
  suburb, 
  state, 
  postcode, 
  latitude, 
  longitude,
  onAddressChange 
}) {
  const [inputValue, setInputValue] = useState(address || '')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [isManualEntry, setIsManualEntry] = useState(false)
  const [addressComponents, setAddressComponents] = useState({
    address: address || '',
    suburb: suburb || '',
    state: state || 'SA',
    postcode: postcode || '',
    latitude: latitude || null,
    longitude: longitude || null
  })

  const inputRef = useRef(null)
  const autocompleteService = useRef(null)
  const placesService = useRef(null)

  useEffect(() => {
    // Initialize Google Places API
    if (window.google && window.google.maps) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      )
    }
  }, [])

  useEffect(() => {
    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
        placesService.current = new window.google.maps.places.PlacesService(
          document.createElement('div')
        )
      }
      document.head.appendChild(script)
    }
  }, [])

  const searchPlaces = async (query) => {
    if (!autocompleteService.current || query.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    
    const request = {
      input: query,
      componentRestrictions: { country: 'AU' },
      types: ['address', 'establishment'],
      fields: ['place_id', 'formatted_address', 'geometry', 'address_components']
    }

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setLoading(false)
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions.slice(0, 5))
      } else {
        setSuggestions([])
      }
    })
  }

  const selectPlace = (placeId) => {
    if (!placesService.current) return

    const request = {
      placeId: placeId,
      fields: ['formatted_address', 'geometry', 'address_components']
    }

    placesService.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        parseGooglePlace(place)
        setSuggestions([])
      }
    })
  }

  const parseGooglePlace = (place) => {
    const components = place.address_components
    let parsedAddress = {
      address: '',
      suburb: '',
      state: 'SA',
      postcode: '',
      latitude: place.geometry?.location?.lat() || null,
      longitude: place.geometry?.location?.lng() || null
    }

    // Extract street number and route for address
    const streetNumber = components.find(c => c.types.includes('street_number'))?.long_name || ''
    const route = components.find(c => c.types.includes('route'))?.long_name || ''
    parsedAddress.address = `${streetNumber} ${route}`.trim()

    // Extract suburb
    const locality = components.find(c => 
      c.types.includes('locality') || 
      c.types.includes('sublocality') ||
      c.types.includes('administrative_area_level_2')
    )
    parsedAddress.suburb = locality?.long_name || ''

    // Extract state
    const stateComponent = components.find(c => c.types.includes('administrative_area_level_1'))
    if (stateComponent) {
      const stateName = stateComponent.short_name
      const stateMap = {
        'NSW': 'NSW', 'VIC': 'VIC', 'QLD': 'QLD', 'SA': 'SA',
        'WA': 'WA', 'TAS': 'TAS', 'NT': 'NT', 'ACT': 'ACT'
      }
      parsedAddress.state = stateMap[stateName] || 'SA'
    }

    // Extract postcode
    const postcodeComponent = components.find(c => c.types.includes('postal_code'))
    parsedAddress.postcode = postcodeComponent?.long_name || ''

    setAddressComponents(parsedAddress)
    setInputValue(place.formatted_address)
    onAddressChange(parsedAddress)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    
    if (!isManualEntry) {
      searchPlaces(value)
    }
  }

  const handleManualEntry = () => {
    setIsManualEntry(true)
    setSuggestions([])
    setInputValue('')
  }

  const handleManualChange = (field, value) => {
    const updated = { ...addressComponents, [field]: value }
    setAddressComponents(updated)
    onAddressChange(updated)
  }

  const validateAustralianPostcode = (postcode) => {
    return /^[0-9]{4}$/.test(postcode)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Market Address *
        </label>
        <button
          type="button"
          onClick={handleManualEntry}
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          Enter manually
        </button>
      </div>

      {!isManualEntry ? (
        /* Google Places Autocomplete */
        <div className="relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Start typing the market address..."
              className="input-field pl-10 pr-10"
              autoComplete="off"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              </div>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => selectPlace(suggestion.place_id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {suggestion.structured_formatting?.main_text}
                      </div>
                      <div className="text-xs text-gray-500">
                        {suggestion.structured_formatting?.secondary_text}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Address Confirmation */}
          {addressComponents.address && !loading && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-green-800">Address confirmed:</div>
                  <div className="text-green-700">
                    {addressComponents.address}<br />
                    {addressComponents.suburb}, {addressComponents.state} {addressComponents.postcode}
                  </div>
                  {addressComponents.latitude && (
                    <div className="text-xs text-green-600 mt-1">
                      Coordinates: {addressComponents.latitude.toFixed(6)}, {addressComponents.longitude.toFixed(6)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Manual Entry Form */
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Manual Address Entry</h4>
            <button
              type="button"
              onClick={() => setIsManualEntry(false)}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Use address lookup
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={addressComponents.address}
                onChange={(e) => handleManualChange('address', e.target.value)}
                placeholder="123 Market Street"
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suburb *
                </label>
                <input
                  type="text"
                  value={addressComponents.suburb}
                  onChange={(e) => handleManualChange('suburb', e.target.value)}
                  placeholder="Adelaide"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  value={addressComponents.state}
                  onChange={(e) => handleManualChange('state', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="SA">South Australia</option>
                  <option value="VIC">Victoria</option>
                  <option value="NSW">New South Wales</option>
                  <option value="QLD">Queensland</option>
                  <option value="WA">Western Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="NT">Northern Territory</option>
                  <option value="ACT">ACT</option>
                </select>
              </div>
            </div>

            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode *
              </label>
              <input
                type="text"
                value={addressComponents.postcode}
                onChange={(e) => handleManualChange('postcode', e.target.value)}
                placeholder="5000"
                pattern="[0-9]{4}"
                maxLength="4"
                className={`input-field ${
                  addressComponents.postcode && !validateAustralianPostcode(addressComponents.postcode)
                    ? 'border-red-300'
                    : ''
                }`}
                required
              />
              {addressComponents.postcode && !validateAustralianPostcode(addressComponents.postcode) && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid 4-digit Australian postcode</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}