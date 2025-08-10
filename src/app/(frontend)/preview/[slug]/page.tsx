'use client'

import { useEffect, useState } from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import PageRender from '../../Components/PageRender'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function PreviewPage({ params, searchParams }: Props) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)
  const [resolvedSearchParams, setResolvedSearchParams] = useState<any>(null)
  const [initialData, setInitialData] = useState<any>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const p = await params
      const sp = await searchParams
      setResolvedParams(p)
      setResolvedSearchParams(sp)

      // Fetch initial data
      const docId = sp.id as string
      if (docId) {
        try {
          const response = await fetch(`/api/preview-data?id=${docId}&collection=pages`)
          const data = await response.json()
          setInitialData(data)
        } catch (error) {
          console.error('Error fetching initial data:', error)
        }
      }
    }

    resolveParams()
  }, [params, searchParams])

  // Use live preview hook
  const { data } = useLivePreview({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
    depth: 2,
  })

  if (!resolvedParams || !data) {
    return <div>Loading preview...</div>
  }

  return <PageRender page={data} />
}
