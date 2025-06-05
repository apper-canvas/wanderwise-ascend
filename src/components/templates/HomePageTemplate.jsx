import React from 'react'
import HeaderNav from '@/molecules/HeaderNav'
import HeroSection from '@/molecules/HeroSection'
import TripGrid from '@/organisms/TripGrid'
import CreateTripForm from '@/organisms/CreateTripForm'
import TripDetailsSection from '@/organisms/TripDetailsSection'

const HomePageTemplate = ({
  trips,
  loading,
  error,
  showCreateModal,
  setShowCreateModal,
  selectedTrip,
  setSelectedTrip,
  handleCreateTrip,
  handleDeleteTrip,
  formatDate,
  getDaysRemaining,
  handleUpdateTrip
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <HeaderNav onCreateTripClick={() => setShowCreateModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />

        <TripGrid
          trips={trips}
          loading={loading}
          error={error}
          onCreateTrip={() => setShowCreateModal(true)}
          onDeleteTrip={handleDeleteTrip}
          onSelectTrip={setSelectedTrip}
          formatDate={formatDate}
          getDaysRemaining={getDaysRemaining}
        />

        <TripDetailsSection
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onUpdate={handleUpdateTrip}
        />

        <CreateTripForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTrip}
        />
      </main>
    </div>
  )
}

export default HomePageTemplate