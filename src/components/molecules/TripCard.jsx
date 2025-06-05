import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/atoms/Button'
import Card from '@/molecules/Card'
import Text from '@/atoms/Text'

const TripCard = ({ trip, daysRemaining, formatDate, onDelete, onSelect, index }) => {
  return (
    <Card
      onClick={() => onSelect(trip)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="group"
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
          <Text as="h3" className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {trip.title}
          </Text>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onSelect(trip)
              }}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ApperIcon name="Edit" className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(trip.id)
              }}
              className="p-1 rounded hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 mb-3">
          <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
          <Text as="span" className="text-sm">{trip.destination}</Text>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm">
          <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
          <Text as="span">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</Text>
        </div>
      </div>
    </Card>
  )
}

export default TripCard