import './styles.css'
import React from 'react'

export const metadata = {
  title: 'YAK HRM',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
