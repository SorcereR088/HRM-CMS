'use client'

import React from 'react'
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

  // Safely handle testimonials array
  const testimonialsArray = Array.isArray(testimonials) ? testimonials : []

  // Duplicate testimonials multiple times for seamless loop
  const duplicatedTestimonials = [
    ...testimonialsArray,
    ...testimonialsArray,
    ...testimonialsArray,
    ...testimonialsArray,
  ]

  // Generate star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            icon="mdi:star"
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  // Individual testimonial card component
  const TestimonialCard = ({
    testimonial,
    index,
  }: {
    testimonial: TestimonialItem
    index: number
  }) => (
    <motion.div
      className="bg-gradient-to-br from-[#F5FFFC] to-white p-6 rounded-lg shadow-sm border border-[#C2C2C2] flex flex-col flex-shrink-0 mx-4"
      style={{
        width: '400px',
        height: '280px',
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Star Rating */}
      <div className="flex items-start justify-between leading-tight h-auto">
        <h1 className="text-5xl text-gray-400">"</h1>
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Quote - This will take up available space */}
      <blockquote className="text-gray-700 text-base leading-relaxed mb-6 flex-grow overflow-hidden">
        {testimonial.quote}
      </blockquote>

      {/* Author Info - This will always be at the bottom */}
      <div className="border-t border-[#C2C2C2] pt-4 mt-auto">
        <p className="font-semibold text-gray-900 text-sm truncate">{testimonial.authorName}</p>
        {(testimonial.authorTitle || testimonial.company) && (
          <p className="text-gray-600 text-sm truncate">
            {testimonial.authorTitle}
            {testimonial.authorTitle && testimonial.company && ' at '}
            {testimonial.company}
          </p>
        )}
      </div>
    </motion.div>
  )

  return (
    <section className={`py-20 ${bgColorClass}`}>
      <div className="w-full">
        {/* Section Header */}
        <div className="text-left mb-16 px-6 md:px-[140px] w-1/3">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
          )}
          {subheading && <p className="text-lg text-gray-600 max-w-3xl">{subheading}</p>}
        </div>

        {/* Show testimonials or empty state */}
        {testimonialsArray.length > 0 ? (
          /* Animated Testimonials Carousel - Full Width */
          <div
            className="relative overflow-hidden w-full"
            style={{ paddingTop: '20px', paddingBottom: '20px' }}
          >
            <motion.div
              className="flex"
              animate={{
                x: [0, -(400 + 32) * testimonialsArray.length], // 400px card width + 32px margin
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: testimonialsArray.length * 8, // 8 seconds per testimonial
                  ease: 'linear',
                },
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id || 'testimonial'}-${index}`}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </motion.div>

            {/* Gradient overlays for smooth edges */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-12 px-6 md:px-[140px]">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <Icon
                icon="mdi:message-text-outline"
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
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
