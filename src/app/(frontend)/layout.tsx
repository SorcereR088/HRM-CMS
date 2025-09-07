import './styles.css'
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Navbar from '@/app/(frontend)/Components/global/NavbarBlock'
import FooterBlock from '@/app/(frontend)/Components/global/FooterBlock'
import type { Footer } from '@/payload-types'

async function getNavbar() {
  const payload = await getPayload({ config })

  try {
    const navbar = await payload.findGlobal({
      slug: 'navbar',
      depth: 2, // Include related media
    })
    return navbar
  } catch (error) {
    console.error('Error fetching navbar:', error)
    return null
  }
}

async function getFooter(): Promise<Footer | null> {
  const payload = await getPayload({ config })

  try {
    const footer = (await payload.findGlobal({
      slug: 'footer',
      depth: 2,
    })) as Footer
    return footer
  } catch (error) {
    console.error('Error fetching footer:', error)
    return null
  }
}

export const metadata = {
  title: 'YAK HRM',
  icons: {
    icon: [
      { url: '/api/media/file/favicon.ico', sizes: 'any' },
      { url: '/api/media/file/icon0.svg', type: 'image/svg+xml' },
      { url: '/api/media/file/icon1.png', type: 'image/png' },
    ],
    apple: '/api/media/file/apple-icon.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navbar = await getNavbar()
  const footer = await getFooter()

  return (
    <html lang="en">
      <body>
        {/* Navbar appears on all pages */}
        {navbar && <Navbar data={navbar} />}

        <main>{children}</main>

        {/* Footer appears on all pages */}
        {footer && <FooterBlock data={footer} />}
      </body>
    </html>
  )
}
