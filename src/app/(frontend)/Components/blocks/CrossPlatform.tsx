'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import { Media } from '@/payload-types'
import { useRef } from 'react'

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
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' })

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
    <section className={`${bgColorClass}`} ref={ref}>
      <div className="">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-12 justify-center lg:justify-start w-full h-auto lg:h-[80vh]">
          {/* Right Column - Content (Top on Mobile, Right on Desktop) */}
          <div className="order-1 lg:order-2 text-center lg:text-left w-full lg:w-auto pt-12 lg:pt-0">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
            >
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
                        damping: 10,
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
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.25, 0, 1] }}
                >
                  {subheading}
                </motion.span>
              </div>
            </motion.div>

            {icons.length > 0 && (
              <motion.div
                className="flex items-center space-x-6 mt-20 mb-8 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.25, 0, 1] }}
              >
                {icons.map((icon, index) => (
                  <motion.div
                    key={icon.id || index}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6 + index * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg">
                      <Icon icon={icon.iconName} className="w-10 h-10" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {description && (
              <motion.p
                className="text-md text-gray-600 mb-4 lg:mb-8 leading-tight max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.25, 0, 1] }}
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Left Column - Device Image (Bottom on Mobile, Left on Desktop) */}
          <div className="order-2 lg:order-1 relative w-full lg:w-[1000px] h-auto lg:h-full overflow-hidden flex justify-center sm:px-4">
            {imageData?.url ? (
              <motion.div
                className="relative w-[600px] h-[400px] lg:w-[1000px] lg:h-[900px] lg:absolute lg:-left-20"
                initial={{ opacity: 0, x: -50, rotateY: -15 }}
                animate={
                  isInView
                    ? {
                        opacity: 1,
                        x: 0,
                        rotateY: 0,
                      }
                    : {
                        opacity: 0,
                        x: -50,
                        rotateY: -15,
                      }
                }
                transition={{
                  duration: 1.2,
                  delay: 0.2,
                  ease: [0.25, 0.25, 0, 1],
                }}
              >
                <Image
                  src={imageData.url}
                  alt={imageData.alt}
                  fill
                  className="object-contain"
                  sizes=""
                  priority
                />

                {/* Floating elements around the image */}
                <motion.div
                  className="absolute -bottom-6 -left-6 w-6 h-6 bg-teal-500 rounded-full opacity-80"
                  animate={{
                    x: [0, 15, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.25, 0, 1] }}
              >
                <div className="text-center">
                  <Icon icon="mdi:devices" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Device mockup placeholder</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CrossPlatform
