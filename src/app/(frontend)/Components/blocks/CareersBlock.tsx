'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

// Accept any props that match the PayloadCMS structure
interface CareersBlockProps {
  [key: string]: any
}

const CareersBlock: React.FC<CareersBlockProps> = (props) => {
  const {
    heading,
    description,
    contactInfo,
    jobListings,
    ctaButton,
    backgroundColor = 'white',
  } = props

  // Handle null/undefined values
  const safeJobListings = jobListings || []
  const safeCta = ctaButton || { text: 'Submit Application', style: 'primary' }
  const safeBgColor = backgroundColor || 'white'

  const getJobTypeDisplay = (jobType: string) => {
    const typeMap: Record<string, string> = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      contract: 'Contract',
      internship: 'Internship',
      remote: 'Remote',
    }
    return typeMap[jobType] || jobType
  }

  const getButtonClasses = (style: string) => {
    const baseClasses =
      'px-6 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2'

    switch (style) {
      case 'primary':
        return `${baseClasses} bg-Teal hover:bg-DarkTeal text-white`
      case 'secondary':
        return `${baseClasses} bg-gray-800 hover:bg-gray-900 text-white`
      case 'outline':
        return `${baseClasses} border-2 border-Teal text-Teal hover:bg-DarkTeal hover:text-white`
      default:
        return `${baseClasses} bg-Teal hover:bg-DarkTeal text-white`
    }
  }

  if (!heading) {
    return null
  }

  return (
    <section className={`py-16 bg-${safeBgColor}`}>
      <div className="max-w-8xl mx-auto px-12 sm:px-8 lg:px-[140px] h-screen">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Header */}
          <div className="lg:w-1/3">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{heading}</h1>
            {description && (
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">{description}</p>
            )}
            {contactInfo && (contactInfo.label || contactInfo.email) && (
              <div className="space-y-2">
                {contactInfo.label && (
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {contactInfo.label}
                  </p>
                )}
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-Teal hover:text-DarkTeal font-medium text-lg"
                  >
                    {contactInfo.email}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Job Listings */}
          <div className="lg:w-2/3">
            {safeJobListings.length > 0 ? (
              <div className="space-y-6">
                {safeJobListings.map((job: any, index: number) => (
                  <div
                    key={job.id || index}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Category */}
                        <div className="mb-3">
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                            {job.category}
                          </span>
                        </div>

                        {/* Job Title */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          {job.title}
                        </h3>

                        {/* Job Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            {getJobTypeDisplay(job.jobType)}
                          </span>
                          {job.salaryRange && (
                            <>
                              <span>•</span>
                              <span>{job.salaryRange}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{job.location}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="ml-4">
                        <a
                          href={job.applicationFormUrl}
                          className={getButtonClasses(safeCta.style)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {safeCta.text}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Currently, there are no jobs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareersBlock
