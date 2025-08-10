import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
): Promise<Response> {
  try {
    const payload = await getPayload({ config: configPromise })
    const resolvedParams = await params
    const filename = resolvedParams.slug.join('/')

    // Find the media file by filename
    const mediaFiles = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: filename,
        },
      },
    })

    if (!mediaFiles.docs || mediaFiles.docs.length === 0) {
      return new Response('File not found', { status: 404 })
    }

    const file = mediaFiles.docs[0]

    // Since your Media collection uses staticDir: 'uploads', check uploads folder
    const uploadsPath = path.join(process.cwd(), 'uploads', filename)

    if (fs.existsSync(uploadsPath)) {
      const fileBuffer = fs.readFileSync(uploadsPath)
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': file.mimeType || 'application/octet-stream',
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }

    // Fallback: check media folder
    const mediaPath = path.join(process.cwd(), 'media', filename)

    if (fs.existsSync(mediaPath)) {
      const fileBuffer = fs.readFileSync(mediaPath)
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': file.mimeType || 'application/octet-stream',
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }

    return new Response('Physical file not found', { status: 404 })
  } catch (error: any) {
    console.error('Media API error:', error)
    return new Response(`Internal server error: ${error.message}`, { status: 500 })
  }
}
