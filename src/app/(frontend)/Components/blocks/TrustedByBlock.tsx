'use client'

import React from 'react'
import Image from 'next/image'
import { Media } from '@/payload-types'
import { motion } from 'framer-motion'

interface TrustedByBlockProps {
  preText: string
  highlightText: string
  postText: string
  subtitle?: string | null
  logos: Array<{
    logo: number | Media
    id?: string | null
  }>
  blockType: 'trusted-by'
  id?: string | null
  blockName?: string | null
}

const TrustedByBlock: React.FC<TrustedByBlockProps> = ({
  preText,
  highlightText,
  postText,
  subtitle,
  logos,
}) => {
  // Filter valid logos
  const validLogos = logos.filter(
    (logoItem) =>
      typeof logoItem.logo === 'object' && logoItem.logo !== null && 'url' in logoItem.logo,
  ) as { logo: Media; id?: string | null }[]

  return (
    <section className="px-4 py-24 text-center bg-white w-full items-center">
      <h2 className="text-2xl sm:text-3xl md:text-[40px] font-medium max-w-[700px] mx-auto">
        {preText}{' '}
        <span className="text-Teal font-bold text-2xl sm:text-3xl md:text-[40px]">
          {highlightText}
        </span>{' '}
        {postText}
      </h2>

      {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}

      {/* Desktop / Larger Screens: Static Grid */}
      {validLogos.length > 0 && (
        <>
          <div className="hidden md:flex mt-10 flex-wrap justify-center items-center gap-12">
            {validLogos.map((logoItem, index) => (
              <Image
                key={logoItem.id || index}
                src={logoItem.logo.url || '/placeholder.png'}
                alt={logoItem.logo.alt || `Logo ${index + 1}`}
                width={200}
                height={80}
                className="h-14 sm:h-16 md:h-20 object-contain"
              />
            ))}
          </div>
          {/* Mobile / Tablet: Infinite Scrolling Logos */}
          <div className="md:hidden mt-10 overflow-hidden relative w-full">
            <motion.div
              className="flex gap-12"
              animate={{ x: ['0%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            >
              {[...validLogos, ...validLogos].map((logoItem, index) => (
                <Image
                  key={`${logoItem.id || 'logo'}-${index}`} // ✅ now unique
                  src={logoItem.logo.url || '/placeholder.png'}
                  alt={logoItem.logo.alt || `Logo ${index + 1}`}
                  width={150}
                  height={60}
                  className="h-12 sm:h-14 object-contain"
                />
              ))}
            </motion.div>
          </div>
        </>
      )}

      {/* Show message if no logos are available */}
      {validLogos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No company logos to display. Add logos through the admin panel.
          </p>
        </div>
      )}
    </section>
  )
}

export default TrustedByBlock
