import React from 'react'
import FormField from '@/molecules/FormField'
import Button from '@/atoms/Button'
import Dialog from '@/molecules/Dialog'

const CreateTripForm = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create New Trip">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          onSubmit({
            title: formData.get('title'),
            destination: formData.get('destination'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            coverImage: `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop`
          })
        }}
        className="space-y-4"
      >
        <FormField
          label="Trip Title"
          type="text"
          name="title"
          required
          placeholder="e.g., Summer in Europe"
        />

        <FormField
          label="Destination"
          type="text"
          name="destination"
          required
          placeholder="e.g., Paris, France"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Start Date"
            type="date"
            name="startDate"
            required
          />
          <FormField
            label="End Date"
            type="date"
            name="endDate"
            required
          />
        </div>

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
            Create Trip
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default CreateTripForm