import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { tripService } from '../services'

const Home = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      try {
        const result = await tripService.getAll()
        setTrips(result)
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load trips")
      } finally {
        setLoading(false)
      }
    }
    loadTrips()
  }, [])

  const handleCreateTrip = async (tripData) => {
    try {
      const newTrip = await tripService.create(tripData)
      setTrips(prev => [newTrip, ...prev])
      setShowCreateModal(false)
      toast.success("Trip created successfully!")
    } catch (err) {
      toast.error("Failed to create trip")
    }
  }

  const handleDeleteTrip = async (tripId) => {
    try {
      await tripService.delete(tripId)
      setTrips(prev => prev.filter(trip => trip.id !== tripId))
      toast.success("Trip deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete trip")
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysRemaining = (startDate) => {
    const today = new Date()
    const start = new Date(startDate)
    const diffTime = start - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="MapPin" className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">WanderWise</h1>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <button className="text-primary font-medium border-b-2 border-primary pb-1">
                  My Trips
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  Expenses
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  Documents
                </button>
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  Weather
                </button>
              </nav>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 shadow-soft"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span className="hidden sm:inline">Create Trip</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Plan Your Perfect Adventure
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Organize every detail of your journey with our intuitive trip planning platform
          </motion.p>
        </div>

        {/* Trip Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-card p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <ApperIcon name="AlertTriangle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Error loading trips: {error}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Luggage" className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6">Start planning your next adventure!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {trips.map((trip, index) => {
                const daysRemaining = getDaysRemaining(trip.startDate)
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={trip.coverImage || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop`}
                        alt={trip.destination}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <ApperIcon name="Heart" className="h-4 w-4 text-gray-600" />
                      </div>
                      {daysRemaining > 0 && (
                        <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          {daysRemaining} days to go
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {trip.title}
                        </h3>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTrip(trip)
                            }}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <ApperIcon name="Edit" className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTrip(trip.id)
                            }}
                            className="p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-500 mb-3">
                        <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                        <span className="text-sm">{trip.destination}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                        <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Main Feature Component */}
        {selectedTrip && (
          <MainFeature
            trip={selectedTrip}
            onClose={() => setSelectedTrip(null)}
            onUpdate={(updatedTrip) => {
              setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t))
              setSelectedTrip(null)
            }}
          />
        )}

        {/* Create Trip Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Create New Trip</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    const tripData = {
                      title: formData.get('title'),
                      destination: formData.get('destination'),
                      startDate: formData.get('startDate'),
                      endDate: formData.get('endDate'),
                      coverImage: `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop`
                    }
                    handleCreateTrip(tripData)
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trip Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Summer in Europe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination
                    </label>
                    <input
                      type="text"
                      name="destination"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Paris, France"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Create Trip
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default Home