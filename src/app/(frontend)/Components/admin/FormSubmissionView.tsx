'use client'

import React from 'react'

interface FormSubmissionViewProps {
  value: any
  path: string
}

const FormSubmissionView: React.FC<FormSubmissionViewProps> = ({ value }) => {
  if (!value || typeof value !== 'object') {
    return <div className="text-gray-500">No data available</div>
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="flex">
            <div className="font-medium text-sm text-gray-600 w-1/3 capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
            </div>
            <div className="text-gray-900 w-2/3">
              {val ? String(val) : <span className="text-gray-400 italic">No value</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormSubmissionView
