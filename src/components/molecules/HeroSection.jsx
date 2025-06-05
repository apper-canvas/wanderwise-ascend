import React from 'react'
import Text from '@/atoms/Text'

const HeroSection = () => {
  return (
    <div className="text-center mb-12">
      <Text
        as="h2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
      >
        Plan Your Perfect Adventure
      </Text>
      <Text
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-gray-600 max-w-2xl mx-auto"
      >
        Organize every detail of your journey with our intuitive trip planning platform
      </Text>
    </div>
  )
}

export default HeroSection