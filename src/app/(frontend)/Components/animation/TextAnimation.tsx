'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface TextAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  once?: boolean
}

const TextAnimation: React.FC<TextAnimationProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  y = 30,
  once = true,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: once,
    margin: '-120px 0px',
  })

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: y,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
            }
          : {
              opacity: 0,
              y: y,
            }
      }
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.25, 0, 1], // Apple's signature easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default TextAnimation
