import React from 'react'

const Input = ({ type = 'text', name, required = false, className = '', placeholder = '', value, onChange, min, defaultValue, rows }) => {
  const commonProps = {
    type,
    name,
    required,
    className: `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`,
    placeholder,
    value,
    onChange,
  }

  if (type === 'textarea') {
    return <textarea {...commonProps} rows={rows || 3}></textarea>
  }

  if (type === 'number') {
    return <input {...commonProps} min={min} defaultValue={defaultValue} />
  }

  return <input {...commonProps} />
}

export default Input