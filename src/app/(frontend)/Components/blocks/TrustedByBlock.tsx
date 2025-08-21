import React from 'react'
import Image from 'next/image'
import { Media } from '@/payload-types'

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

      {/* Logos */}
      {logos && logos.length > 0 && (
        <div className="mt-10 flex flex-wrap justify-center items-center gap-12">
          {logos.map((logoItem, index) => {
            // Check if logo is a populated Media object
            const isLogoPopulated =
              typeof logoItem.logo === 'object' && logoItem.logo !== null && 'url' in logoItem.logo

            if (!isLogoPopulated) {
              return null // Skip unpopulated logos
            }

            const logo = logoItem.logo

            return (
              <Image
                key={logoItem.id || index}
                src={
                  typeof logo === 'object' && 'url' in logo && logo.url
                    ? logo.url
                    : '/placeholder.png'
                }
                alt={
                  typeof logo === 'object' && 'alt' in logo && logo.alt
                    ? logo.alt
                    : `Logo ${index + 1}`
                }
                width={200}
                height={80}
                className="h-14 sm:h-16 md:h-20 object-contain"
              />
            )
          })}
        </div>
      )}

      {/* Show message if no logos are available */}
      {(!logos ||
        logos.length === 0 ||
        !logos.some((item) => typeof item.logo === 'object' && item.logo !== null)) && (
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
