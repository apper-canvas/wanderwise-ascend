import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { tripService, activityService, packingItemService } from '../services'

const MainFeature = ({ trip, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('itinerary')
  const [activities, setActivities] = useState([])
  const [packingItems, setPackingItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState(1)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showPackingForm, setShowPackingForm] = useState(false)

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
      setShowPackingForm(false)
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

  const getPackingProgress = () => {
    if (packingItems.length === 0) return 0
    const packedCount = packingItems.filter(item => item.isPacked).length
    return Math.round((packedCount / packingItems.length) * 100)
  }

  const getItemsByCategory = (category) => {
    return packingItems.filter(item => item.category === category)
  }

  const days = getTripDays()
  const dayActivities = getActivitiesForDay(selectedDay)
  const packingProgress = getPackingProgress()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
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
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ApperIcon name="X" className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 bg-white/20 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : tab.disabled
                    ? 'text-white/50 cursor-not-allowed'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
                {tab.disabled && (
                  <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full ml-1 hidden lg:inline">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
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
                        <button
                          key={dayNum}
                          onClick={() => setSelectedDay(dayNum)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
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
                        </button>
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
                    <button
                      onClick={() => setShowActivityForm(true)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
                    >
                      <ApperIcon name="Plus" className="h-4 w-4" />
                      <span>Add Activity</span>
                    </button>
                  </div>

                  {dayActivities.length === 0 ? (
                    <div className="text-center py-12">
                      <ApperIcon name="Calendar" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No activities planned for this day</p>
                      <button
                        onClick={() => setShowActivityForm(true)}
                        className="text-primary hover:text-primary-dark mt-2"
                      >
                        Add your first activity
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dayActivities.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
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
                            <button
                              onClick={() => handleDeleteActivity(activity.id)}
                              className="p-1 rounded hover:bg-red-50 transition-colors"
                            >
                              <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
                            </button>
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
            <div className="h-full overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Packing List</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                      <div
                        className="bg-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${packingProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{packingProgress}% packed</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowPackingForm(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
                >
                  <ApperIcon name="Plus" className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const items = getItemsByCategory(category)
                  const packedItems = items.filter(item => item.isPacked).length
                  
                  return (
                    <div key={category} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900">{category}</h4>
                        <span className="text-sm text-gray-500">
                          {packedItems}/{items.length}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                          >
                            <button
                              onClick={() => handleTogglePackingItem(item.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                item.isPacked
                                  ? 'bg-secondary border-secondary text-white'
                                  : 'border-gray-300 hover:border-secondary'
                              }`}
                            >
                              {item.isPacked && <ApperIcon name="Check" className="h-3 w-3" />}
                            </button>
                            <span
                              className={`flex-1 ${
                                item.isPacked ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}
                            >
                              {item.item}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-sm text-gray-500">×{item.quantity}</span>
                            )}
                          </div>
                        ))}
                        
                        {items.length === 0 && (
                          <p className="text-gray-400 text-sm text-center py-4">
                            No items in this category
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
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

        {/* Activity Form Modal */}
        <AnimatePresence>
          {showActivityForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
              onClick={() => setShowActivityForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Activity</h3>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    handleAddActivity({
                      title: formData.get('title'),
                      startTime: formData.get('startTime'),
                      endTime: formData.get('endTime'),
                      location: { address: formData.get('location') },
                      notes: formData.get('notes'),
                      category: formData.get('category')
                    })
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Visit Eiffel Tower"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Champ de Mars, Paris"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Activity">Activity</option>
                      <option value="Rest">Rest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Additional details or reminders..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowActivityForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Add Activity
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Packing Item Form Modal */}
        <AnimatePresence>
          {showPackingForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
              onClick={() => setShowPackingForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Packing Item</h3>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    handleAddPackingItem({
                      item: formData.get('item'),
                      category: formData.get('category'),
                      quantity: parseInt(formData.get('quantity')) || 1
                    })
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="item"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., T-shirt, Phone charger"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      defaultValue="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPackingForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Add Item
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default MainFeature