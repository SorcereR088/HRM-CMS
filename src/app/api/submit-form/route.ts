import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    let requestData
    try {
      requestData = await request.json()
    } catch (parseError) {
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { form, submissionData } = requestData

    if (!form) {
      return NextResponse.json({ message: 'Form ID is required' }, { status: 400 })
    }

    if (!submissionData || Object.keys(submissionData).length === 0) {
      return NextResponse.json({ message: 'Submission data is required' }, { status: 400 })
    }

    // Verify the form exists
    try {
      await payload.findByID({
        collection: 'forms',
        id: form,
        depth: 1,
      })
    } catch (error) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 })
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
      { status: 201 },
    )
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
