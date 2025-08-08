// app/layout.tsx

import './styles.css'
import React from 'react'
import Navbar from './MyPages/Navbar'

export const metadata = {
  title: 'YAK HRM',
}

async function getNavigation() {
  const res = await fetch('http://localhost:3000/api/navigation', {
    next: { revalidate: 60 },
  })
  const data = await res.json()
  return data.docs[0]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navigation = await getNavigation()

  return (
    <html lang="en">
      <body>
        <Navbar
          title={navigation.title}
          links={navigation.links}
          ctaLabel={navigation.ctaLabel}
          ctaUrl={navigation.ctaUrl}
        />
        <main>{children}</main>
      </body>
    </html>
  )
}
