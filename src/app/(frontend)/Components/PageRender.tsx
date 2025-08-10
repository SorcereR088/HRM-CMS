'use client'

import React from 'react'
import { Page } from '@/payload-types'
import NavbarBlock from '../Components/blocks/NavbarBlock'
import HeroBlock from '../Components/blocks/HeroBlock'
import TrustedByBlock from '../Components/blocks/TrustedByBlock'

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
            case 'navbar':
              return <NavbarBlock key={`${block.blockType}-${index}`} {...block} />
            case 'hero':
              return <HeroBlock key={`${block.blockType}-${index}`} {...block} />
            case 'trusted-by':
              return <TrustedByBlock key={`${block.blockType}-${index}`} {...block} />
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
