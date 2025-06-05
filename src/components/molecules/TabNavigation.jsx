import React from 'react'
import TabButton from '@/molecules/TabButton'

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 mt-6 bg-white/20 rounded-lg p-1">
      {tabs.map((tab) => (
        <TabButton key={tab.id} tab={tab} activeTab={activeTab} onClick={onTabChange} />
      ))}
    </div>
  )
}

export default TabNavigation