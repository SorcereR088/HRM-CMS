'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Media } from '@/payload-types'

interface NavbarBlockProps {
  logo: number | Media
  links?: Array<{
    label: string
    url: string
    id?: string | null
  }> | null
  ctaLabel: string
  ctaUrl: string
  blockType: 'navbar'
  id?: string | null
  blockName?: string | null
}

const NavbarBlock: React.FC<NavbarBlockProps> = ({ logo, links, ctaLabel, ctaUrl }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Check if logo is a populated Media object
  const isLogoPopulated = typeof logo === 'object' && logo !== null && 'url' in logo

  if (!isLogoPopulated) {
    console.warn('NavbarBlock: Logo media not populated.')
    return null
  }

  return (
    <nav className="w-full bg-white px-6 md:px-[140px] py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          {logo.url && (
            <Link href="/">
              <Image
                src={logo.url}
                alt={logo.alt || 'Logo'}
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          )}
        </div>

        {/* Desktop Nav Links (Center) */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex gap-6 items-center">
            {links?.map((link, index) => (
              <li key={link.id || index}>
                <Link
                  href={link.url}
                  className="text-gray-700 hover:text-Teal hover:underline transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button (Right) */}
        <div className="hidden md:block">
          <Link
            href={ctaUrl}
            className="bg-Teal text-white px-5 py-2 rounded-md font-semibold shadow-md hover:bg-teal-700 transition-colors duration-150"
          >
            {ctaLabel}
          </Link>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-Teal"
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-gray-700" />
          ) : (
            <Menu className="w-7 h-7 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-white shadow-lg rounded-lg py-4 px-4">
          <ul className="flex flex-col gap-4">
            {links?.map((link, index) => (
              <li key={link.id || index}>
                <Link
                  href={link.url}
                  className="block text-gray-700 py-2 px-2 rounded hover:bg-Teal/10 hover:text-Teal transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={ctaUrl}
            className="mt-6 block bg-Teal text-white text-center px-4 py-2 rounded-md font-semibold shadow hover:bg-teal-700 transition-colors duration-150"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </nav>
  )
}

export default NavbarBlock
