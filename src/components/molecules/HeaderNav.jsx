import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/atoms/Button'
import Text from '@/atoms/Text'

const HeaderNav = ({ onLoginClick, onCreateTripClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="MapPin" className="h-5 w-5 text-white" />
              </div>
              <Text as="h1" className="text-xl font-bold text-gray-900">WanderWise</Text>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <Button className="text-primary font-medium border-b-2 border-primary pb-1">
                My Trips
              </Button>
              <Button className="text-gray-500 hover:text-gray-700 transition-colors">
                Expenses
              </Button>
              <Button className="text-gray-500 hover:text-gray-700 transition-colors">
                Documents
              </Button>
              <Button className="text-gray-500 hover:text-gray-700 transition-colors">
                Weather
              </Button>
            </nav>
          </div>

          <Button
            onClick={onCreateTripClick}
            className="bg-primary text-white hover:bg-primary-dark flex items-center space-x-2 shadow-soft"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span className="hidden sm:inline">Create Trip</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default HeaderNav