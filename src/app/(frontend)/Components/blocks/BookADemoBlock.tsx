'use client'

import React, { useState } from 'react'
import Features from '../Features'
import { Media, Form } from '@/payload-types'

interface FeatureItem {
  title: string
  description: string
  iconType: 'upload' | 'url' | 'lucide' | 'iconify'
  iconUpload?: number | Media | null
  iconUrl?: string | null
  lucideIcon?: string | null
  iconifyIcon?: string | null
  id?: string | null
}

interface BookADemoBlockProps {
  heading?: string | null
  description?: string | null
  features?: FeatureItem[] | null
  formHeading?: string | null
  backgroundColor?: 'white' | 'gray-50' | null
  blockType: 'book-demo'
  id?: string | null
  blockName?: string | null
  // Add form relationship
  form?: Form | number | string | null
}

const BookADemoBlock: React.FC<BookADemoBlockProps> = ({
  heading = 'Experience YAK HRM in action',
  description = '',
  features = [],
  formHeading = "Fill out the form and we'll reach you out soon",
  backgroundColor = 'white',
  form, // Form from PayloadCMS
}) => {
  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
  }[backgroundColor || 'white']

  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Get form data (handle both populated form object and form ID)
  const formObject = typeof form === 'object' && form !== null ? form : null
  const formId = typeof form === 'object' && form !== null ? form.id : form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Dynamic validation based on form fields if available
    if (formObject?.fields) {
      formObject.fields.forEach((field: any) => {
        const fieldName = field.name
        const fieldValue = formData[fieldName]

        if (field.required) {
          // Handle different field types for required validation
          if (field.blockType === 'checkbox') {
            if (!fieldValue) {
              newErrors[fieldName] = `${field.label || fieldName} must be checked`
            }
          } else if (!fieldValue || (typeof fieldValue === 'string' && !fieldValue.trim())) {
            newErrors[fieldName] = `${field.label || fieldName} is required`
          }
        }

        // Email validation
        if (field.blockType === 'email' && fieldValue && !validateEmail(fieldValue)) {
          newErrors[fieldName] = 'Please enter a valid email address'
        }

        // Number validation
        if (field.blockType === 'number' && fieldValue && isNaN(Number(fieldValue))) {
          newErrors[fieldName] = 'Please enter a valid number'
        }
      })
    } else {
      // Fallback to hardcoded validation
      if (!formData.fullName?.trim()) {
        newErrors.fullName = 'Full name is required'
      }
      if (!formData.phoneNumber?.trim()) {
        newErrors.phoneNumber = 'Phone number is required'
      }
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required'
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
      if (!formData.companyName?.trim()) {
        newErrors.companyName = 'Company name is required'
      }
      if (!formData.companySize) {
        newErrors.companySize = 'Company size is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId, // Use the form ID from PayloadCMS
          submissionData: formData,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({})
        setErrors({})

        // Handle redirect if specified in form
        if (formObject?.redirect) {
          setTimeout(() => {
            // Handle both string URLs and Payload CMS redirect objects
            const redirectUrl = typeof formObject.redirect === 'string' 
              ? formObject.redirect 
              : formObject.redirect?.url || null
              
            if (redirectUrl) {
              window.location.href = redirectUrl
            }
          }, 2000)
        }
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to submit form. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to style the heading with green YAK and HRM
  const renderStyledHeading = (text: string) => {
    const parts = text.split(/(\bYAK\b|\bHRM\b)/g)
    return parts.map((part, index) => {
      if (part === 'YAK' || part === 'HRM') {
        return (
          <span key={index} className="text-green-600 text-3xl sm:text-4xl lg:text-5xl font-bold">
            {part}
          </span>
        )
      }
      return part
    })
  }

  // Render dynamic form fields if form is available
  const renderFormFields = () => {
    if (formObject?.fields && Array.isArray(formObject.fields)) {
      return formObject.fields.map((field: any, index: number) => {
        const fieldName = field.name || `field-${index}`
        const fieldId = `${fieldName}-${index}`

        switch (field.blockType) {
          case 'text':
          case 'email':
          case 'phone':
            return (
              <div key={index}>
                <input
                  id={fieldId}
                  type={
                    field.blockType === 'email'
                      ? 'email'
                      : field.blockType === 'phone'
                        ? 'tel'
                        : 'text'
                  }
                  name={fieldName}
                  value={formData[fieldName] || ''}
                  onChange={handleChange}
                  placeholder={`${field.label}${field.required ? '*' : ''}`}
                  className={`w-full p-3 border rounded-lg ${
                    errors[fieldName] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required={field.required}
                />
                {errors[fieldName] && (
                  <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
                )}
              </div>
            )

          case 'textarea':
            return (
              <div key={index}>
                <textarea
                  id={fieldId}
                  name={fieldName}
                  value={formData[fieldName] || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }))
                  }
                  placeholder={`${field.label}${field.required ? '*' : ''}`}
                  rows={4}
                  className={`w-full p-3 border rounded-lg ${
                    errors[fieldName] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required={field.required}
                />
                {errors[fieldName] && (
                  <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
                )}
              </div>
            )

          case 'select':
            return (
              <div key={index}>
                <select
                  id={fieldId}
                  name={fieldName}
                  value={formData[fieldName] || ''}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    errors[fieldName] ? 'border-red-500' : 'border-gray-300'
                  } ${!formData[fieldName] ? 'text-gray-500' : 'text-gray-900'}`}
                  required={field.required}
                >
                  <option value="">
                    {field.label}
                    {field.required ? '*' : ''}
                  </option>
                  {field.options?.map((option: any, idx: number) => (
                    <option key={idx} value={option.value} className="text-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors[fieldName] && (
                  <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
                )}
              </div>
            )

          case 'number':
            return (
              <div key={index}>
                <input
                  id={fieldId}
                  type="number"
                  name={fieldName}
                  value={formData[fieldName] || ''}
                  onChange={handleChange}
                  placeholder={`${field.label}${field.required ? '*' : ''}`}
                  className={`w-full p-3 border rounded-lg ${
                    errors[fieldName] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required={field.required}
                />
                {errors[fieldName] && (
                  <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
                )}
              </div>
            )

          case 'checkbox':
            return (
              <div key={index} className="flex items-start space-x-3">
                <input
                  id={fieldId}
                  type="checkbox"
                  name={fieldName}
                  checked={formData[fieldName] || false}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [fieldName]: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 text-Teal focus:ring-Teal border-gray-300 rounded"
                  required={field.required}
                />
                <label htmlFor={fieldId} className="text-sm text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {errors[fieldName] && (
                  <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
                )}
              </div>
            )

          default:
            return null
        }
      })
    }

    // Fallback to hardcoded fields if no form is configured
    return (
      <>
        <div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            placeholder="Full Name*"
            className={`w-full p-3 border rounded-lg ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            placeholder="Phone Number*"
            className={`w-full p-3 border rounded-lg ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Email*"
            className={`w-full p-3 border rounded-lg ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ''}
            onChange={handleChange}
            placeholder="Company Name*"
            className={`w-full p-3 border rounded-lg ${
              errors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
        </div>

        <div>
          <select
            name="companySize"
            value={formData.companySize || ''}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.companySize ? 'border-red-500' : 'border-gray-300'
            } ${!formData.companySize ? 'text-gray-500' : 'text-gray-900'}`}
          >
            <option value="">Select Company Size*</option>
            <option value="0-5">0-5 Employees</option>
            <option value="6-20">6-20 Employees</option>
            <option value="21-50">21-50 Employees</option>
            <option value="51-100">51-100 Employees</option>
            <option value="101-500">101-500 Employees</option>
            <option value="500+">500+ Employees</option>
          </select>
          {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}
        </div>
      </>
    )
  }

  // Show success message
  if (isSubmitted) {
    return (
      <section className={`py-16 lg:py-20 ${bgColorClass}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-[140px]">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="h-12 w-12 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-green-800 mb-2">Thank you!</h3>
            <p className="text-green-700">
              {formObject?.confirmationMessage ? (
                // Handle Payload CMS rich text format properly
                typeof formObject.confirmationMessage === 'string' ? (
                  formObject.confirmationMessage
                ) : (
                  "Your demo has been booked successfully. We'll reach out to you soon!"
                )
              ) : (
                "Your demo has been booked successfully. We'll reach out to you soon!"
              )}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 lg:py-20 ${bgColorClass}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-[140px] grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Features */}
        <div>
          {heading && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {renderStyledHeading(heading)}
            </h2>
          )}
          {description && (
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{description}</p>
          )}
          {features && features.length > 0 && (
            <Features features={features} layout="vertical" iconSize="md" spacing="normal" />
          )}
        </div>

        {/* Right Column - Form */}
        <div>
          <div className="bg-white p-8 rounded-md">
            {formHeading && (
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{formHeading}</h3>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderFormFields()}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-Teal text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Book a demo'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookADemoBlock
