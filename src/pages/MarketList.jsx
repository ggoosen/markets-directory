import { useState, useEffect } from 'react'
import { Search, Filter, MapPin } from 'lucide-react'

export default function MarketList() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // For now, show placeholder data
    // Later we'll fetch from PocketBase
    setMarkets([
      {
        id: 1,
        name: 'Adelaide Farmers Market',
        suburb: 'Wayville',
        frequency: 'Every Sunday',
        time: '8:30am - 12:30pm',
        category: 'Farmers Market'
      },
      {
        id: 2,
        name: 'Blackwood Craft Market',
        suburb: 'Blackwood',
        frequency: '1st Sunday',
        time: '10am - 3pm',
        category: 'Craft & Artisan'
      }
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading markets...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Markets</h1>
          <p className="text-gray-600">Discover local markets across South Australia</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search markets by name or location..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button className="btn-primary">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map((market) => (
            <div key={market.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="mb-4">
                <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  {market.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{market.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{market.suburb}, SA</span>
              </div>
              <p className="text-gray-600 mb-1">
                <strong>When:</strong> {market.frequency}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Time:</strong> {market.time}
              </p>
              <button className="btn-primary w-full">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
