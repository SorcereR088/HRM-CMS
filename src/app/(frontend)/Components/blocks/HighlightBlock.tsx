'use client'

import React from 'react'
import { Icon } from '@iconify/react'

interface HighlightItem {
  title: string
  description: string
  id?: string | null
}

interface HighlightsBlockProps {
  heading?: string | null
  subheading?: string | null
  globalIcon: string
  highlights: HighlightItem[]
  backgroundColor?: 'white' | 'gray-50' | 'teal-50' | null
  blockType: 'highlights'
  id?: string | null
  blockName?: string | null
}

const HighlightsBlock: React.FC<HighlightsBlockProps> = ({
  heading,
  subheading,
  globalIcon,
  highlights,
  backgroundColor = 'white',
}) => {
  const bgColor = backgroundColor || 'white'

  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    'teal-50': 'bg-teal-50',
  }[bgColor]

  return (
    <section className={`py-20 px-6 md:px-[140px] ${bgColorClass}`}>
      <div className="max-w-7xl mx-auto">
        {/* Optional Section Header */}
        {(heading || subheading) && (
          <div className="text-center mb-16">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
            )}
            {subheading && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subheading}</p>}
          </div>
        )}

        {/* Highlights Grid - White Cards with Padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
          {highlights.map((highlight, index) => (
            <div
              key={highlight.id || index}
              className="group bg-white p-8 rounded-lg shadow-sm border border-transparent hover:border-Teal hover:bg-teal-50 transition-colors duration-300"
            >
              {/* Icon - Clean Green Circle */}
              <div className="mb-10">
                <div className="w-8 h-8 bg-Teal rounded-full flex items-center justify-center">
                  <Icon icon={globalIcon} className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Content - Clean Typography */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 text-md leading-tight">{highlight.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if no highlights */}
        {(!highlights || highlights.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No highlights to display. Add highlights through the admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default HighlightsBlock
