import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { form, submissionData } = await request.json()

    if (!form || !submissionData) {
      return NextResponse.json(
        { message: 'Form and submission data are required' },
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
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const formId = searchParams.get('form')

    let where = {}
    if (formId) {
      where = { form: { equals: formId } }
    }

    const submissions = await payload.find({
      collection: 'form-submissions',
      where,
      limit: 50,
      sort: '-createdAt',
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching form submissions:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}