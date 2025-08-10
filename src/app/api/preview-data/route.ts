import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const collection = searchParams.get('collection')

  if (!id || !collection) {
    return new Response('Missing id or collection parameter', { status: 400 })
  }

  try {
    const payload = await getPayload({ config })

    const doc = await payload.findByID({
      collection: collection as any,
      id,
      draft: true,
      depth: 2,
    })

    return Response.json(doc)
  } catch (error) {
    console.error('Preview data error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
