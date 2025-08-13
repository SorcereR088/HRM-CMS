'use client'

import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'motion/react'
import { Media } from '@/payload-types' // Import the actual Payload Media type

interface AnimatedPlatform {
  platform: string
  id?: string | null
}

interface PlatformIcon {
  platform: string
  iconName: string
  id?: string | null
}

interface CrossPlatformProps {
  heading?: string | null
  subheading?: string | null
  animatedPlatforms?: AnimatedPlatform[] | null
  description?: string | null
  platformIcons?: PlatformIcon[] | null
  deviceImage?: Media | number | null // Use Payload's Media type
  animationSpeed?: number | null
  backgroundColor?: 'white' | 'gray-50' | 'blue-50' | 'teal-50' | null
  blockType: 'platform'
  id?: string | null
  blockName?: string | null
  [key: string]: any
}

const CrossPlatform: React.FC<CrossPlatformProps> = ({
  heading = 'Available on all',
  subheading = 'Platforms',
  animatedPlatforms = [{ platform: 'Web' }, { platform: 'Android' }, { platform: 'iOS' }],
  description = 'Access your HRM System anytime, anywhere with full support on Web, Android, and iOS platforms.',
  platformIcons = [
    { platform: 'Chrome', iconName: 'logos:chrome' },
    { platform: 'Google Play', iconName: 'logos:google-play-icon' },
    { platform: 'App Store', iconName: 'logos:apple-app-store' },
  ],
  deviceImage,
  animationSpeed = 2,
  backgroundColor = 'gray-50',
  ...rest // Accept any additional props
}) => {
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0)

  const bgColorClass = {
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    'blue-50': 'bg-blue-50',
    'teal-50': 'bg-teal-50',
  }[backgroundColor || 'gray-50']

  const platforms = Array.isArray(animatedPlatforms) ? animatedPlatforms : []
  const icons = Array.isArray(platformIcons) ? platformIcons : []

  // Helper function to get image data from Payload Media object
  const getImageData = (image: Media | number | null | undefined) => {
    if (!image || typeof image === 'number') return null
    return {
      url: image.url || undefined,
      alt: image.alt || 'Device mockups showing platform compatibility',
      width: image.width || undefined,
      height: image.height || undefined,
    }
  }

  const imageData = getImageData(deviceImage)

  // Animation cycle for platform names
  useEffect(() => {
    if (platforms.length === 0) return

    const interval = setInterval(
      () => {
        setCurrentPlatformIndex((prevIndex) =>
          prevIndex === platforms.length - 1 ? 0 : prevIndex + 1,
        )
      },
      (animationSpeed || 2) * 1000,
    )

    return () => clearInterval(interval)
  }, [platforms.length, animationSpeed])

  const currentPlatform = platforms[currentPlatformIndex]?.platform || 'Web'

  return (
    <section className={`${bgColorClass}`}>
      <div className="">
        <div className="flex gap-20 items-center justify-start w-full">
          {/* Left Column - Device Image */}
          <div className="w-[1200px] h-[600px] relative bg-red-500 object-contain overflow-hidden ">
            <div className="-top-32 left-0">
              {imageData?.url ? (
                <img
                  src={imageData.url}
                  alt={imageData.alt}
                  className="w-full h-auto object-contain"
                  width={imageData.width}
                  height={imageData.height}
                />
              ) : (
                /* Fallback placeholder */
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Icon icon="mdi:devices" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Device mockup placeholder</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            {/* Animated Heading */}
            <div className="mb-6">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">{heading}</h2>
              <div className="text-5xl font-bold text-gray-900 flex items-center gap-4">
                <div className="inline-block relative">
                  <motion.span
                    className="inline-block bg-black text-white px-8 py-2 rounded-full"
                    layout
                    transition={{
                      layout: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                    }}
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={currentPlatform}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        style={{ display: 'inline-block' }}
                      >
                        {currentPlatform}
                      </motion.span>
                    </AnimatePresence>
                  </motion.span>
                </div>{' '}
                {subheading}
              </div>
            </div>

            {icons.length > 0 && (
              <div className="flex items-center space-x-6 mt-20 mb-8">
                {icons.map((icon, index) => (
                  <div key={icon.id || index} className="flex flex-col items-center ">
                    <div className="flex items-center justify-center bg-white rounded-2xl">
                      <Icon icon={icon.iconName} className="w-10 h-10" />
                    </div>
                    {/* <span className="text-sm text-gray-600 mt-2 font-medium">{icon.platform}</span> */}
                  </div>
                ))}
              </div>
            )}

            {description && (
              <p className="text-md text-gray-600 mb-8 leading-tight">{description}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CrossPlatform
