import { Link } from 'react-router-dom'
import { Search, MapPin, Users, ShoppingBag, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Local Markets
              <span className="block text-secondary-400">Across South Australia</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-100">
              Connect with vibrant local markets, fresh produce, unique crafts, and community experiences right in your neighborhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/markets" className="btn-secondary text-lg px-8 py-3">
                <Search className="h-5 w-5 mr-2" />
                Browse Markets
              </Link>
              <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors text-lg">
                Join as Stallholder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SA Markets?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're building stronger communities by connecting local markets, stallholders, and customers across South Australia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Markets Nearby</h3>
              <p className="text-gray-600">
                Discover farmers markets, craft fairs, and community markets in your local area with our interactive map and search tools.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Communities</h3>
              <p className="text-gray-600">
                Join a vibrant network of local producers, artisans, and market-goers who share a passion for community and quality.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Local Business</h3>
              <p className="text-gray-600">
                Shop directly from local farmers, makers, and small businesses while supporting your community's economic growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to explore local markets?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of South Australians discovering amazing local products and experiences.
          </p>
          <Link to="/markets" className="btn-primary text-lg px-8 py-3 inline-flex items-center">
            Start Exploring
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
