// src/pages/Dashboard.jsx - Fixed Role Detection
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, MapPin, ShoppingBag, BarChart3, Plus, Calendar, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user, loading } = useAuth()

  // Debug: Let's see what user object looks like
  useEffect(() => {
    console.log('Dashboard - Current user:', user)
    console.log('Dashboard - User role:', user?.role)
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

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
    console.log('Rendering content for role:', user.role) // Debug log
    
    switch (user.role) {
      case 'stallholder':
        return <StallholderDashboard user={user} />
      case 'organizer':
        return <OrganizerDashboard user={user} />
      case 'customer':
      default:
        return <CustomerDashboard user={user} />
    }
  }

  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'stallholder': return 'Stallholder'
      case 'organizer': return 'Market Organizer'
      case 'customer': return 'Customer'
      default: return 'User'
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
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              {user.role === 'stallholder' && 'Manage your stallholder profile and applications'}
              {user.role === 'organizer' && 'Manage your markets and stallholder applications'}
              {(user.role === 'customer' || !user.role) && 'Discover and save your favorite markets'}
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {getRoleDisplayName(user.role)}
            </span>
          </div>
        </div>

        {/* Debug Info (remove this after testing) */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Debug Info:</h3>
          <p className="text-xs text-blue-600">User ID: {user.id}</p>
          <p className="text-xs text-blue-600">User Role: {user.role || 'undefined'}</p>
          <p className="text-xs text-blue-600">User Email: {user.email}</p>
        </div>

        {renderRoleSpecificContent()}
      </div>
    </div>
  )
}

// Customer Dashboard Component
const CustomerDashboard = ({ user }) => {
  return (
    <div>
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium">✅ Customer Dashboard Loaded</p>
      </div>

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
const StallholderDashboard = ({ user }) => {
  return (
    <div>
      <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-purple-800 font-medium">✅ Stallholder Dashboard Loaded</p>
      </div>

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
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Apply to Market</h3>
              <p className="text-sm text-gray-600">Submit new application</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// Organizer Dashboard Component
const OrganizerDashboard = ({ user }) => {
  return (
    <div>
      <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-orange-800 font-medium">✅ Organizer Dashboard Loaded</p>
      </div>

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
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-secondary-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Applications</h3>
              <p className="text-sm text-gray-600">Review stallholder requests</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600">Market performance data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}