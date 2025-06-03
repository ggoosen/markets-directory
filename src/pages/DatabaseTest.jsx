// PocketBase Verification Component
// Add this to src/pages/DatabaseTest.jsx for internal verification

import { useState, useEffect } from 'react'
import pb from '../lib/pocketbase'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function DatabaseTest() {
  const [status, setStatus] = useState({
    loading: true,
    pocketbaseOnline: false,
    collections: {},
    dataCounts: {},
    errors: []
  })

  const checkDatabase = async () => {
    setStatus(prev => ({ ...prev, loading: true, errors: [] }))
    
    try {
      const collections = ['users', 'markets', 'market_categories', 'stallholders', 'applications', 'reviews']
      const collectionStatus = {}
      const dataStatus = {}
      const errors = []

      // Check PocketBase health
      const healthCheck = await fetch(`${pb.baseUrl}/api/health`)
      const pocketbaseOnline = healthCheck.ok

      // Check each collection
      for (const collection of collections) {
        try {
          const result = await pb.collection(collection).getList(1, 1)
          collectionStatus[collection] = true
          dataStatus[collection] = result.totalItems
        } catch (error) {
          collectionStatus[collection] = false
          dataStatus[collection] = 0
          errors.push(`${collection}: ${error.message}`)
        }
      }

      // Test market query specifically
      try {
        const markets = await pb.collection('markets').getList(1, 3, {
          expand: 'category'
        })
        console.log('Sample markets found:', markets.items)
      } catch (error) {
        errors.push(`Market query failed: ${error.message}`)
      }

      setStatus({
        loading: false,
        pocketbaseOnline,
        collections: collectionStatus,
        dataCounts: dataStatus,
        errors
      })

    } catch (error) {
      setStatus(prev => ({
        ...prev,
        loading: false,
        pocketbaseOnline: false,
        errors: [`General error: ${error.message}`]
      }))
    }
  }

  useEffect(() => {
    checkDatabase()
  }, [])

  const StatusIcon = ({ status }) => {
    if (status === true) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === false) return <XCircle className="h-5 w-5 text-red-500" />
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Database Verification</h1>
          <p className="text-gray-600">
            Checking PocketBase collections and data integrity
          </p>
          <button 
            onClick={checkDatabase}
            className="mt-4 btn-primary inline-flex items-center"
            disabled={status.loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${status.loading ? 'animate-spin' : ''}`} />
            Refresh Check
          </button>
        </div>

        {/* PocketBase Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">PocketBase Status</h2>
          <div className="flex items-center">
            <StatusIcon status={status.pocketbaseOnline} />
            <span className="ml-2">
              {status.pocketbaseOnline ? 'Online and responding' : 'Offline or not responding'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">URL: {pb.baseUrl}</p>
        </div>

        {/* Collections Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Collections Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(status.collections).map(([collection, exists]) => (
              <div key={collection} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center">
                  <StatusIcon status={exists} />
                  <span className="ml-2 font-medium">{collection}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {status.dataCounts[collection]} records
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Data Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {status.dataCounts.markets || 0}
              </div>
              <div className="text-sm text-blue-800">Markets</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {status.dataCounts.stallholders || 0}
              </div>
              <div className="text-sm text-green-800">Stallholders</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {status.dataCounts.applications || 0}
              </div>
              <div className="text-sm text-purple-800">Applications</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">
                {status.dataCounts.users || 0}
              </div>
              <div className="text-sm text-yellow-800">Users</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">
                {status.dataCounts.reviews || 0}
              </div>
              <div className="text-sm text-red-800">Reviews</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded">
              <div className="text-2xl font-bold text-indigo-600">
                {status.dataCounts.market_categories || 0}
              </div>
              <div className="text-sm text-indigo-800">Categories</div>
            </div>
          </div>
        </div>

        {/* Errors */}
        {status.errors.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Issues Detected</h2>
            <div className="space-y-2">
              {status.errors.map((error, index) => (
                <div key={index} className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => window.open(`${pb.baseUrl}/_/`, '_blank')}
              className="btn-secondary"
            >
              Open PocketBase Admin
            </button>
            <button 
              onClick={() => window.location.href = '/markets'}
              className="btn-primary"
            >
              Test Market Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add this route to your App.jsx for testing:
// <Route path="/database-test" element={<DatabaseTest />} />