import React from 'react'

const Button = ({ loading = false, children, onClick = () => {} } = {}) => (
  <button
    onClick={onClick}
    className="bg-pink-lightest text-pink font-semibold rounded-sm px-4 py-2 flex items-center justify-center focus:outline-none"
  >
    {loading ? <i className="fas fa-spinner fa-spin" /> : children}
  </button>
)

export default Button
