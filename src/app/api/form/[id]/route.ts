// Create this file: src/app/api/forms/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getPayload({ config })
    const { id } = await context.params
    const formId = id

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
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
