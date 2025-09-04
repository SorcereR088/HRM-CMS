import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Form } from '@/payload-types'
import EmailService from '@/utils/email-service'

// Define interfaces for type safety
interface FormField {
  name?: string
  label?: string
  blockType?: string
  required?: boolean
  id?: string
}

interface SubmissionData {
  [key: string]: string | number | boolean | string[] | null | undefined
}

interface DynamicField {
  fieldName: string
  fieldLabel: string
  fieldValue: string
  fieldType: string
}

interface RequestBody {
  form: string | number
  submissionData: SubmissionData
}

export async function POST(request: NextRequest) {
  try {
    let requestData: RequestBody
    try {
      requestData = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { form, submissionData } = requestData

    console.log('Received form submission:', { form, submissionData })

    // Validate form ID - accept both string and number, plus special demo-booking form
    if (!form || (typeof form !== 'string' && typeof form !== 'number')) {
      console.error('Invalid form ID:', form, typeof form)
      return NextResponse.json({ message: 'Valid form ID is required' }, { status: 400 })
    }

    // Convert to string if it's a number
    const formId = String(form)

    // Handle special demo-booking form without database dependency
    if (formId === 'demo-booking') {
      console.log('Processing demo booking form submission')
      
      // Validate and send emails for demo booking
      const validation = EmailService.validateBookingFormData(submissionData)
      
      if (!validation.isValid) {
        return NextResponse.json(
          { message: 'Invalid form data', errors: validation.errors },
          { status: 400 }
        )
      }

      let emailResults = null
      if (validation.formData) {
        try {
          emailResults = await EmailService.sendBookingEmails(validation.formData)
          console.log('Demo booking emails sent:', emailResults)
        } catch (emailError) {
          console.error('Failed to send demo booking emails:', emailError)
          emailResults = {
            customerEmail: { success: false, message: 'Email sending failed', error: String(emailError) },
            adminEmail: { success: false, message: 'Email sending failed', error: String(emailError) },
          }
        }
      }

      // Return success response for demo booking
      return NextResponse.json(
        {
          message: 'Demo booking submitted successfully',
          formType: 'demo-booking',
          submissionId: `demo-${Date.now()}`,
          emails: emailResults ? {
            customerEmailSent: emailResults.customerEmail.success,
            adminEmailSent: emailResults.adminEmail.success,
            emailErrors: [
              ...(emailResults.customerEmail.success ? [] : [emailResults.customerEmail.error]),
              ...(emailResults.adminEmail.success ? [] : [emailResults.adminEmail.error]),
            ].filter(Boolean),
          } : null,
        },
        { status: 201 },
      )
    }

    // For regular PayloadCMS forms, continue with the original logic that requires database
    const payload = await getPayload({ config })

    // Validate submission data
    if (
      !submissionData ||
      typeof submissionData !== 'object' ||
      Object.keys(submissionData).length === 0
    ) {
      console.error('Invalid submission data:', submissionData)
      return NextResponse.json({ message: 'Submission data is required' }, { status: 400 })
    }

    // Verify the form exists and get form details including field definitions
    let formData: Form
    try {
      formData = (await payload.findByID({
        collection: 'forms',
        id: formId,
        depth: 3,
      })) as Form

      console.log('Found form:', { id: formData.id, title: formData.title })
    } catch (error) {
      console.error('Form not found:', error)
      return NextResponse.json({ message: 'Form not found' }, { status: 404 })
    }

    // Process dynamic fields based on form structure
    const dynamicFields: DynamicField[] = []
    const submissionSummaryParts: string[] = []

    // Create a map of field names to their definitions from the form
    const fieldDefinitions: Record<string, { label: string; type: string; required: boolean }> = {}

    if (formData.fields && Array.isArray(formData.fields)) {
      formData.fields.forEach((field: any) => {
        const formField = field as FormField
        if (formField.name) {
          fieldDefinitions[formField.name] = {
            label: formField.label || formField.name,
            type: formField.blockType || 'unknown',
            required: formField.required || false,
          }
        }
      })
    }

    console.log('Field definitions:', fieldDefinitions)

    // Process each submitted field
    Object.entries(submissionData).forEach(([fieldName, fieldValue]) => {
      const fieldDef = fieldDefinitions[fieldName] || {
        label: fieldName,
        type: 'unknown',
        required: false,
      }

      // Format the field value based on its type
      let formattedValue: string

      if (fieldValue === null || fieldValue === undefined) {
        formattedValue = ''
      } else if (fieldDef.type === 'checkbox') {
        formattedValue = fieldValue ? 'Yes' : 'No'
      } else if (Array.isArray(fieldValue)) {
        formattedValue = fieldValue.join(', ')
      } else if (typeof fieldValue === 'object') {
        try {
          formattedValue = JSON.stringify(fieldValue)
        } catch {
          formattedValue = String(fieldValue)
        }
      } else {
        formattedValue = String(fieldValue)
      }

      const dynamicField: DynamicField = {
        fieldName: fieldName,
        fieldLabel: fieldDef.label,
        fieldValue: formattedValue,
        fieldType: fieldDef.type,
      }

      dynamicFields.push(dynamicField)

      // Add to summary
      submissionSummaryParts.push(`${fieldDef.label}: ${formattedValue}`)
    })

    const submissionSummary = submissionSummaryParts.join('\n')

    console.log('Processed dynamic fields:', dynamicFields)

    // Create the form submission with dynamic field structure
    try {
      // Convert submissionData to the expected array format
      const submissionDataArray = Object.entries(submissionData).map(([field, value]) => ({
        field,
        value: String(value || ''),
      }))

      const submission = await payload.create({
        collection: 'form-submissions',
        data: {
          form: Number(formId),
          submissionData: submissionDataArray,
          dynamicFields: dynamicFields,
          submissionSummary: submissionSummary,
        },
      })

      console.log('Form submission created successfully:', {
        submissionId: submission.id,
        formId: formId,
        fieldCount: dynamicFields.length,
      })

      // Check if this is a demo booking form and send emails
      let emailResults = null
      if (formData.title && formData.title.toLowerCase().includes('demo')) {
        console.log('Detected demo booking form, attempting to send emails...')
        
        // Validate and extract booking data
        const validation = EmailService.validateBookingFormData(submissionData)
        
        if (validation.isValid && validation.formData) {
          try {
            emailResults = await EmailService.sendBookingEmails(validation.formData)
            console.log('Email sending results:', emailResults)
          } catch (emailError) {
            console.error('Email sending failed:', emailError)
            // Don't fail the form submission if email fails
            emailResults = {
              customerEmail: { success: false, message: 'Email sending failed', error: String(emailError) },
              adminEmail: { success: false, message: 'Email sending failed', error: String(emailError) },
            }
          }
        } else {
          console.log('Form data validation failed for email:', validation.errors)
        }
      }

      return NextResponse.json(
        {
          message: 'Form submitted successfully',
          submission: {
            id: submission.id,
            form: submission.form,
            createdAt: submission.createdAt,
          },
          emails: emailResults ? {
            customerEmailSent: emailResults.customerEmail.success,
            adminEmailSent: emailResults.adminEmail.success,
            emailErrors: [
              ...(emailResults.customerEmail.success ? [] : [emailResults.customerEmail.error]),
              ...(emailResults.adminEmail.success ? [] : [emailResults.adminEmail.error]),
            ].filter(Boolean),
          } : null,
        },
        { status: 201 },
      )
    } catch (createError) {
      console.error('Error creating submission:', createError)
      return NextResponse.json(
        {
          message: 'Failed to save form submission',
          error: createError instanceof Error ? createError.message : String(createError),
        },
        { status: 500 },
      )
    }
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
