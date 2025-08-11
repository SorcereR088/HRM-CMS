'use client'

import React from 'react'
import Image from 'next/image'
import { Media } from '@/payload-types'
import { Icon } from '@iconify/react'
import * as Lucide from 'lucide-react'

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

interface FeaturesBlockProps {
  heading: string
  subheading?: string | null
  features: FeatureItem[]
  backgroundColor?: 'white' | 'gray-50' | 'teal-50' | null
  blockType: 'features'
  id?: string | null
  blockName?: string | null
}

const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  heading,
  subheading,
  features,
  backgroundColor = 'gray-50',
}) => {
  const bgColor = backgroundColor || 'gray-50'

  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    'teal-50': 'bg-teal-50',
  }[bgColor]

  const renderIcon = (feature: FeatureItem) => {
    const iconSize = 'w-8 h-8'
    const iconWrapper = 'flex-shrink-0 mr-4'

    switch (feature.iconType) {
      case 'upload':
        if (
          feature.iconUpload &&
          typeof feature.iconUpload === 'object' &&
          feature.iconUpload !== null &&
          'url' in feature.iconUpload &&
          feature.iconUpload.url
        ) {
          return (
            <div className={iconWrapper}>
              <Image
                src={feature.iconUpload.url}
                alt={feature.iconUpload.alt || feature.title}
                width={32}
                height={32}
                className={`${iconSize} object-contain`}
              />
            </div>
          )
        }
        break

      case 'url':
        if (feature.iconUrl) {
          return (
            <div className={iconWrapper}>
              <Image
                src={feature.iconUrl}
                alt={feature.title}
                width={32}
                height={32}
                className={`${iconSize} object-contain`}
              />
            </div>
          )
        }
        break

      case 'lucide':
        if (feature.lucideIcon) {
          const IconComponent = (Lucide as any)[feature.lucideIcon]
          if (IconComponent) {
            return (
              <div className={iconWrapper}>
                <IconComponent className={`${iconSize} text-gray-800`} />
              </div>
            )
          }
        }
        break

      case 'iconify':
        if (feature.iconifyIcon) {
          return (
            <div className={iconWrapper}>
              <Icon
                icon={feature.iconifyIcon}
                className={`${iconSize} text-gray-800`}
                style={{ fontSize: '32px' }}
              />
            </div>
          )
        }
        break

      default:
        break
    }

    // Fallback icon
    return (
      <div className={iconWrapper}>
        <div className={`${iconSize} bg-gray-100 rounded flex items-center justify-center`}>
          <span className="text-gray-600 font-bold text-sm">?</span>
        </div>
      </div>
    )
  }

  return (
    <section className={`py-24 px-6 md:px-[140px] ${bgColorClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Heading and Subheading */}
          <div className="lg:sticky lg:top-8 max-w-sm">
            <h2 className="text-4xl md:text-[40px] font-bold text-gray-900 leading-tight mb-6">
              {heading}
            </h2>
            {subheading && <p className="text-lg text-gray-600 leading-tight">{subheading}</p>}
          </div>

          {/* Right Side - Features List */}
          <div className="space-y-12">
            {features.map((feature, index) => (
              <div key={feature.id || index} className="flex items-center space-x-4">
                {renderIcon(feature)}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 leading-tight mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-md leading-tight">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state if no features */}
        {(!features || features.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No features to display. Add features through the admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturesBlock
