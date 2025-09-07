import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

// Define a custom error interface for better type safety
interface APIError {
  message: string
  code?: string
  statusCode?: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
): Promise<Response> {
  try {
    const payload = await getPayload({ config: configPromise })
    const resolvedParams = await params
    const filename = resolvedParams.slug.join('/')

    // Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('\\')) {
      return new Response('Invalid filename', { status: 400 })
    }

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
          'Content-Length': fileBuffer.length.toString(),
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
          'Content-Length': fileBuffer.length.toString(),
        },
      })
    }

    return new Response('Physical file not found', { status: 404 })
  } catch (error) {
    console.error('Media API error:', error)

    // Enhanced error handling with type safety
    let errorMessage = 'Unknown error occurred'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message

      // Handle specific error types
      if (error.name === 'ENOENT') {
        errorMessage = 'File system error: File not found'
        statusCode = 404
      } else if (error.name === 'EACCES') {
        errorMessage = 'File system error: Permission denied'
        statusCode = 403
      }
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object') {
      // Handle API errors with custom structure
      const apiError = error as APIError
      errorMessage = apiError.message || 'API error occurred'
      statusCode = apiError.statusCode || 500
    }

    return new Response(`Internal server error: ${errorMessage}`, { status: statusCode })
  }
}
