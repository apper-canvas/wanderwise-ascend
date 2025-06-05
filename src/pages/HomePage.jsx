import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import HomePageTemplate from '@/templates/HomePageTemplate'
import { tripService } from '@/services'

const HomePage = () => {
return (
    <HomePageTemplate
      trips={trips}
      loading={loading}
      error={error}
      showCreateModal={showCreateModal}
      setShowCreateModal={setShowCreateModal}
      selectedTrip={selectedTrip}
      setSelectedTrip={setSelectedTrip}
      handleCreateTrip={handleCreateTrip}
      handleDeleteTrip={handleDeleteTrip}
      formatDate={formatDate}
      getDaysRemaining={getDaysRemaining}
      handleUpdateTrip={(updatedTrip) => {
        setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t))
        setSelectedTrip(null)
      }}
    />
  )
}