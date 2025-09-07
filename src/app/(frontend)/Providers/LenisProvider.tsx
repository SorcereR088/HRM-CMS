'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'

interface LenisProviderProps {
  children: ReactNode
}

// Extend the Window interface to include the lenis property
declare global {
  interface Window {
    lenis?: Lenis
  }
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // Animation duration in seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
      orientation: 'vertical', // 'vertical' or 'horizontal'
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Make Lenis instance available globally (optional)
    window.lenis = lenis

    // Cleanup function
    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
