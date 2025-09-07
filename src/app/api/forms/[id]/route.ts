import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Import the Form type from Payload's generated types
// This assumes you have generated types - adjust the import path as needed
import { Form } from '@/payload-types'

interface FormAPIResponse {
  success?: boolean
  message?: string
  data?: Form | Record<string, unknown> // Allow both Form type and generic object
  error?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<FormAPIResponse>> {
  try {
    const payload = await getPayload({ config })

    // Await the params since it's now a Promise in Next.js 15+
    const resolvedParams = await params
    const { id } = resolvedParams

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Form ID is required and must be a valid string',
        },
        { status: 400 },
      )
    }

    // Get and validate depth from query params
    const { searchParams } = new URL(request.url)
    const depthParam = searchParams.get('depth')
    const depth = depthParam ? parseInt(depthParam, 10) : 1

    // Validate depth parameter
    if (isNaN(depth) || depth < 0 || depth > 10) {
      return NextResponse.json(
        {
          success: false,
          message: 'Depth parameter must be a number between 0 and 10',
        },
        { status: 400 },
      )
    }

    const form = await payload.findByID({
      collection: 'forms',
      id,
      depth,
    })

    return NextResponse.json({
      success: true,
      data: form, // TypeScript will now accept this
    })
  } catch (error) {
    console.error('Error fetching form:', error)

    // Enhanced error handling
    if (error && typeof error === 'object' && 'status' in error) {
      if (error.status === 404) {
        return NextResponse.json(
          {
            success: false,
            message: 'Form not found',
            error: 'FORM_NOT_FOUND',
          },
          { status: 404 },
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: 'INTERNAL_ERROR',
      },
      { status: 500 },
    )
  }
}
