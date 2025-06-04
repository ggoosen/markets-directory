// src/pages/CreateMarket.jsx - Market Creation Form
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, MapPin, Clock, Calendar, DollarSign } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import marketService from '../services/marketService'

export default function CreateMarket() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    suburb: '',
    state: 'SA',
    postcode: '',
    frequency: '',
    operating_hours: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    facilities: [],
    stall_fee: '',
    application_fee: '',
    bond_required: false,
    bond_amount: '',
    insurance_required: true,
    power_available: false,
    parking_available: true,
    accessibility_notes: ''
  })

  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect if not organizer
  useEffect(() => {
    if (user && user.role !== 'organizer') {
      navigate('/dashboard')
    }
  }, [user, navigate])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const categoriesData = await marketService.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFacilitiesChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const marketData = {
        ...formData,
        slug: createSlug(formData.name),
        organizer: user.id,
        active: true,
        stall_fee: formData.stall_fee ? parseFloat(formData.stall_fee) : null,
        application_fee: formData.application_fee ? parseFloat(formData.application_fee) : null,
        bond_amount: formData.bond_amount ? parseFloat(formData.bond_amount) : null
      }

      const newMarket = await marketService.createMarket(marketData)
      navigate(`/markets/${newMarket.slug}`)
    } catch (err) {
      console.error('Error creating market:', err)
      setError(err.message || 'Failed to create market')
    } finally {
      setLoading(false)
    }
  }

  const facilityOptions = [
    'Toilets', 'Parking', 'Food Court', 'ATM', 'Wheelchair Access',
    'Children\'s Area', 'Entertainment', 'Seating', 'Shelter/Cover',
    'Storage', 'Loading Dock', 'Security'
  ]

  const frequencyOptions = [
    'Daily', 'Weekly', 'Fortnightly', 'Monthly',
    'First Saturday', 'First Sunday', 'Second Saturday', 'Second Sunday',
    'Third Saturday', 'Third Sunday', 'Fourth Saturday', 'Fourth Sunday',
    'Specific Dates', 'Seasonal'
  ]

  if (user && user.role !== 'organizer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600">Only market organizers can create markets.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-primary-600 hover:text-primary-500 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Market</h1>
          <p className="text-gray-600 mt-2">
            Set up your market listing to attract stallholders and customers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Adelaide Central Market"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="input-field"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  name="state"
                  className="input-field"
                  value={formData.state}
                  onChange={handleChange}
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  className="input-field"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your market, its atmosphere, and what makes it special..."
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Location Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  className="input-field"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Market Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suburb *
                </label>
                <input
                  type="text"
                  name="suburb"
                  required
                  className="input-field"
                  value={formData.suburb}
                  onChange={handleChange}
                  placeholder="Adelaide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  name="postcode"
                  required
                  pattern="[0-9]{4}"
                  className="input-field"
                  value={formData.postcode}
                  onChange={handleChange}
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          {/* Schedule & Operations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary-600" />
              Schedule & Operations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  name="frequency"
                  required
                  className="input-field"
                  value={formData.frequency}
                  onChange={handleChange}
                >
                  <option value="">Select frequency</option>
                  {frequencyOptions.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Hours
                </label>
                <input
                  type="text"
                  name="operating_hours"
                  className="input-field"
                  value={formData.operating_hours}
                  onChange={handleChange}
                  placeholder="8:00 AM - 2:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contact_email"
                  required
                  className="input-field"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="info@yourmarket.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  className="input-field"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="08 1234 5678"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  className="input-field"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourmarket.com"
                />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Facilities & Amenities
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {facilityOptions.map((facility) => (
                <label key={facility} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilitiesChange(facility)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accessibility Notes
              </label>
              <textarea
                name="accessibility_notes"
                rows={3}
                className="input-field"
                value={formData.accessibility_notes}
                onChange={handleChange}
                placeholder="Describe accessibility features, parking, wheelchair access, etc."
              />
            </div>
          </div>

          {/* Pricing & Requirements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
              Pricing & Requirements
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stall Fee (per market day)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="stall_fee"
                    min="0"
                    step="0.01"
                    className="input-field pl-8"
                    value={formData.stall_fee}
                    onChange={handleChange}
                    placeholder="50.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Fee
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="application_fee"
                    min="0"
                    step="0.01"
                    className="input-field pl-8"
                    value={formData.application_fee}
                    onChange={handleChange}
                    placeholder="10.00"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="bond_required"
                      checked={formData.bond_required}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Bond Required</span>
                  </label>

                  {formData.bond_required && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bond Amount
                      </label>
                      <div className="relative max-w-xs">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          name="bond_amount"
                          min="0"
                          step="0.01"
                          className="input-field pl-8"
                          value={formData.bond_amount}
                          onChange={handleChange}
                          placeholder="100.00"
                        />
                      </div>
                    </div>
                  )}

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="insurance_required"
                      checked={formData.insurance_required}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Public Liability Insurance Required</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="power_available"
                      checked={formData.power_available}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Power Available for Stalls</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="parking_available"
                      checked={formData.parking_available}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Parking Available</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Market...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Market
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}