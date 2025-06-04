// src/pages/CreateMarket.jsx - Complete with Requirements System
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, MapPin, Clock, Calendar, DollarSign, Shield, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import marketService from '../services/marketService'
import AddressInput from '../components/market/AddressInput'
import AmenitySelector from '../components/market/AmenitySelector'
import ScheduleBuilder from '../components/market/ScheduleBuilder'
import FeeBuilder from '../components/market/FeeBuilder'
import RequirementsBuilder from '../components/market/RequirementsBuilder'

export default function CreateMarket() {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)

  // Main market data
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    suburb: '',
    state: 'SA',
    postcode: '',
    latitude: null,
    longitude: null,
    contact_email: '',
    contact_phone: '',
    website: '',
    venue_type: '',
    max_stalls: null,
    waiting_list_enabled: false
  })

  // Normalized data
  const [requirements, setRequirements] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [schedules, setSchedules] = useState([])
  const [fees, setFees] = useState([])

  const { user } = useAuth()
  const navigate = useNavigate()

  const steps = [
    { id: 1, name: 'Basic Info', icon: MapPin },
    { id: 2, name: 'Requirements', icon: Shield },
    { id: 3, name: 'Schedule', icon: Calendar },
    { id: 4, name: 'Details', icon: Settings }
  ]

  // Redirect if not organizer
  // In CreateMarket.jsx, update the role check:
  useEffect(() => {
    if (user && user.role !== 'organizer') {
      console.log('User role:', user.role, 'Expected: organizer')
      // If role is empty, don't redirect immediately - they might need to set it
      if (user.role === '') {
        console.warn('User role is empty - this will cause permission issues')
      } else {
        navigate('/dashboard')
      }
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

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.address,
      suburb: addressData.suburb,
      state: addressData.state,
      postcode: addressData.postcode,
      latitude: addressData.latitude,
      longitude: addressData.longitude
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

  const validateStep = (step) => {
    const errors = []

    switch (step) {
      case 1: // Basic Info
        if (!formData.name.trim()) errors.push('Market name is required')
        if (!formData.category) errors.push('Market category is required')
        if (!formData.address.trim()) errors.push('Address is required')
        if (!formData.suburb.trim()) errors.push('Suburb is required')
        if (!formData.postcode.trim()) errors.push('Postcode is required')
        if (!formData.contact_email.trim()) errors.push('Contact email is required')
        break

      case 2: // Requirements - no validation needed, optional
        break

      case 3: // Schedule
        if (schedules.length === 0) {
          errors.push('At least one schedule is required')
        }
        schedules.forEach((schedule, index) => {
          if (!schedule.start_time) errors.push(`Schedule ${index + 1}: Start time is required`)
          if (!schedule.end_time) errors.push(`Schedule ${index + 1}: End time is required`)
          if (schedule.start_time >= schedule.end_time) {
            errors.push(`Schedule ${index + 1}: End time must be after start time`)
          }
        })
        break

      case 4: // Details - validate fees
        fees.forEach((fee, index) => {
          if (!fee.amount || parseFloat(fee.amount) < 0) {
            errors.push(`Fee ${index + 1}: Valid amount is required`)
          }
          if (!fee.fee_name) {
            errors.push(`Fee ${index + 1}: Fee name is required`)
          }
        })
        break
    }

    return errors
  }

  const nextStep = () => {
    const errors = validateStep(currentStep)
    if (errors.length > 0) {
      setError(errors.join(', '))
      return
    }

    setError(null)
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setError(null)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate all steps
    for (let step = 1; step <= steps.length; step++) {
      const stepErrors = validateStep(step)
      if (stepErrors.length > 0) {
        setError(`Step ${step}: ${stepErrors.join(', ')}`)
        setCurrentStep(step)
        setLoading(false)
        return
      }
    }

    try {
      // Prepare market data
      const marketData = {
        name: formData.name,
        slug: createSlug(formData.name),
        category: formData.category,
        organizer: user.id,
        description: formData.description || '',
        address: formData.address,
        suburb: formData.suburb,
        state: formData.state,
        postcode: formData.postcode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        venue_type: formData.venue_type || null,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone || '',
        website: formData.website || '',
        max_stalls: formData.max_stalls ? parseInt(formData.max_stalls) : null,
        waiting_list_enabled: formData.waiting_list_enabled,
        active: true
      }

      console.log('=== CREATING COMPREHENSIVE MARKET ===')
      console.log('Market Data:', marketData)
      console.log('Requirements:', requirements)
      console.log('Amenities:', selectedAmenities)
      console.log('Schedules:', schedules)
      console.log('Fees:', fees)

      const result = await marketService.createMarketWithDetails(
        marketData,
        requirements,
        selectedAmenities,
        schedules,
        fees
      )

      console.log('Market created successfully:', result)

      // Show success message with summary
      const summary = {
        market: result.market.name,
        requirements: result.requirements?.length || 0,
        amenities: result.amenities?.length || 0,
        schedules: result.schedules?.length || 0,
        fees: result.fees?.length || 0
      }

      console.log('Creation summary:', summary)

      navigate(`/markets/${result.market.slug}`)
    } catch (err) {
      console.error('=== ERROR CREATING MARKET ===')
      console.error('Error:', err)

      if (err.response?.data) {
        console.error('Detailed errors:', err.response.data)
        Object.entries(err.response.data).forEach(([field, error]) => {
          console.error(`❌ Field "${field}" error:`, error)
        })
      }

      setError(err.message || 'Failed to create market')
    } finally {
      setLoading(false)
    }
  }

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

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isCompleted
                      ? 'bg-primary-600 text-white'
                      : isActive
                        ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${isActive ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                      {step.name}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
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
                      Venue Type
                    </label>
                    <select
                      name="venue_type"
                      className="input-field"
                      value={formData.venue_type}
                      onChange={handleChange}
                    >
                      <option value="">Select venue type</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="indoor">Indoor</option>
                      <option value="covered">Covered</option>
                      <option value="mixed">Mixed</option>
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

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Location Details
                </h2>

                <AddressInput
                  address={formData.address}
                  suburb={formData.suburb}
                  state={formData.state}
                  postcode={formData.postcode}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onAddressChange={handleAddressChange}
                />
              </div>

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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Stalls
                    </label>
                    <input
                      type="number"
                      name="max_stalls"
                      min="1"
                      className="input-field"
                      value={formData.max_stalls || ''}
                      onChange={handleChange}
                      placeholder="e.g. 50"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="waiting_list_enabled"
                        checked={formData.waiting_list_enabled}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Enable waiting list when full
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Requirements */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary-600" />
                Stallholder Requirements
              </h2>

              <RequirementsBuilder
                requirements={requirements}
                onChange={setRequirements}
              />
            </div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                Market Schedule
              </h2>

              <ScheduleBuilder
                schedules={schedules}
                onChange={setSchedules}
              />
            </div>
          )}

          {/* Step 4: Details (Amenities & Fees) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Facilities & Amenities
                </h2>

                <AmenitySelector
                  selectedAmenities={selectedAmenities}
                  onChange={setSelectedAmenities}
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
                  Pricing & Fees
                </h2>

                <FeeBuilder
                  fees={fees}
                  onChange={setFees}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className={`btn-secondary ${currentStep === 1 ? 'invisible' : ''}`}
              disabled={loading}
            >
              Previous
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                  disabled={loading}
                >
                  Next
                </button>
              ) : (
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
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}