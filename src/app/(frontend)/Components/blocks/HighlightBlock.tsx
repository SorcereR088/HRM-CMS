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

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div
              key={highlight.id || index}
              className="group p-6 bg-white rounded-lg hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon icon={globalIcon} className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
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
