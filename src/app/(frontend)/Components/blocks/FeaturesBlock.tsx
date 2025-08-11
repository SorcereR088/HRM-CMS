'use client'

import React from 'react'
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

  return (
    <section className={`py-24 px-6 md:px-[140px] ${bgColorClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Heading and Subheading */}
          <div className="lg:sticky lg:top-24 max-w-sm">
            <h2 className="text-4xl md:text-[40px] font-bold text-gray-900 leading-tight mb-6">
              {heading}
            </h2>
            {subheading && <p className="text-lg text-gray-600 leading-tight">{subheading}</p>}
          </div>

          {/* Right Side - Features List using Features component */}
          <div>
            <Features
              features={features}
              layout="vertical"
              iconSize="md"
              spacing="loose"
              showEmptyState={true}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesBlock
