'use client'

import React from 'react'
import { Icon } from '@iconify/react'

interface SocialLink {
  platform: string
  url: string
  id?: string | null
}

interface CTAButton {
  text?: string | null
  url?: string | null
}

interface SocialLinks {
  heading?: string | null
  links?: SocialLink[] | null
}

interface ContactInfo {
  heading?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
}

interface FooterBottom {
  copyrightText?: string | null
  designCredit?: string | null
}

interface FooterBlockProps {
  mainHeading?: string | null
  ctaButton?: CTAButton | null
  socialLinks?: SocialLinks | null
  contactInfo?: ContactInfo | null
  footerBottom?: FooterBottom | null
  backgroundColor?: 'teal-gradient' | 'dark-green' | 'custom-teal' | null
  blockType: 'footer'
  id?: string | null
  blockName?: string | null
  [key: string]: any
}

const FooterBlock: React.FC<FooterBlockProps> = ({
  mainHeading = 'Experience YAK HRM in action',
  ctaButton,
  socialLinks,
  contactInfo,
  footerBottom,
  backgroundColor = 'teal-gradient',
}) => {
  const bgColorClass = {
    'teal-gradient': 'bg-gradient-to-r from-Teal to-[#002D20]',
    'dark-green': 'bg-emerald-700',
    'custom-teal': 'bg-teal-500',
  }[backgroundColor || 'teal-gradient']

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase()
    if (platformLower.includes('linkedin')) return 'mdi:linkedin'
    if (platformLower.includes('instagram')) return 'mdi:instagram'
    if (platformLower.includes('facebook')) return 'mdi:facebook'
    if (platformLower.includes('twitter') || platformLower.includes('x')) return 'mdi:twitter'
    if (platformLower.includes('website') || platformLower.includes('web')) return 'mdi:web'
    return 'mdi:link'
  }

  const socialLinksData = socialLinks?.links ?? []

  return (
    <footer className={`${bgColorClass} text-white relative overflow-hidden`}>
      {/* Background Text */}
      <div className="absolute inset-0 flex justify-center items-center opacity-5 mt-40 pointer-events-none select-none">
        <h1 className="text-[24rem] font-bold whitespace-nowrap">CodeBright</h1>
      </div>

      <div className="relative z-10 px-6 sm:px-10 lg:px-40 py-12 lg:py-24">
        {/* Two main halves */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 lg:gap-0">
          {/* Left half - CTA */}
          <div className="flex flex-col justify-center w-full lg:w-[400px] text-left lg:text-left">
            {mainHeading && (
              <h2 className="text-4xl sm:text-3xl lg:text-4xl font-semibold leading-tight mb-6">
                {mainHeading}
              </h2>
            )}
            {ctaButton?.text && (
              <a
                href={ctaButton.url || '#'}
                className="inline-flex items-center justify-center bg-white text-teal-700 px-6 py-2 rounded-sm font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                {ctaButton.text}
              </a>
            )}
          </div>

          {/* Right half - Socials + Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-40 w-full lg:w-auto">
            {/* Socials */}
            <div>
              {socialLinks?.heading && (
                <h3 className="text-lg font-semibold mb-4">{socialLinks.heading}</h3>
              )}
              <div className="space-y-3">
                {socialLinksData.map((link, index) => (
                  <a
                    key={link.id || index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white/90 hover:text-white transition-colors"
                  >
                    <Icon icon={getSocialIcon(link.platform)} className="w-5 h-5 mr-3" />
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Contacts */}
            <div>
              {contactInfo?.heading && (
                <h3 className="text-lg font-semibold mb-4">{contactInfo.heading}</h3>
              )}
              <div className="space-y-3">
                {contactInfo?.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center text-white/90 hover:text-white transition-colors"
                  >
                    <Icon icon="mdi:email" className="w-5 h-5 mr-3" />
                    {contactInfo.email}
                  </a>
                )}
                {contactInfo?.phone && (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center text-white/90 hover:text-white transition-colors"
                  >
                    <Icon icon="mdi:phone" className="w-5 h-5 mr-3" />
                    {contactInfo.phone}
                  </a>
                )}
                {contactInfo?.address && (
                  <div className="flex items-center text-white/90">
                    <Icon icon="mdi:map-marker" className="w-5 h-5 mr-3" />
                    {contactInfo.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-white/20 pt-6 text-sm text-white/70 flex flex-col sm:flex-row justify-between gap-2 px-6 sm:px-10 lg:px-40 py-8">
        {footerBottom?.copyrightText && <p>{footerBottom.copyrightText}</p>}
        {footerBottom?.designCredit && <p>{footerBottom.designCredit}</p>}
      </div>
    </footer>
  )
}

export default FooterBlock
