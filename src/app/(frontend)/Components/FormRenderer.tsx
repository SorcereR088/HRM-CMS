'use client'

import { Form } from '@/payload-types'
import React, { useState } from 'react'

// Define proper types for form fields based on PayloadCMS form builder structure
interface FormField {
  blockType: string
  name?: string
  label?: string
  required?: boolean
  id?: string
  blockName?: string
  width?: number
  defaultValue?: string | boolean | number
  options?: Array<{
    label: string
    value: string
  }>
}

interface FormRendererProps {
  form: Form
  className?: string
}

const FormRenderer: React.FC<FormRendererProps> = ({ form, className = '' }) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: form.id,
          submissionData: formData,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({})

        // Handle redirect if specified and exists on form
        if (form.formredirect && typeof form.formredirect === 'string') {
          window.location.href = form.formredirect
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to submit form')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if form has redirect property safely
  const hasRedirect = form.formredirect && typeof form.formredirect === 'string'

  if (isSubmitted && !hasRedirect) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Form submitted successfully!</h3>
            {form.confirmationMessage && (
              <div
                className="mt-2 text-sm text-green-700"
                dangerouslySetInnerHTML={{
                  __html:
                    typeof form.confirmationMessage === 'string' ? form.confirmationMessage : '',
                }}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {form.title && <h2 className="text-2xl font-bold mb-6 text-gray-900">{form.title}</h2>}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields &&
          Array.isArray(form.fields) &&
          form.fields.map((field: any, index: number) => {
            const fieldData = field as FormField
            const fieldName = fieldData.name || `field-${index}`
            const fieldId = `${fieldName}-${index}`

            switch (fieldData.blockType) {
              case 'text':
              case 'email':
              case 'number':
                return (
                  <div key={index}>
                    <label
                      htmlFor={fieldId}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {fieldData.label}
                      {fieldData.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      id={fieldId}
                      type={
                        fieldData.blockType === 'email'
                          ? 'email'
                          : fieldData.blockType === 'number'
                            ? 'number'
                            : 'text'
                      }
                      name={fieldName}
                      required={fieldData.required}
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleInputChange(fieldName, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={fieldData.label || ''}
                    />
                  </div>
                )

              case 'textarea':
                return (
                  <div key={index}>
                    <label
                      htmlFor={fieldId}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {fieldData.label}
                      {fieldData.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <textarea
                      id={fieldId}
                      name={fieldName}
                      required={fieldData.required}
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleInputChange(fieldName, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                      placeholder={fieldData.label || ''}
                    />
                  </div>
                )

              case 'select':
                return (
                  <div key={index}>
                    <label
                      htmlFor={fieldId}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {fieldData.label}
                      {fieldData.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <select
                      id={fieldId}
                      name={fieldName}
                      required={fieldData.required}
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleInputChange(fieldName, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select an option</option>
                      {fieldData.options &&
                        Array.isArray(fieldData.options) &&
                        fieldData.options.map((option, idx) => (
                          <option key={idx} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  </div>
                )

              case 'checkbox':
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <input
                      id={fieldId}
                      type="checkbox"
                      name={fieldName}
                      required={fieldData.required}
                      checked={formData[fieldName] || false}
                      onChange={(e) => handleInputChange(fieldName, e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={fieldId} className="text-sm text-gray-700">
                      {fieldData.label}
                      {fieldData.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  </div>
                )

              // Handle additional field types that might be available
              case 'phone':
                return (
                  <div key={index}>
                    <label
                      htmlFor={fieldId}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {fieldData.label}
                      {fieldData.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      id={fieldId}
                      type="tel"
                      name={fieldName}
                      required={fieldData.required}
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleInputChange(fieldName, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder={fieldData.label || ''}
                    />
                  </div>
                )

              default:
                console.warn(`Unknown field type: ${fieldData.blockType}`)
                return null
            }
          })}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : form.submitButtonLabel || 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default FormRenderer
