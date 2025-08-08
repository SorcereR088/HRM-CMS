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
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={title.url} alt="Site Logo" className="h-10 w-auto" />
        </div>

        {/* Hamburger (mobile only) */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Links (desktop only) */}
        <ul className="hidden md:flex gap-6 items-center">
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.url} className="hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button (desktop only) */}
        <a href={ctaUrl} className="hidden md:inline-block bg-Teal px-4 py-2 rounded text-white">
          {ctaLabel}
        </a>
      </div>

      {/* Mobile menu (toggle based) */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <ul className="flex flex-col gap-4">
            {links.map((link, index) => (
              <li key={index}>
                <a href={link.url} className="block hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={ctaUrl} className="block bg-Teal text-center px-4 py-2 rounded text-white">
            {ctaLabel}
          </a>
        </div>
      )}
    </nav>
  )
}
