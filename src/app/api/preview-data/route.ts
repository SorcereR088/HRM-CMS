import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Define collection configuration
const COLLECTION_CONFIG = {
  pages: { allowDraft: true },
  media: { allowDraft: false },
  users: { allowDraft: false },
  // Add other collections as needed
} as const

type CollectionSlug = keyof typeof COLLECTION_CONFIG

function isValidCollectionSlug(value: string): value is CollectionSlug {
  return value in COLLECTION_CONFIG
}

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const collection = searchParams.get('collection')

  // Validate required parameters
  if (!id || !collection) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters: id and collection' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // Validate collection type
  if (!isValidCollectionSlug(collection)) {
    return new Response(
      JSON.stringify({
        error: 'Invalid collection parameter',
        validCollections: Object.keys(COLLECTION_CONFIG),
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // Validate ID format (basic validation)
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload = await getPayload({ config })

    const doc = await payload.findByID({
      collection,
      id,
      draft: COLLECTION_CONFIG[collection].allowDraft,
      depth: 2,
    })

    return Response.json(doc, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error) {
    console.error('Preview data error:', error)

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('not found') || error.message.includes('No such document')) {
        return new Response(JSON.stringify({ error: 'Document not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        return new Response(JSON.stringify({ error: 'Unauthorized access' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(
        JSON.stringify({ error: 'Internal Server Error', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
