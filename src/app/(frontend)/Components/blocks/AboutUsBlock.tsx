'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'

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

  return (
    <section className={`${bgColorClass} relative overflow-hidden py-20`}>
      {/* Floating Astronaut Illustration */}
      <div className="absolute top-8 right-8 lg:top-12 lg:right-16 xl:right-32 pointer-events-none">
        <div className="relative w-80 h-80 lg:w-96 lg:h-96">
          {/* Astronaut Body - Main blue circle */}
          <div className="absolute top-16 right-16 w-32 h-40 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-90 transform rotate-12">
            {/* Helmet */}
            <div className="absolute -top-4 left-2 w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full border-4 border-white opacity-95">
              {/* Helmet reflection */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full opacity-60"></div>
            </div>
            {/* Arms */}
            <div className="absolute -left-6 top-8 w-16 h-6 bg-blue-500 rounded-full transform -rotate-30"></div>
            <div className="absolute -right-4 top-6 w-14 h-6 bg-blue-500 rounded-full transform rotate-45"></div>
            {/* Legs */}
            <div className="absolute -bottom-8 left-4 w-8 h-20 bg-blue-500 rounded-full transform rotate-12"></div>
            <div className="absolute -bottom-6 right-6 w-8 h-18 bg-blue-500 rounded-full transform -rotate-20"></div>
          </div>

          {/* Yellow rectangular elements */}
          <div
            className="absolute top-20 left-12 w-8 h-12 bg-yellow-400 rounded transform rotate-12 animate-float"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="absolute top-32 left-4 w-10 h-6 bg-yellow-400 rounded transform -rotate-12 animate-float"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-24 left-8 w-6 h-8 bg-yellow-400 rounded transform rotate-45 animate-float"
            style={{ animationDelay: '2s' }}
          ></div>

          {/* Blue chart/graph elements */}
          <div
            className="absolute top-12 left-20 w-12 h-8 bg-blue-400 rounded opacity-80 animate-float"
            style={{ animationDelay: '0.5s' }}
          >
            {/* Simple bar chart lines */}
            <div className="flex items-end h-full p-1 gap-1">
              <div className="bg-white w-1 h-2 rounded-sm"></div>
              <div className="bg-white w-1 h-4 rounded-sm"></div>
              <div className="bg-white w-1 h-3 rounded-sm"></div>
              <div className="bg-white w-1 h-5 rounded-sm"></div>
            </div>
          </div>

          {/* Floating screens/devices */}
          <div
            className="absolute top-6 right-4 w-16 h-12 bg-white border-2 border-blue-300 rounded-lg shadow-lg animate-float transform rotate-12"
            style={{ animationDelay: '1.5s' }}
          >
            <div className="p-2">
              <div className="w-full h-2 bg-blue-200 rounded mb-1"></div>
              <div className="w-3/4 h-1 bg-blue-300 rounded"></div>
            </div>
          </div>

          {/* Orbital rings and planets */}
          <div
            className="absolute top-2 right-8 w-20 h-20 border-2 border-blue-300 rounded-full opacity-40 animate-spin"
            style={{ animationDuration: '20s' }}
          ></div>
          <div className="absolute top-0 right-6 w-4 h-4 bg-blue-400 rounded-full opacity-70"></div>

          <div
            className="absolute bottom-8 left-0 w-16 h-16 border-2 border-purple-300 rounded-full opacity-30 animate-spin"
            style={{ animationDuration: '15s' }}
          ></div>
          <div className="absolute bottom-6 left-2 w-3 h-3 bg-purple-400 rounded-full opacity-60"></div>

          {/* Small floating dots */}
          <div className="absolute top-36 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce"></div>
          <div
            className="absolute bottom-20 right-12 w-3 h-3 bg-yellow-400 rounded-full opacity-70 animate-bounce"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-24 left-0 w-2 h-2 bg-purple-400 rounded-full opacity-50 animate-bounce"
            style={{ animationDelay: '2s' }}
          ></div>

          {/* Additional small circles */}
          <div className="absolute top-4 left-16 w-6 h-6 border-2 border-blue-400 rounded-full opacity-40 animate-pulse"></div>
          <div
            className="absolute bottom-4 right-0 w-8 h-8 border-2 border-yellow-400 rounded-full opacity-30 animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-6 max-w-xl">
            {/* Company Name - exactly matching the image */}
            <div className="space-y-1">
              <div className="text-lg font-semibold tracking-wide">
                <span className="text-gray-700">CODE</span>
              </div>
              <div className="text-5xl font-bold tracking-tight">
                <span className="text-yellow-500">BRIGHT</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {tagline}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed">{description}</p>

            {/* CTA Button */}
            {ctaButton?.text && (
              <div className="pt-2">
                <a
                  href={ctaButton.url || '#'}
                  className="inline-flex items-center gap-2 text-gray-900 font-semibold text-base hover:text-blue-600 transition-colors group"
                >
                  {ctaButton.text}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            )}
          </div>

          {/* Right side - space for illustration (handled by absolute positioning) */}
          <div className="hidden lg:block">
            {/* This space allows the illustration to be positioned */}
          </div>
        </div>

        {/* Dotted Separator Line */}
        <div className="mt-20 mb-16">
          <div className="w-full relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dotted border-blue-300 opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
            {stats.map((stat, index) => (
              <div key={stat.id || index} className="text-left">
                <div className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-2 leading-none">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-base font-normal">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

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
