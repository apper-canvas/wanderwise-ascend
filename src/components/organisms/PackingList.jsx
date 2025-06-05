import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/atoms/Button'
import Label from '@/atoms/Label'
import Input from '@/atoms/Input'
import Dialog from '@/molecules/Dialog'
import { motion, AnimatePresence } from 'framer-motion'

const PackingList = ({ categories, packingItems, onAddItem, onTogglePacked }) => {
  const [showPackingForm, setShowPackingForm] = React.useState(false)

  const getPackingProgress = () => {
    if (packingItems.length === 0) return 0
    const packedCount = packingItems.filter(item => item.isPacked).length
    return Math.round((packedCount / packingItems.length) * 100)
  }

  const getItemsByCategory = (category) => {
    return packingItems.filter(item => item.category === category)
  }

  const packingProgress = getPackingProgress()

  const handleAddItem = (itemData) => {
    onAddItem(itemData)
    setShowPackingForm(false)
  }

  return (
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
        <Button
          onClick={() => setShowPackingForm(true)}
          className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Item</span>
        </Button>
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
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                  >
                    <Button
                      onClick={() => onTogglePacked(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.isPacked
                          ? 'bg-secondary border-secondary text-white'
                          : 'border-gray-300 hover:border-secondary'
                      }`}
                    >
                      {item.isPacked && <ApperIcon name="Check" className="h-3 w-3" />}
                    </Button>
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
                  </motion.div>
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

      <AnimatePresence>
        {showPackingForm && (
          <Dialog isOpen={showPackingForm} onClose={() => setShowPackingForm(false)} title="Add Packing Item">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                handleAddItem({
                  item: formData.get('item'),
                  category: formData.get('category'),
                  quantity: parseInt(formData.get('quantity')) || 1
                })
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  type="text"
                  name="item"
                  id="item-name"
                  required
                  placeholder="e.g., T-shirt, Phone charger"
                />
              </div>

              <div>
                <Label htmlFor="item-category">Category</Label>
                <select
                  name="category"
                  id="item-category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="item-quantity">Quantity</Label>
                <Input
                  type="number"
                  name="quantity"
                  id="item-quantity"
                  min="1"
                  defaultValue="1"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowPackingForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-white hover:bg-primary-dark"
                >
                  Add Item
                </Button>
              </div>
            </form>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PackingList