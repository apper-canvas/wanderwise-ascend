import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/atoms/Button'

const TabButton = ({ tab, activeTab, onClick }) => {
  return (
    <Button
      onClick={() => onClick(tab.id)}
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
    </Button>
  )
}

export default TabButton