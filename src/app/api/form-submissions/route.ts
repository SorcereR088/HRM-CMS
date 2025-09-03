import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const sort = searchParams.get('sort') || '-createdAt'

    const result = await payload.find({
      collection: 'form-submissions',
      page,
      limit,
      sort: [sort],
      depth: 2,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching form submissions:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ message: 'Submission ID is required' }, { status: 400 })
    }

    await payload.delete({
      collection: 'form-submissions',
      id,
    })

    return NextResponse.json({ message: 'Submission deleted successfully' })
  } catch (error) {
    console.error('Error deleting form submission:', error)
    
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return NextResponse.json({ message: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}