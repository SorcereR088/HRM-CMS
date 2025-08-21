import './styles.css'
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import NavbarComponent from '@/app/(frontend)/Components/global/NavbarBlock' // Your navbar component

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

// async function getFooter() {
//   // If you also want to make footer global later
//   const payload = await getPayload({ config })

//   try {
//     const footer = await payload.findGlobal({
//       slug: 'footer',
//       depth: 2,
//     })
//     return footer
//   } catch (error) {
//     console.error('Error fetching footer:', error)
//     return null
//   }
// }

export const metadata = {
  title: 'YAK HRM',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navbar = await getNavbar()
  // const footer = await getFooter() // If you want footer global too

  return (
    <html lang="en">
      <body>
        {/* Navbar appears on all pages */}
        {navbar && <NavbarComponent data={navbar} />}

        <main>{children}</main>

        {/* Footer would go here if global */}
        {/* {footer && <FooterComponent data={footer} />} */}
      </body>
    </html>
  )
}
