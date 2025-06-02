import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, MapPin, User } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">SA Markets</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/markets" className="text-gray-700 hover:text-primary-600 transition-colors">
              Browse Markets
            </Link>
            <Link to="/stallholders" className="text-gray-700 hover:text-primary-600 transition-colors">
              For Stallholders
            </Link>
            <Link to="/organizers" className="text-gray-700 hover:text-primary-600 transition-colors">
              For Organizers
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
              Log In
            </Link>
            <Link to="/register" className="btn-primary">
              Sign Up
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
              <User className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link to="/markets" className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                Browse Markets
              </Link>
              <Link to="/stallholders" className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                For Stallholders
              </Link>
              <Link to="/organizers" className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                For Organizers
              </Link>
              <Link to="/about" className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                About
              </Link>
              <hr className="my-2" />
              <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                Log In
              </Link>
              <Link to="/register" className="px-3 py-2 btn-primary text-center">
                Sign Up
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
