'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Media, Form } from '@/payload-types'
import FormRenderer from '../FormRenderer'
import { Icon } from '@iconify/react'
import { LucideProps } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import TextAnimation from '../animation/TextAnimation'

// Contact item interface for icon logic
interface ContactItem {
  label: string
  value: string
  iconType: 'upload' | 'url' | 'lucide' | 'iconify'
  iconUpload?: number | Media | null
  iconUrl?: string | null
  lucideIcon?: string | null
  iconifyIcon?: string | null
}

// Block props interface
interface ContactUsBlockProps {
  heading?: string | null
  description?: string | null
  contactInfo?: ContactItem[] | null
  formHeading?: string | null
  backgroundColor?: 'white' | 'gray-50' | null
  blockType: 'contact-us'
  id?: string | null
  blockName?: string | null
  form?: Form | number | string | null
}

const iconSize = 22

const getMediaUrl = (media: Media | number | null | undefined): string | null => {
  if (!media) return null
  if (typeof media === 'number') return null
  if (typeof media === 'string') return media
  if (typeof media === 'object' && media.url) return media.url
  return null
}

const getMediaAlt = (media: Media | number | null | undefined, fallback: string): string => {
  if (!media || typeof media === 'number' || typeof media === 'string') {
    return fallback
  }
  return media.alt || fallback
}

const renderIcon = (item: ContactItem) => {
  switch (item.iconType) {
    case 'upload':
      const uploadUrl = getMediaUrl(item.iconUpload)
      if (uploadUrl) {
        return (
          <Image
            src={uploadUrl}
            alt={getMediaAlt(item.iconUpload, item.label + ' icon')}
            width={iconSize}
            height={iconSize}
            className="inline-block mr-3"
          />
        )
      }
      return null

    case 'url':
      if (item.iconUrl) {
        return (
          <Image
            src={item.iconUrl}
            alt={item.label + ' icon'}
            width={iconSize}
            height={iconSize}
            className="inline-block mr-3"
          />
        )
      }
      return null

    case 'lucide':
      if (item.lucideIcon) {
        const iconKey = item.lucideIcon as keyof typeof LucideIcons
        const IconComponent = LucideIcons[iconKey] as React.ComponentType<LucideProps>
        if (IconComponent && typeof IconComponent === 'function') {
          return (
            <span className="inline-block mr-3 text-gray-900">
              <IconComponent size={iconSize} />
            </span>
          )
        }
      }
      return null

    case 'iconify':
      if (item.iconifyIcon) {
        return (
          <span className="inline-block mr-3">
            <Icon
              icon={item.iconifyIcon}
              width={iconSize}
              height={iconSize}
              className="text-gray-900"
            />
          </span>
        )
      }
      return null

    default:
      return null
  }
}

const ContactUsBlock: React.FC<ContactUsBlockProps> = ({
  heading = 'Get in touch with us',
  description = '',
  contactInfo = [],
  formHeading = "Fill out the form and we'll reach you out soon",
  backgroundColor = 'gray-50',
  form,
}) => {
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
      const response = await fetch(`/api/forms/${formId}?depth=2`)
      if (response.ok) {
        const data = await response.json()
        setFormData(data)
      } else {
        setError(`Failed to load form`)
      }
    } catch (_error) {
      setError(`Unable to load form`)
    } finally {
      setLoading(false)
    }
  }

  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
  }[backgroundColor || 'gray-50']

  return (
    <section className={`py-8 sm:py-12 lg:py-20 ${bgColorClass}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-[140px]">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-8">
          {/* Title and Description */}
          <div>
            {heading && (
              <TextAnimation>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 leading-tight">
                  {heading}
                </h2>
              </TextAnimation>
            )}
            <TextAnimation delay={0.2}>
              {description && (
                <p className="text-base text-gray-600 mb-6 leading-relaxed">{description}</p>
              )}
            </TextAnimation>
          </div>

          {/* Form */}
          <div>
            <div className="bg-white p-3 rounded-sm shadow-sm">
              {formHeading && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{formHeading}</h3>
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

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo &&
              contactInfo.length > 0 &&
              contactInfo.map((item, idx) => (
                <TextAnimation key={idx} delay={0.3 + idx * 0.1}>
                  <div className="flex items-center gap-2">
                    {renderIcon(item)}
                    <div>
                      <div className="font-medium text-gray-800">{item.label}</div>
                      <div className="text-gray-700">{item.value}</div>
                    </div>
                  </div>
                </TextAnimation>
              ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-2 gap-24">
          {/* Left Column - Contact Info */}
          <div className="flex flex-col justify-start">
            {heading && (
              <TextAnimation>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 leading-tight max-w-2xl">
                  {heading}
                </h2>
              </TextAnimation>
            )}
            <TextAnimation delay={0.2}>
              {description && (
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{description}</p>
              )}
            </TextAnimation>
            <div className="space-y-7">
              {contactInfo &&
                contactInfo.length > 0 &&
                contactInfo.map((item, idx) => (
                  <TextAnimation key={idx} delay={0.3 + idx * 0.1}>
                    <div className="flex items-center gap-2">
                      {renderIcon(item)}
                      <div>
                        <div className="font-medium text-gray-800">{item.label}</div>
                        <div className="text-gray-700">{item.value}</div>
                      </div>
                    </div>
                  </TextAnimation>
                ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-white p-8 rounded-sm shadow-sm">
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
      </div>
    </section>
  )
}

export default ContactUsBlock
