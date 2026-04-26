import React from 'react'

interface AlertProps {
  alert: { msg: string; type: 'success' | 'error' } | null
}

const Alert: React.FC<AlertProps> = ({ alert }) => {
  if (!alert) return null

  const bgColor = alert.type === 'success' ? 'bg-green-600' : 'bg-red-600'
  const textColor = 'text-white'

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg ${bgColor} ${textColor}`}
      role="alert"
    >
      <strong className="capitalize mr-1">{alert.type}:</strong> {alert.msg}
    </div>
  )
}

export default Alert
