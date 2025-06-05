import React from 'react'
import FormField from '@/molecules/FormField'
import Button from '@/atoms/Button'
import Label from '@/atoms/Label'
import Dialog from '@/molecules/Dialog'

const ActivityForm = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Activity">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          onSubmit({
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
        <FormField
          label="Activity Title"
          type="text"
          name="title"
          required
          placeholder="e.g., Visit Eiffel Tower"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Start Time"
            type="time"
            name="startTime"
            required
          />
          <FormField
            label="End Time"
            type="time"
            name="endTime"
            required
          />
        </div>

        <FormField
          label="Location"
          type="text"
          name="location"
          placeholder="e.g., Champ de Mars, Paris"
        />

        <div>
          <Label>Category</Label>
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

        <FormField
          label="Notes (Optional)"
          type="textarea"
          name="notes"
          rows={3}
          placeholder="Additional details or reminders..."
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary text-white hover:bg-primary-dark"
          >
            Add Activity
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default ActivityForm