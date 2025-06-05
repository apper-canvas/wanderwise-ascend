import React from 'react'
import { AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/atoms/Button'
import TripCard from '@/molecules/TripCard'
import Loader from '@/molecules/Loader'
import Text from '@/atoms/Text'

const TripGrid = ({ trips, loading, error, onCreateTrip, onDeleteTrip, onSelectTrip, formatDate, getDaysRemaining }) => {
  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertTriangle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <Text className="text-red-600">Error loading trips: {error}</Text>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center">
          <ApperIcon name="Luggage" className="h-16 w-16 text-primary" />
        </div>
        <Text as="h3" className="text-xl font-semibold text-gray-900 mb-2">No trips yet</Text>
        <Text className="text-gray-500 mb-6">Start planning your next adventure!</Text>
        <Button
          onClick={onCreateTrip}
          className="bg-primary text-white px-6 py-3 hover:bg-primary-dark"
        >
          Create Your First Trip
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {trips.map((trip, index) => {
          const daysRemaining = getDaysRemaining(trip.startDate)
          return (
            <TripCard
              key={trip.id}
              trip={trip}
              daysRemaining={daysRemaining}
              formatDate={formatDate}
              onDelete={onDeleteTrip}
              onSelect={onSelectTrip}
              index={index}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default TripGrid