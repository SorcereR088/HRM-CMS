import { draftMode } from 'next/headers'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const collection = searchParams.get('collection')

  if (!slug || !collection) {
    return new Response('Missing slug or collection parameter', { status: 400 })
  }

  try {
    const payload = await getPayload({ config })

    if (collection === 'pages') {
      // Fetch the page to verify it exists
      const page = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
        depth: 2,
      })

      if (page.docs.length === 0) {
        return new Response('Page not found', { status: 404 })
      }
    }

    // Enable draft mode - MUST await draftMode() first
    const draft = await draftMode()
    draft.enable()

    // Set the redirect path based on slug
    const redirectPath = slug === 'home' ? '/' : `/${slug}`

    // Redirect to the preview page
    return Response.redirect(new URL(redirectPath, request.url), 307)
  } catch (error) {
    console.error('Preview error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
