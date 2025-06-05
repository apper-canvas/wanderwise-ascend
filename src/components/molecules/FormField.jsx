import React from 'react'
import Label from '@/atoms/Label'
import Input from '@/atoms/Input'

const FormField = ({ label, id, ...inputProps }) => {
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} {...inputProps} />
    </div>
  )
}

export default FormField