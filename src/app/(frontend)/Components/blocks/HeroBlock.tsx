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
    <section className="w-full min-h-[80vh] lg:h-[95vh] flex flex-col items-center px-4 lg:px-6 py-8 sm:py-12 lg:py-20 text-center bg-gradient-to-b from-white to-teal-100 overflow-hidden relative">
      {/* Content Container */}
      <div className="max-w-6xl z-10 mb-4">
        {/* Title */}
        <TextAmination>
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-medium text-gray-900 mb-2 lg:mb-4 leading-tight px-2">
            {title}
          </h1>
        </TextAmination>

        {/* Subtitle */}
        {subtitle && (
          <TextAmination delay={0.3}>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-2 sm:mb-4 lg:mb-6 leading-relaxed px-2">
              {subtitle}
            </p>
          </TextAmination>
        )}
      </div>

      {/* Background Image */}
      {bgImage && bgImage.url && (
        <div className="absolute bottom-0 left-0 right-0 z-10 h-[50%] sm:h-[30%] md:h-[60%] lg:h-[80%] flex justify-center items-end md:px-8 lg:px-12 xl:px-0">
          <div className="relative w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-7xl h-full">
            <Image
              src={bgImage.url}
              alt={bgImage.alt || 'Dashboard Preview'}
              fill
              className="object-cover object-top scale-125 sm:scale-110 md:scale-110 lg:scale-100"
              priority
              sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 80vw"
            />
          </div>
        </div>
      )}

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-teal-200/40 via-teal-100/20 to-transparent pointer-events-none z-20"></div>

      {/* Additional subtle glow layers for depth */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-24 bg-gradient-radial from-teal-300/30 via-teal-200/15 to-transparent rounded-full blur-xl pointer-events-none z-20"></div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  )
}

export default HeroBlock
