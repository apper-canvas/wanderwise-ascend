import React from 'react'

const Button = ({ children, className = '', onClick, type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg transition-colors ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button