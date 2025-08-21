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

interface PageRendererProps {
  page: Page
}

const PageRenderer: React.FC<PageRendererProps> = ({ page }) => {
  if (!page.content) return null

  return (
    <div className="page-content">
      {page.content.map((block, index) => {
        try {
          switch (block.blockType) {
            case 'hero':
              return <HeroBlock key={`${block.blockType}-${index}`} {...block} />
            case 'trusted-by':
              return <TrustedByBlock key={`${block.blockType}-${index}`} {...block} />
            case 'features':
              return <FeaturesBlock key={`${block.blockType}-${index}`} {...block} />
            case 'highlights':
              return <HighlightBlock key={`${block.blockType}-${index}`} {...block} />
            case 'testimonials':
              return <TestimonialsBlock key={`${block.blockType}-${index}`} {...block} />
            case 'platform':
              return <CrossPlatform key={`${block.blockType}-${index}`} {...block} />
            case 'form-block':
              return <FormBlock key={`${block.blockType}-${index}`} {...block} />
            case 'book-demo':
              return <BookADemoBlock key={`${block.blockType}-${index}`} {...block} />
            case 'companyInfo':
              return <AboutUsBlock key={`${block.blockType}-${index}`} {...block} />
            default:
              console.warn(`Unknown block type: ${(block as any).blockType}`)
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
