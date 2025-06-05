import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/atoms/Button'

const Dialog = ({ isOpen, onClose, title, children, className = '', size = 'md' }) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '6xl': 'max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col', // Specific for MainFeature
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            className={`bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <Button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
                  <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Dialog