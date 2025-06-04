// src/components/market/AmenitySelector.jsx
import { useState, useEffect } from 'react'
import { Check, Plus, X } from 'lucide-react'

export default function AmenitySelector({ 
  selectedAmenities = [], 
  onChange 
}) {
  const [amenityTypes, setAmenityTypes] = useState({})
  const [loading, setLoading] = useState(true)
  const [localSelected, setLocalSelected] = useState(selectedAmenities)

  useEffect(() => {
    fetchAmenityTypes()
  }, [])

  useEffect(() => {
    setLocalSelected(selectedAmenities)
  }, [selectedAmenities])

  const fetchAmenityTypes = async () => {
    try {
      setLoading(true)
      // Import marketService here to avoid circular imports
      const marketService = (await import('../../services/marketService.js')).default
      const types = await marketService.getAmenityTypes()
      setAmenityTypes(types)
    } catch (error) {
      console.error('Error fetching amenity types:', error)
      // Use fallback data if API fails
      setAmenityTypes({
        facility: [
          { id: 'toilets', name: 'Toilets', category: 'facility' },
          { id: 'parking', name: 'Parking', category: 'facility' },
          { id: 'atm', name: 'ATM', category: 'facility' },
          { id: 'food_court', name: 'Food Court', category: 'facility' },
          { id: 'seating', name: 'Seating', category: 'facility' },
          { id: 'shelter', name: 'Shelter/Cover', category: 'facility' }
        ],
        service: [
          { id: 'entertainment', name: 'Entertainment', category: 'service' },
          { id: 'security', name: 'Security', category: 'service' },
          { id: 'storage', name: 'Storage', category: 'service' },
          { id: 'loading_dock', name: 'Loading Dock', category: 'service' }
        ],
        accessibility: [
          { id: 'wheelchair_access', name: 'Wheelchair Access', category: 'accessibility' },
          { id: 'accessible_toilets', name: 'Accessible Toilets', category: 'accessibility' },
          { id: 'accessible_parking', name: 'Accessible Parking', category: 'accessibility' }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAmenityToggle = (amenityType) => {
    const isSelected = localSelected.some(a => a.amenity_type === amenityType.id)
    
    let updated
    if (isSelected) {
      // Remove amenity
      updated = localSelected.filter(a => a.amenity_type !== amenityType.id)
    } else {
      // Add amenity
      updated = [...localSelected, {
        amenity_type: amenityType.id,
        name: amenityType.name,
        category: amenityType.category,
        notes: ''
      }]
    }

    setLocalSelected(updated)
    onChange(updated)
  }

  const handleNotesChange = (amenityTypeId, notes) => {
    const updated = localSelected.map(amenity => 
      amenity.amenity_type === amenityTypeId 
        ? { ...amenity, notes }
        : amenity
    )
    setLocalSelected(updated)
    onChange(updated)
  }

  const categoryLabels = {
    facility: 'Facilities',
    service: 'Services', 
    accessibility: 'Accessibility'
  }

  const categoryIcons = {
    facility: '🏢',
    service: '🛠️',
    accessibility: '♿'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Amenities & Facilities
        </label>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amenities & Facilities
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Select the amenities and facilities available at your market
        </p>
      </div>

      {Object.entries(amenityTypes).map(([category, amenities]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="mr-2">{categoryIcons[category]}</span>
            {categoryLabels[category]}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {amenities.map((amenity) => {
              const isSelected = localSelected.some(a => a.amenity_type === amenity.id)
              
              return (
                <div key={amenity.id} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{amenity.name}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary-600" />
                      )}
                    </div>
                  </button>

                  {isSelected && (
                    <div className="ml-2">
                      <input
                        type="text"
                        placeholder="Optional notes..."
                        value={localSelected.find(a => a.amenity_type === amenity.id)?.notes || ''}
                        onChange={(e) => handleNotesChange(amenity.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {localSelected.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">
            Selected Amenities ({localSelected.length})
          </h4>
          <div className="space-y-1">
            {localSelected.map((amenity) => (
              <div key={amenity.amenity_type} className="flex items-center justify-between text-sm text-green-700">
                <span>{amenity.name}</span>
                <button
                  type="button"
                  onClick={() => handleAmenityToggle({ id: amenity.amenity_type })}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}