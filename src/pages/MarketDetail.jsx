import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Clock, Calendar, ArrowLeft } from 'lucide-react'
import marketService from '../services/marketService'

export default function MarketDetail() {
  const { slug } = useParams()
  const [market, setMarket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMarket()
  }, [slug])

  const fetchMarket = async () => {
    try {
      setLoading(true)
      setError(null)
      const marketData = await marketService.getMarket(slug)
      setMarket(marketData)
    } catch (error) {
      console.error('Error fetching market:', error)
      setError('Market not found or failed to load.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading market details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !market) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Link to="/markets" className="btn-primary">
              Back to Markets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/markets" className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Markets
        </Link>

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          {market.expand?.category && (
            <div className="mb-4">
              <span 
                className="inline-block text-white text-sm px-3 py-1 rounded-full"
                style={{ backgroundColor: market.expand.category.color || '#6b7280' }}
              >
                {market.expand.category.name}
              </span>
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{market.name}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{market.address || `${market.suburb}, ${market.state}`}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {market.frequency && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Schedule</p>
                  <p className="text-gray-600">{market.frequency}</p>
                </div>
              </div>
            )}

            {market.operating_hours && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Hours</p>
                  <p className="text-gray-600">{market.operating_hours}</p>
                </div>
              </div>
            )}

            {market.website && (
              <div className="flex items-center">
                <div>
                  <p className="font-medium text-gray-900">Website</p>
                  <a 
                    href={market.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Visit Site
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {market.description && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Market</h2>
            <div className="text-gray-600 leading-relaxed">
              {market.description}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Selling Here?</h2>
          <p className="text-gray-600 mb-6">
            Connect with the market organizers to learn about stallholder opportunities, 
            application requirements, and available spaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="btn-primary">
              Apply as Stallholder
            </Link>
            <button className="btn-secondary">
              Contact Organizer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}