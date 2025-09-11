'use client'

import React from 'react'
import Features from '../Features'
import TextAmination from '../animation/TextAnimation'
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
  id: _id,
}) => {
  const bgColor = backgroundColor || 'gray-50'

  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    'teal-50': 'bg-teal-50',
  }[bgColor]

  return (
    <section
      id="features"
      className={`py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 xl:px-20 ${bgColorClass}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Heading and Subheading */}
          <div className="lg:sticky lg:top-80 max-w-xl">
            <TextAmination>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-4">
                {heading}
              </h2>
            </TextAmination>
            {subheading && (
              <TextAmination delay={0.2}>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{subheading}</p>
              </TextAmination>
            )}
          </div>

          {/* Right Side - Features List */}

          <Features
            features={features}
            layout="vertical"
            iconSize="md"
            spacing="loose"
            showEmptyState={true}
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturesBlock
