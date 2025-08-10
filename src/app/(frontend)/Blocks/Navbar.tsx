'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

type NavLink = {
  label: string
  url: string
}

type NavbarProps = {
  title: { url: string } // logo image object
  links: NavLink[]
  ctaLabel: string
  ctaUrl: string
}

export default function Navbar({ title, links, ctaLabel, ctaUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="w-full bg-white px-6 md:px-[140px] py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={title.url} alt="Site Logo" className="h-10 w-auto" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 items-center">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  className="text-gray-700 hover:text-Teal hover:underline transition-colors duration-150"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={ctaUrl}
            className="ml-6 bg-Teal text-white px-5 py-2 rounded-md font-semibold shadow-md hover:bg-teal-700 transition-colors duration-150"
          >
            {ctaLabel}
          </a>
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
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  className="block text-gray-700 py-2 px-2 rounded hover:bg-Teal/10 hover:text-Teal transition-colors duration-150"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={ctaUrl}
            className="mt-6 block bg-Teal text-white text-center px-4 py-2 rounded-md font-semibold shadow hover:bg-teal-700 transition-colors duration-150"
          >
            {ctaLabel}
          </a>
        </div>
      )}
    </nav>
  )
}
