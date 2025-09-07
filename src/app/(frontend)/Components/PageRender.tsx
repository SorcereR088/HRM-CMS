'use client'

import React from 'react'
import { Page } from '@/payload-types'
import HeroBlock from '../Components/blocks/HeroBlock'
import TrustedByBlock from '../Components/blocks/TrustedByBlock'
import FeaturesBlock from '../Components/blocks/FeaturesBlock'
import HighlightBlock from '../Components/blocks/HighlightBlock'
import TestimonialsBlock from '../Components/blocks/TestimonialsBlock'
import CrossPlatform from '../Components/blocks/CrossPlatform'
import FormBlock from '../Components/blocks/FormBlock'
import BookADemoBlock from '../Components/blocks/BookADemoBlock'
import AboutUsBlock from '../Components/blocks/AboutUsBlock'
import ContactUsBlock from '../Components/blocks/ContactUsBlock'
import CareersBlock from './blocks/CareersBlock'

interface PageRendererProps {
  page: Page
}

// Helper function to safely get block properties
const getBlockProp = <T,>(block: unknown, prop: string, fallback: T): T => {
  if (block && typeof block === 'object' && prop in block) {
    const value = (block as Record<string, unknown>)[prop]
    return value !== null && value !== undefined ? (value as T) : fallback
  }
  return fallback
}

const PageRenderer: React.FC<PageRendererProps> = ({ page }) => {
  // Add more comprehensive null checks
  if (!page) {
    console.warn('PageRenderer: page is null or undefined')
    return null
  }

  if (!page.content) {
    console.warn('PageRenderer: page.content is null or undefined')
    return null
  }

  if (!Array.isArray(page.content)) {
    console.warn('PageRenderer: page.content is not an array')
    return null
  }

  return (
    <div className="page-content">
      {page.content.map((block, index) => {
        try {
          // Safely get blockType from the block
          const blockType = getBlockProp(block, 'blockType', '')

          if (!blockType) {
            console.warn(`Block at index ${index} has no blockType`)
            return null
          }

          switch (blockType) {
            case 'hero':
              return (
                <HeroBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof HeroBlock>[0])}
                />
              )
            case 'trusted-by':
              return (
                <TrustedByBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof TrustedByBlock>[0])}
                />
              )
            case 'features':
              return (
                <FeaturesBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof FeaturesBlock>[0])}
                />
              )
            case 'highlights':
              return (
                <HighlightBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof HighlightBlock>[0])}
                />
              )
            case 'testimonials':
              return (
                <TestimonialsBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof TestimonialsBlock>[0])}
                />
              )
            case 'platform':
              return (
                <CrossPlatform
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof CrossPlatform>[0])}
                />
              )
            case 'form-block':
              return (
                <FormBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof FormBlock>[0])}
                />
              )
            case 'book-demo':
              return (
                <BookADemoBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof BookADemoBlock>[0])}
                />
              )
            case 'companyInfo':
              return (
                <AboutUsBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof AboutUsBlock>[0])}
                />
              )
            case 'contact-us':
              return (
                <ContactUsBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof ContactUsBlock>[0])}
                />
              )
            case 'careers':
              return (
                <CareersBlock
                  key={`${blockType}-${index}`}
                  {...(block as Parameters<typeof CareersBlock>[0])}
                />
              )
            default:
              console.warn(`Unknown block type: ${blockType}`)
              return null
          }
        } catch (error) {
          console.error(`Error rendering block ${index}:`, error)
          return (
            <div key={`error-${index}`} className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error rendering block</p>
            </div>
          )
        }
      })}
    </div>
  )
}

export default PageRenderer
