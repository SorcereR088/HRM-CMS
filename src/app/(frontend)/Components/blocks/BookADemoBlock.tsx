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

  const [form, setForm] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch('/api/forms/3') // Form ID 3 as specified
        if (response.ok) {
          const formData = await response.json()
          setForm(formData)
        } else {
          setError('Failed to load form')
        }
      } catch (err) {
        setError('Error loading form')
        console.error('Error fetching form:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [])

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
            
            {loading && (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {form && !loading && !error && (
              <FormRenderer form={form} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookADemoBlock
