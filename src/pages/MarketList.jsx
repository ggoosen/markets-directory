import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, MapPin, Clock, Calendar } from 'lucide-react'
import marketService from '../services/marketService'

export default function MarketList() {
  const [markets, setMarkets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    state: 'SA'
  })

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch categories
      const categoriesData = await marketService.getCategories()
      setCategories(categoriesData)

      // Fetch markets with filters
      const marketsData = await marketService.getMarkets({
        search: filters.search,
        category: filters.category,
        state: filters.state,
        perPage: 50
      })
      
      setMarkets(marketsData.items || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load markets. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value })
  }

  const handleCategoryChange = (categoryId) => {
    setFilters({ ...filters, category: categoryId })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading markets...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchData}
              className="btn-primary mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Markets</h1>
          <p className="text-gray-600">
            Discover {markets.length} local markets across South Australia
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search markets by name or location..."
                  className="input-field pl-10"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="md:col-span-4">
              <select
                className="input-field"
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                className="input-field"
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
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
        </div>

        {markets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No markets found matching your criteria.</p>
            <button 
              onClick={() => setFilters({ search: '', category: '', state: 'SA' })}
              className="btn-secondary mt-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((market) => (
              <div key={market.id} className="card hover:shadow-lg transition-shadow">
                {market.expand?.category && (
                  <div className="mb-4">
                    <span 
                      className="inline-block text-white text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: market.expand.category.color || '#6b7280' }}
                    >
                      {market.expand.category.name}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{market.name}</h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{market.suburb}, {market.state}</span>
                </div>

                {market.frequency && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{market.frequency}</span>
                  </div>
                )}

                {market.operating_hours && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{market.operating_hours}</span>
                  </div>
                )}

                {market.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {market.description.substring(0, 100)}...
                  </p>
                )}

                <div className="flex gap-2">
                  <Link 
                    to={`/markets/${market.slug}`}
                    className="btn-primary flex-1 text-center"
                  >
                    View Details
                  </Link>
                  {market.website && (
                    <button className="btn-secondary px-3 py-2" title="Visit Website">
                      🌐
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}