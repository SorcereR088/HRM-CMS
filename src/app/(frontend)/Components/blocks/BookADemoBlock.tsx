'use client'

import React, { useState, useEffect } from 'react'
import Features from '../Features'
import FormRenderer from '../FormRenderer'
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
  form?: Form | number | string | null
}

const BookADemoBlock: React.FC<BookADemoBlockProps> = ({
  heading = 'Experience YAK HRM in action',
  description = '',
  features = [],
  formHeading = "Fill out the form and we'll reach you out soon",
  backgroundColor = 'white',
  form,
}) => {
  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
  }[backgroundColor || 'white']

  const [formData, setFormData] = useState<Form | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('BookADemoBlock: form prop received:', form)

    // If form is already populated (object), use it directly
    if (typeof form === 'object' && form !== null) {
      console.log('BookADemoBlock: Using form object directly')
      setFormData(form)
      return
    }

    // If form is an ID (string or number), fetch the form data
    if (typeof form === 'string' || typeof form === 'number') {
      console.log('BookADemoBlock: Fetching form by ID:', form)
      setLoading(true)
      fetchFormData(form)
    }
  }, [form])

  const fetchFormData = async (formId: string | number) => {
    try {
      console.log('Fetching form data for ID:', formId)
      // Use PayloadCMS's built-in API endpoint
      const response = await fetch(`/api/forms/${formId}?depth=2`)

      console.log('Form fetch response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Form data received:', data)
        setFormData(data)
      } else {
        const errorText = await response.text()
        console.error('Form fetch failed:', response.status, errorText)
        setError(`Failed to load form`)
      }
    } catch (err) {
      console.error('Error fetching form:', err)
      setError(`Unable to load form`)
    } finally {
      setLoading(false)
    }
  }

  // Function to style the heading with green YAK and HRM
  const renderStyledHeading = (text: string) => {
    const parts = text.split(/(\bYAK\b|\bHRM\b)/g)
    return parts.map((part, index) => {
      if (part === 'YAK' || part === 'HRM') {
        return (
          <span key={index} className="text-Teal text-3xl sm:text-4xl lg:text-5xl font-bold">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <section className={`py-16 lg:py-20 ${bgColorClass}`}>
      <div className="max-w-8xl mx-auto px-12 sm:px-8 lg:px-[140px] grid grid-cols-1 lg:grid-cols-2 gap-64">
        {/* Left Column - Features */}
        <div className="">
          {heading && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-20">
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
          <div className="bg-white p-8 rounded-sm">
            {formHeading && (
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{formHeading}</h3>
            )}

            {loading && (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-300 rounded"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">An error has occurred.</p>
              </div>
            )}

            {formData && !loading && !error && <FormRenderer form={formData} />}

            {!formData && !loading && !error && !form && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">Select Form</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Choose a form created with the Form Builder plugin. Leave empty to use default
                  fields.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookADemoBlock
