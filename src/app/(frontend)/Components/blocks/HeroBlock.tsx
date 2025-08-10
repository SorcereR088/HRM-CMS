import React from 'react'
import Image from 'next/image'
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
    <section className="w-full h-[80vh] flex flex-col items-center px-6 py-20 text-center bg-gradient-to-b from-white to-teal-100 overflow-hidden relative">
      <div className="max-w-4xl z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
        {subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6">{subtitle}</p>
        )}
      </div>

      {bgImage && bgImage.url && (
        <div className="absolute bottom-0 w-full h-[65%] overflow-hidden z-0">
          <Image
            src={bgImage.url}
            alt={bgImage.alt || 'Dashboard Preview'}
            fill
            className="w-full max-w-6xl mx-auto h-full object-cover object-top px-6 sm:px-12 md:px-20 lg:px-0"
            priority
          />
        </div>
      )}
    </section>
  )
}

export default HeroBlock
