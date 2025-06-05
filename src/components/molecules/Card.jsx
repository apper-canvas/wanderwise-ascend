import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ children, className = '', onClick, initial, animate, exit, transition }) => {
  const commonProps = {
    className: `bg-white rounded-xl shadow-card p-6 ${className}`,
  }

  if (onClick) {
    commonProps.onClick = onClick
    commonProps.className += ' hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1'
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...commonProps}
    >
      {children}
    </motion.div>
  )
}

export default Card