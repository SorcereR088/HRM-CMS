'use client'

import { useEffect, useState } from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import PageRender from '../../Components/PageRender'
import { Page } from '@/payload-types'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

interface SearchParams {
  [key: string]: string | string[] | undefined
  id?: string
}

export default function PreviewPage({ params, searchParams }: Props) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)
  const [initialData, setInitialData] = useState<Page | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const resolveParams = async () => {
      const p = await params
      const sp = (await searchParams) as SearchParams
      setResolvedParams(p)

      // Fetch initial data
      const docId = sp.id
      if (typeof docId === 'string') {
        try {
          const response = await fetch(`/api/preview-data?id=${docId}&collection=pages`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data: Page = await response.json()
          setInitialData(data)
        } catch (error) {
          console.error('Error fetching initial data:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    resolveParams()
  }, [params, searchParams])

  // Only use live preview hook when we have initial data
  const livePreviewResult = useLivePreview<Page>({
    initialData: initialData!,
    serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
    depth: 2,
  })

  if (!resolvedParams || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Failed to load page data</p>
        </div>
      </div>
    )
  }

  // Use data from live preview, but fallback to initialData if live preview data is null
  const pageData = livePreviewResult.data || initialData

  // Add null check before rendering
  if (!pageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading page data...</p>
        </div>
      </div>
    )
  }

  return <PageRender page={pageData} />
}
