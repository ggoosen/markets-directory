// src/pages/Dashboard.jsx - Enhanced with role-based content
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, MapPin, ShoppingBag, BarChart3, Plus, Calendar, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your dashboard.</p>
          <Link to="/login" className="btn-primary mt-4">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case 'stallholder':
        return <StallholderDashboard />
      case 'organizer':
        return <OrganizerDashboard />
      default:
        return <CustomerDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            {user.role === 'stallholder' && 'Manage your stallholder profile and applications'}
            {user.role === 'organizer' && 'Manage your markets and stallholder applications'}
            {user.role === 'customer' && 'Discover and save your favorite markets'}
          </p>
        </div>

        {renderRoleSpecificContent()}
      </div>
    </div>
  )
}

// Customer Dashboard Component
const CustomerDashboard = () => {
  return (
    <div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-primary-100 rounded-lg p-3">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-gray-600">Favorite Markets</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-secondary-100 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-gray-600">This Weekend</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">Free</p>
              <p className="text-gray-600">Current Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Markets</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Adelaide Central Market</h3>
              <p className="text-sm text-gray-600">Saturday, June 7 • 7:00 AM - 2:00 PM</p>
            </div>
            <Link to="/markets/adelaide-central" className="btn-primary">
              View Details
            </Link>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Barossa Farmers Market</h3>
              <p className="text-sm text-gray-600">Saturday, June 7 • 7:30 AM - 11:30 AM</p>
            </div>
            <Link to="/markets/barossa-farmers" className="btn-primary">
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/markets" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Browse Markets</h3>
              <p className="text-sm text-gray-600">Find new markets in your area</p>
            </div>
          </Link>
          <Link to="/register?role=stallholder" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ShoppingBag className="h-8 w-8 text-secondary-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Become a Stallholder</h3>
              <p className="text-sm text-gray-600">Start selling at local markets</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Stallholder Dashboard Component
const StallholderDashboard = () => {
  return (
    <div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-primary-100 rounded-lg p-3">
              <ShoppingBag className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-gray-600">Active Applications</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-gray-600">Approved</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-gray-600">This Weekend</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-gray-600">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
          <Link to="/apply" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Adelaide Central Market</h3>
              <p className="text-sm text-gray-600">Applied 2 days ago</p>
            </div>
            <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
              Pending
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Barossa Farmers Market</h3>
              <p className="text-sm text-gray-600">Applied 1 week ago</p>
            </div>
            <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
              Approved
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/profile" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <User className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-600">Edit your business details</p>
            </div>
          </Link>
          <Link to="/markets" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin className="h-8 w-8 text-secondary-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Find Markets</h3>
              <p className="text-sm text-gray-600">Discover new opportunities</p>
            </div>
          </Link>
          <Link to="/analytics" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600">Track your performance</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Organizer Dashboard Component
const OrganizerDashboard = () => {
  return (
    <div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-primary-100 rounded-lg p-3">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-gray-600">Active Markets</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-secondary-100 rounded-lg p-3">
              <Users className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-gray-600">Total Stallholders</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <ShoppingBag className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-gray-600">Pending Applications</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">$2,450</p>
              <p className="text-gray-600">Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Applications */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Pending Applications</h2>
          <Link to="/applications" className="text-primary-600 hover:text-primary-500">
            View all
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h3 className="font-medium text-gray-900">Sarah's Organic Produce</h3>
                <p className="text-sm text-gray-600">Applied for Adelaide Central Market</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                Approve
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h3 className="font-medium text-gray-900">Handmade Crafts Co</h3>
                <p className="text-sm text-gray-600">Applied for Barossa Farmers Market</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                Approve
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/markets/create" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Create Market</h3>
              <p className="text-sm text-gray-600">Add a new market listing</p>
            </div>
          </Link>
          <Link to="/applications" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-secondary-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Applications</h3>
              <p className="text-sm text-gray-600">Review stallholder requests</p>
            </div>
          </Link>
          <Link to="/analytics" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600">Market performance data</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}