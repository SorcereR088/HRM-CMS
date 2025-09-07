'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'motion/react'
import { Media } from '@/payload-types'

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
  deviceImage?: Media | number | null
  animationSpeed?: number | null
  backgroundColor?: 'white' | 'gray-50' | 'blue-50' | 'teal-50' | null
  blockType: 'platform'
  id?: string | null
  blockName?: string | null
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
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-12 justify-center lg:justify-start w-full h-auto lg:h-[80vh]">
          {/* Right Column - Content (Top on Mobile, Right on Desktop) */}
          <div className="order-1 lg:order-2 text-center lg:text-left w-full lg:w-auto pt-12 lg:pt-0">
            <div className="mb-6">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">{heading}</h2>
              <div className="text-5xl font-bold text-gray-900 flex items-center gap-4 justify-center lg:justify-start">
                <div className="inline-block relative">
                  <div className="inline-block relative">
                    <motion.div
                      className="bg-black text-white px-8 py-2 rounded-full inline-block"
                      style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                      layout
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 10, // lower damping = more bounce
                      }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={currentPlatform}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                          style={{ display: 'inline-block' }}
                        >
                          {currentPlatform}
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>{' '}
                {subheading}
              </div>
            </div>

            {icons.length > 0 && (
              <div className="flex items-center space-x-6 mt-20 mb-8 justify-center lg:justify-start">
                {icons.map((icon, index) => (
                  <div key={icon.id || index} className="flex flex-col items-center ">
                    <div className="flex items-center justify-center bg-white rounded-2xl">
                      <Icon icon={icon.iconName} className="w-10 h-10" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {description && (
              <p className="text-md text-gray-600 mb-8 leading-tight max-w-lg mx-auto lg:mx-0">
                {description}
              </p>
            )}
          </div>

          {/* Left Column - Device Image (Bottom on Mobile, Left on Desktop) */}
          <div className="order-2 lg:order-1 relative w-full lg:w-[1000px] h-auto lg:h-full overflow-hidden flex justify-center sm:px-4">
            {imageData?.url ? (
              <div className="relative w-full h-96 lg:absolute lg:-left-20 lg:top-12">
                <Image
                  src={imageData.url}
                  alt={imageData.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 1200px"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Icon icon="mdi:devices" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Device mockup placeholder</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CrossPlatform
