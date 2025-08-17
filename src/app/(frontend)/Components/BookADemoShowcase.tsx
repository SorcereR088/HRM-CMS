'use client'

import React from 'react'
import BookADemoBlock from './blocks/BookADemoBlock'

const BookADemoShowcase: React.FC = () => {
  const sampleFeatures = [
    {
      id: '1',
      title: 'Easy Integration',
      description: 'Seamlessly integrate with your existing systems',
      iconType: 'lucide' as const,
      lucideIcon: 'Zap',
      iconUpload: null,
      iconUrl: null,
      iconifyIcon: null,
    },
    {
      id: '2',
      title: 'Real-time Analytics',
      description: 'Get insights into your HR processes in real-time',
      iconType: 'lucide' as const,
      lucideIcon: 'BarChart3',
      iconUpload: null,
      iconUrl: null,
      iconifyIcon: null,
    },
    {
      id: '3',
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security and compliance features',
      iconType: 'lucide' as const,
      lucideIcon: 'Shield',
      iconUpload: null,
      iconUrl: null,
      iconifyIcon: null,
    },
  ]

  return (
    <BookADemoBlock
      heading="Experience YAK HRM in action"
      description="See how our comprehensive HR management system can streamline your workflow and boost productivity."
      features={sampleFeatures}
      formHeading="Fill out the form and we'll reach you out soon"
      backgroundColor="white"
      blockType="book-demo"
      id="showcase-book-demo"
      blockName="BookADemo Showcase"
    />
  )
}

export default BookADemoShowcase