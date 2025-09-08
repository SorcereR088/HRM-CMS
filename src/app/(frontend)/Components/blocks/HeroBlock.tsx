'use client'

import React from 'react'
import Image from 'next/image'
import TextAmination from '../animation/TextAnimation'
import { Media } from '@/payload-types'

interface HeroBlockProps {
  title: string
  subtitle?: string | null
  backgroundImage?: number | Media | null
  blockType: 'hero'
  id?: string | null
  blockName?: string | null
}

const HeroBlock: React.FC<HeroBlockProps> = ({ title, subtitle, backgroundImage }) => {
  // Handle both populated Media object and unpopulated ID
  const bgImage =
    typeof backgroundImage === 'object' && backgroundImage !== null ? backgroundImage : null

  return (
    <section className="w-full min-h-[80vh] lg:h-[80vh] flex flex-col items-center px-4 sm:px-6 lg:px-6 py-8 sm:py-12 lg:py-20 text-center bg-gradient-to-b from-white to-teal-100 overflow-hidden relative">
      <div className="max-w-4xl z-10 mb-4 sm:mb-6 lg:mb-0">
        <TextAmination>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight px-2">
            {title}
          </h1>
        </TextAmination>
        {subtitle && (
          <TextAmination delay={0.3}>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-2 sm:mb-4 lg:mb-6 leading-relaxed px-2">
              {subtitle}
            </p>
          </TextAmination>
        )}
      </div>

      {bgImage && bgImage.url && (
        <div className="absolute bottom-0 w-full h-[50%] sm:h-[55%] md:h-[60%] lg:h-[65%] overflow-hidden z-0">
          <Image
            src={bgImage.url}
            alt={bgImage.alt || 'Dashboard Preview'}
            fill
            className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto h-full object-cover object-top px-2 sm:px-4 md:px-8 lg:px-12 xl:px-0"
            priority
            sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 80vw"
          />
        </div>
      )}
    </section>
  )
}

export default HeroBlock
