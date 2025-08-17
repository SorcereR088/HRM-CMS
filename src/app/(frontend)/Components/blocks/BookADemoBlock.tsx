'use client'

import React, { useState } from 'react'
import Features from '../Features'
import { Media } from '@/payload-types'

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
}

const BookADemoBlock: React.FC<BookADemoBlockProps> = ({
  heading = 'Experience YAK HRM in action',
  description = '',
  features = [],
  formHeading = "Fill out the form and we'll reach you out soon",
  backgroundColor = 'white',
}) => {
  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
  }[backgroundColor || 'white']

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    companyName: '',
    companySize: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const companyOptions = [
    { value: '', label: 'Select Company Size*' },
    { value: '0-5', label: '0-5 Employees' },
    { value: '6-20', label: '6-20 Employees' },
    { value: '21-50', label: '21-50 Employees' },
    { value: '51-100', label: '51-100 Employees' },
    { value: '101-500', label: '101-500 Employees' },
    { value: '500+', label: '500+ Employees' },
  ]

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: 'book-demo',
          submissionData: formData,
        }),
      })
      
      if (response.ok) {
        alert('Demo booked successfully!')
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          companyName: '',
          companySize: '',
        })
        setErrors({})
      } else {
        console.error('Failed to book demo:', response.statusText)
        alert('Failed to book demo. Please try again.')
      }
    } catch (error) {
      console.error('Error booking demo:', error)
      alert('An error occurred. Please try again.')
    }
  }

  // Function to style the heading with green YAK and HRM
  const renderStyledHeading = (text: string) => {
    const parts = text.split(/(\bYAK\b|\bHRM\b)/g)
    return parts.map((part, index) => {
      if (part === 'YAK' || part === 'HRM') {
        return (
          <span key={index} className="text-green-600">
            {part}
          </span>
        )
      }
      return part
    })
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
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            {formHeading && (
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{formHeading}</h3>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
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
                  value={formData.phoneNumber}
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
                  value={formData.email}
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
                  value={formData.companyName}
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
                  value={formData.companySize}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${
                    errors.companySize ? 'border-red-500' : 'border-gray-300'
                  } ${!formData.companySize ? 'text-gray-500' : 'text-gray-900'}`}
                >
                  {companyOptions.map((option) => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="text-gray-900"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Book a demo
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookADemoBlock