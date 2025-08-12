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

interface FeaturesProps {
  features: FeatureItem[]
  layout?: 'vertical' | 'grid' | 'horizontal'
  iconSize?: 'sm' | 'md' | 'lg'
  spacing?: 'tight' | 'normal' | 'loose'
  showEmptyState?: boolean
  className?: string
}

const Features: React.FC<FeaturesProps> = ({
  features,
  layout = 'vertical',
  iconSize = 'md',
  spacing = 'normal',
  showEmptyState = true,
  className = '',
}) => {
  // Icon size mapping
  const iconSizes = {
    sm: { size: 'w-6 h-6', width: 24, height: 24 },
    md: { size: 'w-8 h-8', width: 32, height: 32 },
    lg: { size: 'w-12 h-12', width: 48, height: 48 },
  }

  // Spacing mapping
  const spacingClasses = {
    tight: 'space-y-6',
    normal: 'space-y-8',
    loose: 'space-y-12',
  }

  // Layout classes
  const layoutClasses = {
    vertical: 'space-y-8',
    grid: 'grid grid-cols-1 sm:grid-cols-2 gap-8',
    horizontal: 'flex flex-wrap gap-6',
  }

  const renderIcon = (feature: FeatureItem) => {
    const { size, width, height } = iconSizes[iconSize]
    const iconWrapper = 'flex-shrink-0'

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
                width={width}
                height={height}
                className={`${size} object-contain`}
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
                width={width}
                height={height}
                className={`${size} object-contain`}
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
                <IconComponent className={`${size} text-gray-800`} />
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
                className={`${size} text-gray-800`}
                style={{ fontSize: `${width}px` }}
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
        <div className={`${size} bg-gray-100 rounded flex items-center justify-center`}>
          <span className="text-gray-600 font-bold text-sm">?</span>
        </div>
      </div>
    )
  }

  const renderFeature = (feature: FeatureItem, index: number) => {
    const baseClasses =
      layout === 'vertical'
        ? 'flex items-center space-x-8 '
        : 'flex flex-col items-center text-center space-y-3'

    return (
      <div key={feature.id || index} className={baseClasses}>
        {renderIcon(feature)}
        <div className={layout === 'vertical' ? 'flex-1' : 'flex-1'}>
          <h3 className="text-xl font-semibold text-gray-900 leading-tight mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 leading-tight">{feature.description}</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!features || features.length === 0) {
    if (!showEmptyState) return null

    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">
          No features to display. Add features through the admin panel.
        </p>
      </div>
    )
  }

  return (
    <div
      className={`${layout === 'vertical' ? spacingClasses[spacing] : layoutClasses[layout]} ${className}`}
    >
      {features.map((feature, index) => renderFeature(feature, index))}
    </div>
  )
}

export default Features
