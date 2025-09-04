'use client'

import React from 'react'
import { Form } from '@/payload-types'
import FormRenderer from './FormRenderer'

// Demo form data structure - this will be connected to an actual form from PayloadCMS
const demoForm: Form = {
  id: 1,
  title: 'Book a Demo',
  fields: [
    {
      blockType: 'text',
      name: 'fullName',
      label: 'Full Name',
      required: true,
      id: 'fullName',
    },
    {
      blockType: 'email',
      name: 'email',
      label: 'Email Address',
      required: true,
      id: 'email',
    },
    {
      blockType: 'text',
      name: 'phone',
      label: 'Phone Number',
      required: false,
      id: 'phone',
    },
    {
      blockType: 'text',
      name: 'company',
      label: 'Company Name',
      required: false,
      id: 'company',
    },
    {
      blockType: 'textarea',
      name: 'message',
      label: 'Message / Requirements',
      required: false,
      id: 'message',
    },
  ],
  submitButtonLabel: 'Book Demo',
  confirmationType: 'message',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text: 'Thank you for your interest! We will contact you shortly to schedule your demo.',
            },
          ],
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  },
  emails: [
    {
      emailTo: 'admin@example.com',
      subject: 'New Demo Booking Request',
      emailFrom: 'sofware@vianet.com.np',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'A new demo booking request has been submitted. {{*:table}}',
                },
              ],
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

const BookADemoShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book a Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our HRM system firsthand. Schedule a personalized demo to see how our solution can transform your HR processes.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Get Started Today
            </h2>
            <p className="text-gray-600">
              Fill out the form below and our team will reach out to schedule your demo at a convenient time.
            </p>
          </div>

          <FormRenderer form={demoForm} className="space-y-6" />

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What to Expect:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 30-minute personalized demo</li>
              <li>• Overview of key features and capabilities</li>
              <li>• Discussion of your specific HR needs</li>
              <li>• Q&A session with our experts</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Setup</h3>
            <p className="text-gray-600 text-sm">Get up and running in minutes with our intuitive interface</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Proven Results</h3>
            <p className="text-gray-600 text-sm">Join hundreds of companies improving their HR efficiency</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 0 1 9.75 9.75c0 1.92-.56 3.71-1.52 5.22a4.5 4.5 0 0 0-6.48-6.48A9.75 9.75 0 0 1 12 2.25z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Round-the-clock assistance from our expert team</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookADemoShowcase