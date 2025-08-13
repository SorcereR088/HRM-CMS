'use client'

import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { motion } from 'motion/react'

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
  const duplicatedTestimonials = [
    ...testimonialsArray,
    ...testimonialsArray,
    ...testimonialsArray,
    ...testimonialsArray,
  ]

  // ⭐ Add state for card width and duration
  const [animationConfig, setAnimationConfig] = useState({ cardWidth: 350, duration: 8 })

  useEffect(() => {
    const updateConfig = () => {
      if (window.innerWidth < 640) {
        setAnimationConfig({ cardWidth: 280 + 16, duration: 6 })
      } else if (window.innerWidth < 1024) {
        setAnimationConfig({ cardWidth: 350 + 32, duration: 8 })
      } else {
        setAnimationConfig({ cardWidth: 400 + 32, duration: 8 })
      }
    }

    updateConfig()
    window.addEventListener('resize', updateConfig)
    return () => window.removeEventListener('resize', updateConfig)
  }, [])

  // StarRating component stays the same
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center mb-2 sm:mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon="mdi:star"
          className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )

  const TestimonialCard = ({ testimonial }: { testimonial: TestimonialItem }) => (
    <motion.div
      className="bg-gradient-to-br from-[#F5FFFC] to-white p-4 sm:p-6 rounded-lg shadow-sm border border-[#C2C2C2] flex flex-col flex-shrink-0 mx-2 sm:mx-4 w-[280px] sm:w-[350px] lg:w-[400px] h-[240px] sm:h-[260px] lg:h-[280px]"
      whileHover={{
        scale: 1.02,
        borderColor: '#00AA77',
        boxShadow: '0 6px 16px rgba(20, 184, 166, 0.15)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between leading-tight h-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-teal-500">"</h1>
        <StarRating rating={testimonial.rating} />
      </div>
      <blockquote className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-grow overflow-hidden">
        {testimonial.quote}
      </blockquote>
      <div className="border-t border-[#C2C2C2] pt-3 sm:pt-4 mt-auto">
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
    <section className={`py-10 sm:py-16 lg:py-20 ${bgColorClass}`}>
      <div className="w-full">
        <div className="text-left mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-40 w-full sm:w-2/3 lg:w-1/3">
          {heading && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl">{subheading}</p>
          )}
        </div>

        {testimonialsArray.length > 0 ? (
          <div
            className="relative overflow-hidden w-full"
            style={{ paddingTop: '15px', paddingBottom: '15px' }}
          >
            <motion.div
              className="flex"
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

            <div className="absolute top-0 left-0 w-16 sm:w-24 lg:w-32 h-full bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-16 sm:w-24 lg:w-32 h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 px-4 sm:px-6 lg:px-[140px]">
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
              <Icon
                icon="mdi:message-text-outline"
                className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4"
              />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No testimonials found
              </h3>
              <p className="text-gray-500 text-sm">
                Add testimonials through the page builder to showcase customer feedback.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialsBlock
