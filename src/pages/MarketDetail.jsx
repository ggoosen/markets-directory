import { useParams } from 'react-router-dom'
import { MapPin, Clock, Calendar, Phone, Mail, Globe } from 'lucide-react'

export default function MarketDetail() {
  const { slug } = useParams()

  // Placeholder data - later we'll fetch from PocketBase
  const market = {
    name: 'Adelaide Farmers Market',
    suburb: 'Wayville',
    address: 'Adelaide Showground, Rose Terrace, Wayville SA 5034',
    frequency: 'Every Sunday',
    time: '8:30am - 12:30pm',
    category: 'Farmers Market',
    description: 'South Australia\'s premier farmers market featuring fresh local produce, artisan foods, and community atmosphere.',
    website: 'https://adelaidefarmersmarket.com.au',
    contact: 'info@adelaidefarmersmarket.com.au'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="mb-4">
            <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
              {market.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{market.name}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{market.address}</span>
          </div>
          
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Schedule</p>
                <p className="text-gray-600">{market.frequency}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Hours</p>
                <p className="text-gray-600">{market.time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Website</p>
                <a href={market.website} className="text-primary-600 hover:underline">Visit Site</a>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Market</h2>
          <p className="text-gray-600 leading-relaxed">{market.description}</p>
        </div>

        {/* Contact & Apply */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Interested in Selling Here?</h2>
          <p className="text-gray-600 mb-6">
            Connect with the market organizers to learn about stallholder opportunities and application requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn-primary">Apply as Stallholder</button>
            <button className="btn-secondary">Contact Organizer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
