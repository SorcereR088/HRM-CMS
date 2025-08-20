import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

    // Fetch the original form
    const originalForm = await payload.findByID({
      collection: 'forms',
      id: formId,
    })

    if (!originalForm) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 })
    }

    // Create duplicated form data
    const duplicatedFormData = {
      ...originalForm,
      // Remove auto-generated fields
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      // Modify title and formtitle to indicate it's a copy
      formtitle: `${originalForm.formtitle} (Copy)`,
      title: `${originalForm.title} (Copy)`,
    }

    // Create the new form
    const duplicatedForm = await payload.create({
      collection: 'forms',
      data: duplicatedFormData,
    })

    return NextResponse.json(
      {
        message: 'Form duplicated successfully',
        originalFormId: formId,
        duplicatedForm: duplicatedForm,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error duplicating form:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('Invalid ID')) {
        return NextResponse.json({ message: 'Form not found' }, { status: 404 })
      }
      
      if (error.message.includes('unauthorized')) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 })
      }
      
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { message: 'Validation failed', details: error.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}