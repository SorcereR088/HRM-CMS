'use client'

import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'

interface TestimonialItem {
  quote: string
  rating: number
  authorName: string
  authorTitle?: string | null
  company?: string | null
  id?: string | null
}

interface TestimonialsBlockProps {
  heading?: string | null
  subheading?: string | null
  testimonials?: TestimonialItem[] | null
  backgroundColor?: 'white' | 'gray-50' | 'teal-50' | null
  blockType: 'testimonials'
  id?: string | null
  blockName?: string | null
}

const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  heading = 'From Those Who Know Us Best',
  subheading,
  testimonials = [],
  backgroundColor = 'white',
}) => {
  const bgColor = backgroundColor || 'white'

  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    'teal-50': 'bg-teal-50',
  }[bgColor]

  const testimonialsArray = Array.isArray(testimonials) ? testimonials : []
  const duplicatedTestimonials = [...testimonialsArray, ...testimonialsArray]

  // Config state for responsiveness
  const [animationConfig, setAnimationConfig] = useState({ cardWidth: 320, duration: 6 })

  useEffect(() => {
    const updateConfig = () => {
      if (window.innerWidth < 640) {
        setAnimationConfig({ cardWidth: 280 + 16, duration: 6 }) // Mobile
      } else if (window.innerWidth < 1024) {
        setAnimationConfig({ cardWidth: 340 + 24, duration: 8 }) // Tablet
      } else {
        setAnimationConfig({ cardWidth: 380 + 32, duration: 10 }) // Desktop
      }
    }

    updateConfig()
    window.addEventListener('resize', updateConfig)
    return () => window.removeEventListener('resize', updateConfig)
  }, [])

  // ⭐ Star Rating Component
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center mb-2 sm:mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon="mdi:star"
          className={`w-4 h-4 sm:w-5 sm:h-5 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )

  // ⭐ Testimonial Card
  const TestimonialCard = ({ testimonial }: { testimonial: TestimonialItem }) => (
    <motion.div
      className="bg-gradient-to-br from-[#F5FFFC] to-white p-4 sm:p-6 rounded-xl shadow-sm 
                 border border-gray-200 flex flex-col flex-shrink-0 
                 mx-2 sm:mx-4 w-[280px] sm:w-[340px] lg:w-[380px] 
                 h-[240px] sm:h-[260px] lg:h-[280px]"
      whileHover={{
        scale: 1.01,
        zIndex: 20,
        borderColor: '#0d9488',
        boxShadow: '0 8px 20px rgba(20, 184, 166, 0.2)',
      }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl sm:text-4xl lg:text-5xl text-teal-500">&quot;</span>
        <StarRating rating={testimonial.rating} />
      </div>
      <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-grow overflow-hidden">
        {testimonial.quote}
      </blockquote>
      <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-auto">
        <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
          {testimonial.authorName}
        </p>
        {(testimonial.authorTitle || testimonial.company) && (
          <p className="text-gray-600 text-xs sm:text-sm truncate">
            {testimonial.authorTitle}
            {testimonial.authorTitle && testimonial.company && ' at '}
            {testimonial.company}
          </p>
        )}
      </div>
    </motion.div>
  )

  return (
    <section className={`py-16 sm:py-20 lg:py-24 ${bgColorClass}`}>
      <div className="w-full">
        {/* Heading */}
        <div className="text-left mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-12 xl:px-[140px] max-w-3xl">
          {heading && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{subheading}</p>
          )}
        </div>

        {/* Testimonials */}
        {testimonialsArray.length > 0 ? (
          <div className="relative w-full">
            <motion.div
              className="flex overflow-visible" // ✅ allow cards to grow outside
              animate={{
                x: [0, -(animationConfig.cardWidth * testimonialsArray.length)],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: testimonialsArray.length * animationConfig.duration,
                  ease: 'linear',
                },
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id || 'testimonial'}-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </motion.div>

            {/* Gradient overlays */}
            <div
              className="absolute top-0 left-0 w-12 sm:w-16 lg:w-24 h-full 
                            bg-gradient-to-r from-white via-white/80 to-transparent 
                            pointer-events-none z-10"
            />
            <div
              className="absolute top-0 right-0 w-12 sm:w-16 lg:w-24 h-full 
                            bg-gradient-to-l from-white via-white/80 to-transparent 
                            pointer-events-none z-10"
            />
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
              <Icon
                icon="mdi:message-text-outline"
                className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4"
              />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                No testimonials found
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                Add testimonials through admin panel to showcase customer feedback.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialsBlock
