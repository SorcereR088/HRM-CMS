'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Media } from '@/payload-types'

interface StatItem {
  value: string
  label: string
  id?: string | null
}

interface CTAButton {
  text?: string | null
  url?: string | null
}

interface CompanyInfoBlockProps {
  companyName?: string | null
  logo?: Media | number | null // Accept both Media object and number ID
  illustration?: Media | number | null // Accept both Media object and number ID
  tagline?: string | null
  description?: string | null
  ctaButton?: CTAButton | null
  stats?: StatItem[] | null
  backgroundColor?: 'light-blue' | 'white' | 'gray' | null
  blockType: 'companyInfo'
  id?: string | null
  blockName?: string | null
  [key: string]: any
}

const CompanyInfoBlock: React.FC<CompanyInfoBlockProps> = ({
  companyName = 'CODE BRIGHT',
  logo,
  illustration,
  tagline = 'We would like to call ourselves problem solvers who incorporate software in the process.',
  description = 'Code Bright Pvt. Ltd is a software development company that specializes in building innovative and scalable software solutions for businesses of all sizes. Our team of experienced developers, designers, and project managers work closely with clients to understand their specific needs and provide tailored solutions that help them achieve their business goals. We have been working with clients like Vianet for over 8 years, building a strong track record of delivering reliable and impactful software solutions.',
  ctaButton = { text: 'Contact Us', url: '#contact' },
  stats = [
    { value: '1000+', label: 'active users' },
    { value: '50+', label: 'projects completed' },
    { value: '10', label: 'years in business' },
  ],
  backgroundColor = 'light-blue',
}) => {
  const bgColorClass = {
    'light-blue': 'bg-gradient-to-br from-blue-50 to-indigo-100',
    white: 'bg-white',
    gray: 'bg-gray-50',
  }[backgroundColor || 'light-blue']

  const getMediaUrl = (media: Media | number | null | undefined): string | null => {
    if (!media) return null

    // If it's a number (ID reference), we can't get the URL directly
    if (typeof media === 'number') {
      console.warn('Media is not populated. Expected Media object but got ID:', media)
      return null
    }

    // If it's a string URL
    if (typeof media === 'string') return media

    // If it's a Media object with url property
    if (typeof media === 'object' && media.url) return media.url

    return null
  }

  const getMediaAlt = (media: Media | number | null | undefined): string => {
    if (!media || typeof media === 'number' || typeof media === 'string') {
      return 'Image'
    }
    return media.alt || 'Image'
  }

  return (
    <section className={`${bgColorClass} relative overflow-hidden py-16 lg:py-20`}>
      <div className="max-w-8xl mx-auto px-12 sm:px-8 lg:px-[140px] grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left Content */}
        <div className="space-y-6">
          {/* Logo or Company Name */}
          <div className="mb-8">
            {logo && getMediaUrl(logo) ? (
              <img
                src={getMediaUrl(logo) || ''}
                alt={getMediaAlt(logo)}
                className="h-12 sm:h-14 lg:h-24 w-auto object-contain"
              />
            ) : companyName ? (
              companyName.includes('CODE BRIGHT') ? (
                <div>
                  <div className="text-base sm:text-lg font-semibold tracking-wide">
                    <span className="text-gray-700">CODE</span>
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    <span className="text-yellow-500">BRIGHT</span>
                  </div>
                </div>
              ) : (
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
                  {companyName}
                </h1>
              )
            ) : (
              <div className="h-12 sm:h-14 lg:h-16 w-32 sm:w-36 lg:w-40 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                No Logo Provided
              </div>
            )}
          </div>

          {/* Tagline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-8">
            {tagline}
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{description}</p>

          {/* CTA Button */}
          {ctaButton?.text && (
            <div className="pt-2">
              <a
                href={ctaButton.url || '#'}
                className="inline-flex items-center gap-2 text-gray-900 font-semibold text-base sm:text-lg hover:text-teal-600 hover:underline transition-colors group"
              >
                {ctaButton.text}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          )}
        </div>

        {/* Right Illustration */}
        {illustration && getMediaUrl(illustration) && (
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] xl:w-[480px] xl:h-[480px]">
              <img
                src={getMediaUrl(illustration) || ''}
                alt={getMediaAlt(illustration)}
                className="w-full h-full object-contain animate-float"
              />
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="max-w-8xl mx-auto px-12 sm:px-8 lg:px-[140px]">
        <hr className="w-full border-gray-200 mt-16 lg:mt-20" />
      </div>

      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <div className="max-w-8xl mx-auto px-12 sm:px-8 lg:px-[140px] mt-16 lg:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {stats.map((stat, index) => (
              <div key={stat.id || index} className="text-center md:text-left">
                <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 leading-none">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-base sm:text-lg font-normal">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Animation CSS */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(1deg);
          }
          50% {
            transform: translateY(-4px) rotate(-0.5deg);
          }
          75% {
            transform: translateY(-12px) rotate(0.5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default CompanyInfoBlock
