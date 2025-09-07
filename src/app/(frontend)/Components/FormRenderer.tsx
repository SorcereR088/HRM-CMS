'use client'

import { Form } from '@/payload-types'
import React, { useState } from 'react'

// Define a type for form data values
type FormDataValue = string | number | boolean

// Define a type for form data
type FormData = Record<string, FormDataValue>

interface FormRendererProps {
  form: Form
  className?: string
}

const FormRenderer: React.FC<FormRendererProps> = ({ form, className = '' }) => {
  const [formData, setFormData] = useState<FormData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (name: string, value: FormDataValue) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formId = typeof form === 'object' ? form.id : form

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: formId,
          submissionData: formData,
        }),
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('Submission successful:', responseData)
        setIsSubmitted(true)

        // (Optional) clear form fields
        setFormData({})

        // Handle redirect if specified
        if (form.redirect?.url && typeof form.redirect.url === 'string') {
          window.location.href = form.redirect.url
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to submit form')
      }
    } catch (err) {
      console.error('Network error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldValue = (fieldName: string, defaultValue: unknown): string => {
    const value = formData[fieldName]
    if (value !== undefined) {
      return String(value)
    }
    if (defaultValue !== undefined && defaultValue !== null) {
      return String(defaultValue)
    }
    return ''
  }

  const getCheckboxValue = (fieldName: string, defaultValue: unknown): boolean => {
    const value = formData[fieldName]
    if (value !== undefined) {
      return Boolean(value)
    }
    if (defaultValue !== undefined && defaultValue !== null) {
      return Boolean(defaultValue)
    }
    return false
  }

  // Helper function to safely get field properties
  const getFieldProp = <T,>(field: unknown, prop: string, fallback: T): T => {
    if (field && typeof field === 'object' && prop in field) {
      const value = (field as Record<string, unknown>)[prop]
      return value !== null && value !== undefined ? (value as T) : fallback
    }
    return fallback
  }

  const renderField = (field: unknown, index: number) => {
    // Check if field has required properties
    if (!field || typeof field !== 'object') {
      return null
    }

    const blockType = getFieldProp(field, 'blockType', '')
    const name = getFieldProp(field, 'name', '')

    // Skip fields without blockType or name (like message blocks)
    if (!blockType || !name) {
      return null
    }

    const fieldId = `${name}-${index}`
    const label = getFieldProp(field, 'label', '')
    const required = getFieldProp(field, 'required', false)
    const defaultValue = getFieldProp(field, 'defaultValue', undefined)

    switch (blockType) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={index}>
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-2">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={fieldId}
              type={blockType === 'email' ? 'email' : blockType === 'number' ? 'number' : 'text'}
              name={name}
              required={required}
              disabled={isSubmitted}
              value={getFieldValue(name, defaultValue)}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm"
              placeholder={label}
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={index}>
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-2">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={fieldId}
              name={name}
              required={required}
              disabled={isSubmitted}
              value={getFieldValue(name, defaultValue)}
              onChange={(e) => handleInputChange(name, e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm transition-colors resize-vertical"
              placeholder={label}
            />
          </div>
        )

      case 'select':
        const options = getFieldProp(
          field,
          'options',
          [] as Array<{ value: string; label: string }>,
        )
        return (
          <div key={index}>
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-2">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={fieldId}
              name={name}
              required={required}
              disabled={isSubmitted}
              value={getFieldValue(name, defaultValue)}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm transition-colors"
            >
              <option value="">Select an option</option>
              {Array.isArray(options) &&
                options.map((option, idx) => (
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
              name={name}
              required={required}
              disabled={isSubmitted}
              checked={getCheckboxValue(name, defaultValue)}
              onChange={(e) => handleInputChange(name, e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={fieldId} className="text-sm text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        )

      case 'country':
      case 'state':
        return (
          <div key={index}>
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-2">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={fieldId}
              type="text"
              name={name}
              required={required}
              disabled={isSubmitted}
              value={getFieldValue(name, defaultValue)}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={label}
            />
          </div>
        )

      default:
        console.warn(`Unknown field type: ${blockType}`)
        return null
    }
  }

  return (
    <div className={className}>
      {/* Success message (keeps form visible) */}
      {isSubmitted && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start transition-opacity duration-300 ease-in">
          <svg
            className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 
                 7.707 9.293a1 1 0 00-1.414 1.414l2 
                 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800">Form submitted successfully!</p>
            {form.confirmationMessage && (
              <div
                className="mt-1 text-sm text-green-700"
                dangerouslySetInnerHTML={{
                  __html:
                    typeof form.confirmationMessage === 'string' ? form.confirmationMessage : '',
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* The Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields &&
          Array.isArray(form.fields) &&
          form.fields.map((field, index) => renderField(field, index))}

        <button
          type="submit"
          disabled={isSubmitting || isSubmitted}
          className="w-full bg-Teal text-white py-3 px-6 rounded-sm font-medium hover:bg-DarkTeal focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : form.submitButtonLabel || 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default FormRenderer
