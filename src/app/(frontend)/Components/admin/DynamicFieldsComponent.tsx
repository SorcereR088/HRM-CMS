'use client'

import React from 'react'

interface DynamicField {
  fieldName: string
  fieldLabel: string
  fieldValue: string
  fieldType: string
}

interface DynamicFieldsComponentProps {
  value: DynamicField[]
  path: string
}

const DynamicFieldsComponent: React.FC<DynamicFieldsComponentProps> = ({ value }) => {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <div className="text-gray-500 italic">No fields submitted</div>
  }

  return (
    <div className="space-y-3">
      {value.map((field, index) => (
        <div key={index} className="border rounded-lg p-3 bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div className="font-semibold text-gray-900">{field.fieldLabel}</div>
            <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              {field.fieldType}
            </div>
          </div>
          <div className="text-gray-700 break-words">
            {field.fieldValue || <span className="text-gray-400 italic">No value</span>}
          </div>
          <div className="text-xs text-gray-400 mt-1">Field name: {field.fieldName}</div>
        </div>
      ))}
    </div>
  )
}

export default DynamicFieldsComponent
