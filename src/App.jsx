// src/App.jsx - ONLY this content (clean version)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import MarketList from './pages/MarketList'
import MarketDetail from './pages/MarketDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/markets" element={<MarketList />} />
            <Route path="/markets/:slug" element={<MarketDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/database-test" element={<DatabaseTest />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* Placeholder routes for future features */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50 py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile</h1>
                      <p className="text-gray-600">Profile management coming soon...</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/stallholders" 
              element={
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">For Stallholders</h1>
                    <p className="text-gray-600">Stallholder directory coming soon...</p>
                  </div>
                </div>
              } 
            />
            <Route 
              path="/organizers" 
              element={
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">For Market Organizers</h1>
                    <p className="text-gray-600">Market organizer tools coming soon...</p>
                  </div>
                </div>
              } 
            />
            <Route 
              path="/about" 
              element={
                <div className="min-h-screen bg-gray-50 py-8">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">About SA Markets</h1>
                    <p className="text-gray-600">About page coming soon...</p>
                  </div>
                </div>
              } 
            />            
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App