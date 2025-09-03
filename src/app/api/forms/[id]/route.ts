import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayload({ config })
    const { id } = params

    if (!id) {
      return NextResponse.json({ message: 'Form ID is required' }, { status: 400 })
    }

    // Get depth from query params
    const { searchParams } = new URL(request.url)
    const depth = parseInt(searchParams.get('depth') || '1', 10)

    const form = await payload.findByID({
      collection: 'forms',
      id,
      depth,
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form:', error)
    
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}