import React from 'react'
import { motion } from 'framer-motion'

const Text = ({ as = 'p', children, className = '', initial, animate, transition }) => {
  const Component = motion[as] || as // Use motion component if 'as' is a valid HTML tag, otherwise fallback to plain tag

  return (
    <Component
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
    >
      {children}
    </Component>
  )
}

export default Text