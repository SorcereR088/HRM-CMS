'use client'

import React from 'react'

// Define a type for form submission data
type FormSubmissionData = Record<string, string | number | boolean | null | undefined>

interface FormSubmissionViewProps {
  value: FormSubmissionData | null | undefined
  path: string
}

const FormSubmissionView: React.FC<FormSubmissionViewProps> = ({ value }) => {
  if (!value || typeof value !== 'object') {
    return <div className="text-gray-500">No data available</div>
  }

  // Helper function to safely format field names
  const formatFieldName = (key: string): string => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  }

  // Helper function to safely render field values
  const renderFieldValue = (val: unknown): React.ReactNode => {
    if (val === null || val === undefined || val === '') {
      return <span className="text-gray-400 italic">No value</span>
    }

    // Handle different value types
    if (typeof val === 'boolean') {
      return val ? 'Yes' : 'No'
    }

    if (typeof val === 'number') {
      return val.toString()
    }

    if (typeof val === 'string') {
      return val
    }

    // For any other type, convert to string
    return String(val)
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="flex">
            <div className="font-medium text-sm text-gray-600 w-1/3 capitalize">
              {formatFieldName(key)}:
            </div>
            <div className="text-gray-900 w-2/3">{renderFieldValue(val)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormSubmissionView
