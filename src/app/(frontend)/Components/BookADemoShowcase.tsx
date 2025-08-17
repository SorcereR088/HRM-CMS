import React from 'react'
import BookADemoBlock from '@/app/(frontend)/Components/blocks/BookADemoBlock'

const mockFeatures = [
  {
    title: 'Streamlined Operations',
    description: 'Handle HR tasks like attendance, payroll, and employee data from one easy-to-use platform',
    iconType: 'lucide' as const,
    lucideIcon: 'Zap',
    id: '1',
  },
  {
    title: 'Accurate & Compliant',
    description: 'Reduce errors and stay aligned with company policies and legal standards through automation',
    iconType: 'lucide' as const,
    lucideIcon: 'Shield',
    id: '2',
  },
  {
    title: 'Fits Any Team Size',
    description: 'Whether you\'re a small team or a large organization, the system scales with your needs',
    iconType: 'lucide' as const,
    lucideIcon: 'Users',
    id: '3',
  },
]

export default function BookADemoShowcase() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">BookADemo Component Showcase</h1>
        <p className="text-gray-600 mb-8">Demonstrating the new BookADemo block component</p>
      </div>
      
      <BookADemoBlock
        heading="Experience YAK HRM in action"
        description=""
        features={mockFeatures}
        formHeading="Fill out the form and we'll reach you out soon"
        backgroundColor="white"
        blockType="book-demo"
        id="demo-showcase"
        blockName="Demo Showcase"
      />
      
      <div className="py-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Gray Background Version</h2>
        <BookADemoBlock
          heading="Experience YAK HRM in action"
          description="This version shows the component with a gray background"
          features={mockFeatures}
          formHeading="Fill out the form and we'll reach you out soon"
          backgroundColor="gray-50"
          blockType="book-demo"
          id="demo-showcase-gray"
          blockName="Demo Showcase Gray"
        />
      </div>
    </div>
  )
}