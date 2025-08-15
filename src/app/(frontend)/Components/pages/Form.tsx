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

interface BookDemoBlockProps {
  heading?: string | null
  description?: string | null
  features?: FeatureItem[] | null
  formHeading?: string | null
  backgroundColor?: 'white' | 'gray-50' | null
  blockType: 'book-demo'
  id?: string | null
  blockName?: string | null
}

const BookDemoBlock: React.FC<BookDemoBlockProps> = ({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: 'book-demo', // Ensure this matches your form's slug
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
      } else {
        console.error('Failed to book demo:', response.statusText)
      }
    } catch (error) {
      console.error('Error booking demo:', error)
    }
  }

  return (
    <section className={`py-16 lg:py-20 ${bgColorClass}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-[140px] grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Features */}
        <div>
          {heading && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {heading}
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
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name*"
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number*"
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email*"
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company Name*"
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                placeholder="Company Size*"
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
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

export default BookDemoBlock
