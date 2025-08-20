import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const { id } = await context.params
    const formId = id

    // Validate form ID format
    if (!formId || !/^\d+$/.test(formId)) {
      return NextResponse.json(
        { message: 'Invalid form ID format' },
        { status: 400 }
      )
    }

    const form = await payload.findByID({
      collection: 'forms',
      id: formId,
    })

    if (!form) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
        return NextResponse.json({ message: 'Form not found' }, { status: 404 })
      }
      
      if (error.message.includes('unauthorized')) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 })
      }
    }
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}