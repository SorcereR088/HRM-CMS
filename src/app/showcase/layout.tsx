import type { Metadata } from 'next'
import '../(frontend)/styles.css'

export const metadata: Metadata = {
  title: 'BookADemo Component Showcase',
  description: 'Demonstrating the BookADemo block component',
}

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}