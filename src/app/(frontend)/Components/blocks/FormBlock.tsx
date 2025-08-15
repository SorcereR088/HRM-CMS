// Enhanced version of FormBlock that can handle unpopulated relationships
'use client'

import React, { useState, useEffect } from 'react'
import { Form } from '@/payload-types'
import FormRenderer from '../FormRenderer'

interface FormBlockProps {
  form: Form | string | number
  enableAjax?: boolean | null
  blockType: 'form-block'
  id?: string | null
  blockName?: string | null
}

const FormBlock: React.FC<FormBlockProps> = ({ form, enableAjax = true }) => {
  const [formData, setFormData] = useState<Form | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If form is already populated (object), use it directly
    if (typeof form === 'object' && form !== null) {
      setFormData(form)
      return
    }

    // If form is an ID (string or number), fetch the form data
    if (typeof form === 'string' || typeof form === 'number') {
      setLoading(true)
      fetchFormData(form)
    }
  }, [form])

  const fetchFormData = async (formId: string | number) => {
    try {
      const response = await fetch(`/api/forms/${formId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData(data)
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

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
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
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 px-4 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </section>
    )
  }

  if (!formData) {
    return (
      <section className="py-12 px-4 max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Form not found or not properly configured.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 max-w-2xl mx-auto">
      <FormRenderer form={formData} className="bg-white p-8 rounded-lg shadow-lg" />
    </section>
  )
}

export default FormBlock
