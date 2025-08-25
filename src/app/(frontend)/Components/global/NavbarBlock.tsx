'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  const [activeSection, setActiveSection] = useState('home')
  const pathname = usePathname()
  const router = useRouter()

  // Extract data based on whether it's global or block data
  const navbarData = isGlobalData(props) ? props.data : props
  const { logo, links, ctaLabel, ctaUrl } = navbarData

  // Check if logo is a populated Media object
  const isLogoPopulated = typeof logo === 'object' && logo !== null && 'url' in logo

  // Function to check if a link is active
  const isActiveLink = (linkUrl: string) => {
    // Handle home link - only active when at top of home page
    if (linkUrl === '/' && pathname === '/') {
      return activeSection === 'home'
    }

    // Handle features link - check if we're on home page and features section is active
    if (linkUrl === '/features' && pathname === '/') {
      return activeSection === 'features'
    }

    // Handle other section links that might be mapped to home sections
    const sectionMappings: { [key: string]: string } = {
      '/features': 'features',
      '/highlights': 'highlights',
      '/testimonials': 'testimonials',
      '/cross-platform': 'cross-platform',
    }

    if (pathname === '/' && sectionMappings[linkUrl]) {
      return activeSection === sectionMappings[linkUrl]
    }

    // Handle other pages - check if pathname starts with the link URL
    if (linkUrl !== '/' && pathname.startsWith(linkUrl)) {
      return true
    }

    return false
  }

  // Function to handle smooth scrolling to sections
  const handleNavClick = (e: React.MouseEvent, url: string) => {
    console.log('Nav click:', { url, pathname }) // Debug log

    // Define which URLs should scroll to sections on home page
    const sectionMappings: { [key: string]: string } = {
      '/': 'top', // Home should scroll to top
      '/features': 'features',
      '/highlights': 'highlights',
      '/testimonials': 'testimonials',
      '/cross-platform': 'cross-platform',
    }

    // If clicking on a section link or home
    if (sectionMappings[url]) {
      e.preventDefault()

      const targetId = sectionMappings[url]

      // If we're already on home page, scroll to section or top
      if (pathname === '/') {
        if (targetId === 'top') {
          // Scroll to top for home link
          console.log('Scrolling to top')

          try {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          } catch (error) {
            // Fallback for older browsers
            console.log('Using fallback scroll method')
            window.scrollTo(0, 0)
          }
        } else {
          const targetElement = document.getElementById(targetId)

          if (targetElement) {
            const navbarHeight = 72
            const elementTop = targetElement.offsetTop
            const targetPosition = elementTop - navbarHeight - 20

            console.log('Scrolling to position:', { elementTop, targetPosition }) // Debug log

            // Try multiple scroll methods for better compatibility
            try {
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
              })
            } catch (error) {
              // Fallback for older browsers
              console.log('Using fallback scroll method')
              window.scrollTo(0, targetPosition)
            }
          } else {
            console.warn(`Element with id "${targetId}" not found`) // Debug log
          }
        }
      } else {
        // If we're on another page, navigate to home with hash (or just home for home link)
        if (targetId === 'top') {
          console.log('Navigating to home page')
          router.push('/')
        } else {
          console.log('Navigating to home page with section:', targetId)
          router.push(`/#${targetId}`)
        }
      }

      // Close mobile menu if open
      setIsOpen(false)
      return
    }

    // For hash links (if any)
    if (url.startsWith('#') && pathname === '/') {
      e.preventDefault()
      const targetId = url.substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const navbarHeight = 72
        const targetPosition = targetElement.offsetTop - navbarHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        })
      }

      setIsOpen(false)
    }

    console.log('Regular navigation - not intercepted') // Debug log
    // For regular links, let Next.js handle the navigation normally
  }

  // Handle scroll effect for navbar background and active section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)

      // Only detect sections when on home page
      if (pathname === '/') {
        // Define your sections with their IDs
        const sections = ['home', 'features', 'cross-platform', 'highlights', 'testimonials']

        // If we're at the top, show home as active
        if (scrollTop < 100) {
          setActiveSection('home')
          return
        }

        // Find which section is currently in view
        for (const sectionId of sections.slice(1)) {
          // Skip 'home' since we handled it above
          const element = document.getElementById(sectionId)
          if (element) {
            const rect = element.getBoundingClientRect()
            const navbarHeight = 72

            // Check if section is in viewport (accounting for navbar)
            if (rect.top <= navbarHeight + 100 && rect.bottom >= navbarHeight) {
              setActiveSection(sectionId)
              break
            }
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Call once to set initial state
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

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

  // Handle hash navigation when component mounts or pathname changes
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash
      if (hash && pathname === '/') {
        const targetId = hash.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          // Small delay to ensure page is fully loaded
          setTimeout(() => {
            const navbarHeight = 72
            const targetPosition = targetElement.offsetTop - navbarHeight - 20

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            })
          }, 100)
        }
      }
    }

    // Handle hash on mount
    handleHashScroll()

    // Handle hash changes
    window.addEventListener('hashchange', handleHashScroll)

    return () => {
      window.removeEventListener('hashchange', handleHashScroll)
    }
  }, [pathname])

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
              {links?.map((link, index) => {
                const isActive = isActiveLink(link.url)
                return (
                  <li key={link.id || index}>
                    <Link
                      href={link.url}
                      onClick={(e) => handleNavClick(e, link.url)}
                      className={`
                        relative font-medium px-2 py-2 transition-colors duration-300 group
                        ${isActive ? 'text-Teal' : 'text-gray-700 hover:text-Teal'}
                      `}
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-Teal transition-all duration-300 ease-out group-hover:w-full"></span>
                    </Link>
                  </li>
                )
              })}
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
                links.map((link, index) => {
                  const isActive = isActiveLink(link.url)
                  return (
                    <Link
                      key={link.id || index}
                      href={link.url}
                      onClick={(e) => {
                        handleNavClick(e, link.url)
                        setIsOpen(false)
                      }}
                      className={`
                        group block py-4 px-4 -mx-4 rounded-xl
                        text-xl font-medium transition-all duration-300 ease-in-out
                        border-b border-gray-100 last:border-b-0
                        transform
                        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                        ${
                          isActive
                            ? 'text-Teal bg-teal-50 border-teal-100'
                            : 'text-gray-900 hover:bg-gray-50 hover:text-Teal'
                        }
                      `}
                      style={{
                        transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{link.label}</span>
                        <div
                          className={`
                            w-2 h-2 rounded-full transition-opacity duration-300
                            ${
                              isActive
                                ? 'bg-Teal opacity-100'
                                : 'bg-Teal opacity-0 group-hover:opacity-100'
                            }
                          `}
                        ></div>
                      </div>
                    </Link>
                  )
                })
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
