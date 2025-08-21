'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Media, Navbar } from '@/payload-types'
import Button from '../Button'

// Original block props
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

// Global props
interface NavbarGlobalProps {
  data: Navbar
}

// Combined props type
type NavbarProps = NavbarBlockProps | NavbarGlobalProps

// Type guard to check if it's global data
function isGlobalData(props: NavbarProps): props is NavbarGlobalProps {
  return 'data' in props
}

const NavbarBlock: React.FC<NavbarProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Extract data based on whether it's global or block data
  const navbarData = isGlobalData(props) ? props.data : props
  const { logo, links, ctaLabel, ctaUrl } = navbarData

  // Check if logo is a populated Media object
  const isLogoPopulated = typeof logo === 'object' && logo !== null && 'url' in logo

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isLogoPopulated) {
    console.warn('NavbarBlock: Logo media not populated.')
    return null
  }

  return (
    <>
      {/* Sticky Navbar */}
      <nav
        className={`
          fixed top-0 left-0 right-0 w-full z-50 
          px-6 md:px-[140px] py-4 
          transition-all duration-300 ease-in-out
          ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-md border-b border-gray-100'
              : 'bg-white/90 backdrop-blur-md'
          }
        `}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            {logo.url && (
              <Link href="/" className="block">
                <Image
                  src={logo.url}
                  alt={logo.alt || 'Logo'}
                  width={120}
                  height={40}
                  className="h-10 w-auto transition-transform duration-200 hover:scale-105"
                  priority
                />
              </Link>
            )}
          </div>

          {/* Desktop Nav Links (Center) */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex gap-8 items-center">
              {links?.map((link, index) => (
                <li key={link.id || index}>
                  <Link
                    href={link.url}
                    className="relative text-gray-700 font-medium px-2 py-2 transition-colors duration-300 hover:text-Teal group"
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
            className="md:hidden p-2 relative z-[60] focus:outline-none transition-colors duration-200 hover:bg-gray-100 rounded-lg"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-[72px]" />

      {/* Full Screen Mobile Menu Overlay with Animation */}
      <div
        className={`
          fixed inset-0 bg-white z-[55] md:hidden
          transform transition-all duration-500 ease-in-out
          ${
            isOpen
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : '-translate-y-full opacity-0 pointer-events-none'
          }
        `}
        style={{ top: '72px' }}
      >
        {/* Mobile Menu Content */}
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <div className="flex-1 px-6 py-8">
            <nav className="space-y-1">
              {links && links.length > 0 ? (
                links.map((link, index) => (
                  <Link
                    key={link.id || index}
                    href={link.url}
                    onClick={() => setIsOpen(false)}
                    className={`
                      group block py-4 px-4 -mx-4 rounded-xl
                      text-xl font-medium text-gray-900
                      transition-all duration-300 ease-in-out
                      hover:bg-gray-50 hover:text-Teal
                      border-b border-gray-100 last:border-b-0
                      transform
                      ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                    `}
                    style={{
                      transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{link.label}</span>
                      <div className="w-2 h-2 bg-Teal rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">No navigation links available</div>
              )}
            </nav>
          </div>

          {/* CTA Section at Bottom */}
          <div
            className={`
            px-6 py-8 bg-gray-50 border-t border-gray-100
            transform transition-all duration-500 ease-in-out
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `}
            style={{
              transitionDelay: isOpen ? '300ms' : '0ms',
            }}
          >
            <div className="space-y-4">
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
