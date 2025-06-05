import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/atoms/Button'
import ActivityForm from '@/organisms/ActivityForm'
import PackingList from '@/organisms/PackingList'
import TabNavigation from '@/molecules/TabNavigation'
import Dialog from '@/molecules/Dialog'
import { activityService, packingItemService } from '@/services'


const TripDetailsSection = ({ trip, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('itinerary')
  const [activities, setActivities] = useState([])
  const [packingItems, setPackingItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState(1)
  const [showActivityForm, setShowActivityForm] = useState(false)

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
    { id: 'packing', label: 'Packing', icon: 'Package' },
    { id: 'map', label: 'Map', icon: 'Map' },
    { id: 'expenses', label: 'Expenses', icon: 'DollarSign', disabled: true },
    { id: 'documents', label: 'Documents', icon: 'FileText', disabled: true }
  ]

  const categories = ['Clothing', 'Electronics', 'Documents', 'Toiletries', 'Other']

  useEffect(() => {
    if (trip) {
      loadTripData()
    }
  }, [trip])

  const loadTripData = async () => {
    setLoading(true)
    try {
      const [activitiesData, packingData] = await Promise.all([
        activityService.getAll(),
        packingItemService.getAll()
      ])
      
      setActivities(activitiesData.filter(a => a.tripId === trip.id) || [])
      setPackingItems(packingData.filter(p => p.tripId === trip.id) || [])
    } catch (err) {
      toast.error("Failed to load trip data")
    } finally {
      setLoading(false)
    }
  }

  const getTripDays = () => {
    if (!trip) return []
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const days = []
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d))
    }
    return days
  }

  const handleAddActivity = async (activityData) => {
    try {
      const newActivity = await activityService.create({
        ...activityData,
        tripId: trip.id,
        day: selectedDay
      })
      setActivities(prev => [...prev, newActivity])
      setShowActivityForm(false)
      toast.success("Activity added successfully!")
    } catch (err) {
      toast.error("Failed to add activity")
    }
  }

  const handleDeleteActivity = async (activityId) => {
    try {
      await activityService.delete(activityId)
      setActivities(prev => prev.filter(a => a.id !== activityId))
      toast.success("Activity deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete activity")
    }
  }

  const handleAddPackingItem = async (itemData) => {
    try {
      const newItem = await packingItemService.create({
        ...itemData,
        tripId: trip.id,
        isPacked: false
      })
      setPackingItems(prev => [...prev, newItem])
      toast.success("Item added to packing list!")
    } catch (err) {
      toast.error("Failed to add item")
    }
  }

  const handleTogglePackingItem = async (itemId) => {
    try {
      const item = packingItems.find(p => p.id === itemId)
      if (!item) return
      
      const updatedItem = await packingItemService.update(itemId, {
        ...item,
        isPacked: !item.isPacked
      })
      
      setPackingItems(prev => prev.map(p => p.id === itemId ? updatedItem : p))
    } catch (err) {
      toast.error("Failed to update item")
    }
  }

  const getActivitiesForDay = (day) => {
    return activities.filter(a => a.day === day).sort((a, b) => {
      const timeA = a.startTime || '00:00'
      const timeB = b.startTime || '00:00'
      return timeA.localeCompare(timeB)
    })
  }

  const days = getTripDays()
  const dayActivities = getActivitiesForDay(selectedDay)

  if (!trip) return null;

  return (
    <Dialog isOpen={!!trip} onClose={onClose} size="6xl" className="h-[90vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{trip.title}</h2>
            <p className="text-blue-100 flex items-center">
              <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
              {trip.destination}
            </p>
          </div>
          <Button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20"
          >
            <ApperIcon name="X" className="h-6 w-6" />
          </Button>
        </div>

        {/* Tabs */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'itinerary' && (
          <div className="h-full flex">
            {/* Days Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Trip Days</h3>
                <div className="space-y-2">
                  {days.map((day, index) => {
                    const dayNum = index + 1
                    const dayActivities = getActivitiesForDay(dayNum)
                    return (
                      <Button
                        key={dayNum}
                        onClick={() => setSelectedDay(dayNum)}
                        className={`w-full text-left p-3 rounded-lg ${
                          selectedDay === dayNum
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium">Day {dayNum}</div>
                        <div className={`text-sm ${selectedDay === dayNum ? 'text-blue-100' : 'text-gray-500'}`}>
                          {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className={`text-xs mt-1 ${selectedDay === dayNum ? 'text-blue-100' : 'text-gray-400'}`}>
                          {dayActivities.length} activities
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Activities Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Day {selectedDay} Activities
                  </h3>
                  <Button
                    onClick={() => setShowActivityForm(true)}
                    className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2"
                  >
                    <ApperIcon name="Plus" className="h-4 w-4" />
                    <span>Add Activity</span>
                  </Button>
                </div>

                {dayActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <ApperIcon name="Calendar" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No activities planned for this day</p>
                    <Button
                      onClick={() => setShowActivityForm(true)}
                      className="text-primary hover:text-primary-dark mt-2"
                    >
                      Add your first activity
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dayActivities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="text-sm font-medium text-primary bg-blue-50 px-2 py-1 rounded">
                                {activity.startTime} - {activity.endTime}
                              </div>
                              <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {activity.category}
                              </div>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                            {activity.location?.address && (
                              <div className="flex items-center text-gray-500 text-sm mb-2">
                                <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                                {activity.location.address}
                              </div>
                            )}
                            {activity.notes && (
                              <p className="text-gray-600 text-sm">{activity.notes}</p>
                            )}
                          </div>
                          <Button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="p-1 rounded hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'packing' && (
          <PackingList
            categories={categories}
            packingItems={packingItems}
            onAddItem={handleAddPackingItem}
            onTogglePacked={handleTogglePackingItem}
          />
        )}

        {activeTab === 'map' && (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ApperIcon name="Map" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-gray-500 max-w-md">
                View all your planned locations and routes on an interactive map. This feature will show activity locations with custom markers and route planning between destinations.
              </p>
            </div>
          </div>
        )}

        {(activeTab === 'expenses' || activeTab === 'documents') && (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ApperIcon 
                name={activeTab === 'expenses' ? 'DollarSign' : 'FileText'} 
                className="h-16 w-16 text-gray-300 mx-auto mb-4" 
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === 'expenses' ? 'Expense Tracking' : 'Document Storage'}
              </h3>
              <p className="text-gray-500 max-w-md">
                {activeTab === 'expenses' 
                  ? 'Track your travel budget, categorize expenses, and monitor spending throughout your trip.'
                  : 'Securely store important travel documents, tickets, and reservations in one place.'
                }
              </p>
              <div className="mt-6 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg inline-block">
                Coming Soon!
              </div>
            </div>
          </div>
        )}
      </div>

      <ActivityForm
        isOpen={showActivityForm}
        onClose={() => setShowActivityForm(false)}
        onSubmit={handleAddActivity}
      />
    </Dialog>
  )
}

export default TripDetailsSection