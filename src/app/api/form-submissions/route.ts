import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { form, submissionData } = body

    // Enhanced validation
    if (!form || !submissionData) {
      return NextResponse.json(
        { message: 'Form and submission data are required' },
        { status: 400 },
      )
    }

    // Validate form exists
    try {
      await payload.findByID({
        collection: 'forms',
        id: form,
      })
    } catch (error) {
      return NextResponse.json(
        { message: 'Form not found' },
        { status: 404 },
      )
    }

    // Validate submission data structure
    if (typeof submissionData !== 'object' || Array.isArray(submissionData)) {
      return NextResponse.json(
        { message: 'Invalid submission data format' },
        { status: 400 },
      )
    }

    // Create the form submission
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: form,
        submissionData: submissionData,
      },
    })

    return NextResponse.json(
      {
        message: 'Form submitted successfully',
        submission: submission,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Form submission error:', error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { message: 'Form validation failed', details: error.message },
          { status: 400 }
        )
      }
      
      if (error.message.includes('duplicate')) {
        return NextResponse.json(
          { message: 'Duplicate submission detected' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const formId = searchParams.get('form')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100) // Max 100 items per page

    let where = {}
    if (formId) {
      // Validate form ID format
      if (!/^\d+$/.test(formId)) {
        return NextResponse.json(
          { message: 'Invalid form ID format' },
          { status: 400 }
        )
      }
      where = { form: { equals: formId } }
    }

    const submissions = await payload.find({
      collection: 'form-submissions',
      where,
      limit,
      page,
      sort: '-createdAt',
    })

    return NextResponse.json({
      docs: submissions.docs,
      totalDocs: submissions.totalDocs,
      totalPages: submissions.totalPages,
      page: submissions.page,
      hasPrevPage: submissions.hasPrevPage,
      hasNextPage: submissions.hasNextPage,
    })
  } catch (error) {
    console.error('Error fetching form submissions:', error)
    
    if (error instanceof Error && error.message.includes('unauthorized')) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}