'use client'

import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import TextAmination from '../animation/TextAnimation'

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
  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    'teal-50': 'bg-teal-50',
  }[backgroundColor || 'white']

  const testimonialsArray = Array.isArray(testimonials) ? testimonials : []
  const duplicatedTestimonials = [...testimonialsArray, ...testimonialsArray]

  const [isHovered, setIsHovered] = useState(false)

  // ⭐ Star Rating Component
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center mb-1 sm:mb-2 lg:mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon="mdi:star"
          className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )

  // ⭐ Testimonial Card
  const TestimonialCard = ({ testimonial }: { testimonial: TestimonialItem }) => (
    <div
      className="bg-gradient-to-br from-[#F5FFFC] to-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl shadow-sm 
                 border border-gray-200 flex flex-col flex-shrink-0 
                 mx-1 sm:mx-2 lg:mx-4 w-[220px] sm:w-[280px] lg:w-[380px] 
                 h-[180px] sm:h-[220px] lg:h-[280px]
                 transition-all duration-300 hover:scale-[1.01] hover:z-20 hover:border-teal-600 
                 hover:shadow-[0_8px_20px_rgba(20,184,166,0.2)]"
    >
      <div className="flex items-start justify-between">
        <span className="text-xl sm:text-3xl lg:text-5xl text-teal-500">&quot;</span>
        <StarRating rating={testimonial.rating} />
      </div>
      <blockquote className="text-gray-700 text-xs sm:text-sm lg:text-base leading-relaxed mb-2 sm:mb-4 lg:mb-6 flex-grow overflow-hidden">
        {testimonial.quote}
      </blockquote>
      <div className="border-t border-gray-200 pt-2 sm:pt-3 lg:pt-4 mt-auto">
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
    </div>
  )

  return (
    <section className={`py-16 sm:py-20 lg:py-24 ${bgColorClass}`}>
      <div className="w-full">
        {/* Heading */}
        <TextAmination delay={0.3}>
          <div className="text-left mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-12 xl:px-[140px] max-w-3xl">
            {heading && (
              <h2 className="ttext-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{subheading}</p>
            )}
          </div>
        </TextAmination>

        {/* Testimonials */}
        {testimonialsArray.length > 0 ? (
          <div
            className="relative w-full overflow-hidden py-8" // ✅ hide horizontal overflow
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="flex flex-nowrap gap-0" // ✅ nowrap so cards stay in a single row
              style={{
                animation: `scroll 40s linear infinite`,
                animationPlayState: isHovered ? 'paused' : 'running',
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id || 'testimonial'}-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </div>

            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 w-12 sm:w-16 lg:w-24 h-full bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-12 sm:w-16 lg:w-24 h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
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

      {/* CSS animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}

export default TestimonialsBlock
