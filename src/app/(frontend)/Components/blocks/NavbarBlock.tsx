'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Media } from '@/payload-types'
import Button from '../Button'

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
    <>
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
                    className="relative text-gray-700 font-medium px-1 py-2 transition-colors duration-300 hover:text-Teal group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-Teal transition-all duration-300 ease-out group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button (Right) - Using Button component */}
          <div className="hidden md:block">
            <Button href={ctaUrl} variant="primary" size="md">
              {ctaLabel}
            </Button>
          </div>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 relative z-50 focus:outline-none"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isOpen ? (
              <X className="w-7 h-7 text-gray-900" />
            ) : (
              <Menu className="w-7 h-7 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-all duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Modern Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-lg shadow-2xl z-40 transform transition-all duration-500 ease-in-out md:hidden overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Modern Sidebar Header */}
        <div className="relative p-8 bg-gradient-to-br from-Teal/5 to-blue-50 border-b border-gray-100">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-Teal/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-blue-200/30 rounded-full blur-lg"></div>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-[90vh] pb-4">
          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-2 space-y-1 overflow-y-auto">
            {links?.map((link, index) => (
              <Link
                key={link.id || index}
                href={link.url}
                onClick={() => setIsOpen(false)}
                className="group relative block p-4 rounded-xl font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-Teal/10 hover:to-blue-50 hover:text-Teal transform hover:scale-[1.02] hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{link.label}</span>
                  <div className="w-2 h-2 bg-Teal rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Modern hover line */}
                <div className="h-0.5 bg-gradient-to-r from-Teal to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2"></div>
              </Link>
            ))}
          </nav>

          {/* Modern CTA Section - Moved up */}
          <div className="px-6 py-4 bg-gradient-to-t from-gray-50 to-transparent">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">Ready to get started?</p>
              <Button
                href={ctaUrl}
                variant="primary"
                size="lg"
                fullWidth={true}
                onClick={() => setIsOpen(false)}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NavbarBlock
