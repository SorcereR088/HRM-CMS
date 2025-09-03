import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Form } from '@/payload-types'

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
    const payload = await getPayload({ config })

    let requestData: RequestBody
    try {
      requestData = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { form, submissionData } = requestData

    console.log('Received form submission:', { form, submissionData })

    // Validate form ID - accept both string and number
    if (!form || (typeof form !== 'string' && typeof form !== 'number')) {
      console.error('Invalid form ID:', form, typeof form)
      return NextResponse.json({ message: 'Valid form ID is required' }, { status: 400 })
    }

    // Convert to string if it's a number
    const formId = String(form)

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

      // Handle email sending if configured in the form
      await handleFormEmails(payload, formData, submissionData, dynamicFields, submissionSummary)

      return NextResponse.json(
        {
          message: 'Form submitted successfully',
          submission: {
            id: submission.id,
            form: submission.form,
            createdAt: submission.createdAt,
          },
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

// Helper function to handle email sending for form submissions
async function handleFormEmails(
  payload: any,
  formData: Form,
  submissionData: SubmissionData,
  dynamicFields: DynamicField[],
  submissionSummary: string
) {
  try {
    // Check if the form has email configurations
    if (!formData.emails || !Array.isArray(formData.emails) || formData.emails.length === 0) {
      console.log('No email configurations found for form:', formData.title)
      return
    }

    console.log('Processing emails for form:', formData.title, 'Email configs:', formData.emails.length)

    // Process each email configuration
    for (const emailConfig of formData.emails) {
      if (!emailConfig || !emailConfig.subject) {
        console.log('Skipping invalid email configuration')
        continue
      }

      try {
        // Parse email addresses (could be comma-separated)
        const emailTo = emailConfig.emailTo?.split(',').map(email => email.trim()).filter(Boolean) || []
        const cc = emailConfig.cc?.split(',').map(email => email.trim()).filter(Boolean) || []
        const bcc = emailConfig.bcc?.split(',').map(email => email.trim()).filter(Boolean) || []

        if (emailTo.length === 0) {
          console.log('No valid email recipients found, skipping email')
          continue
        }

        // Process subject with field replacements
        const processedSubject = processEmailTemplate(emailConfig.subject, submissionData, submissionSummary)

        // Process message content with field replacements
        let processedMessage = ''
        if (emailConfig.message?.root) {
          // Extract text content from Lexical editor format
          processedMessage = extractTextFromLexical(emailConfig.message.root)
        }
        
        // If no message content, create a default message with form data
        if (!processedMessage.trim()) {
          processedMessage = `New form submission received for: ${formData.title}\n\n${submissionSummary}`
        }

        processedMessage = processEmailTemplate(processedMessage, submissionData, submissionSummary)

        console.log('Sending email:', {
          to: emailTo,
          subject: processedSubject,
          from: emailConfig.emailFrom || process.env.MAIL_FROM_ADDRESS
        })

        // Send email using Payload's email functionality
        await payload.sendEmail({
          to: emailTo.join(', '),
          cc: cc.length > 0 ? cc.join(', ') : undefined,
          bcc: bcc.length > 0 ? bcc.join(', ') : undefined,
          replyTo: emailConfig.replyTo || undefined,
          from: emailConfig.emailFrom || process.env.MAIL_FROM_ADDRESS || 'noreply@yakhrm.com',
          subject: processedSubject,
          text: processedMessage,
        })

        console.log('Email sent successfully to:', emailTo.join(', '))

      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Continue with other emails even if one fails
      }
    }

  } catch (error) {
    console.error('Error in handleFormEmails:', error)
  }
}

// Helper function to process email templates with field replacements
function processEmailTemplate(template: string, submissionData: SubmissionData, submissionSummary: string): string {
  let processed = template

  // Replace {{*}} with full submission summary
  processed = processed.replace(/\{\{\*\}\}/g, submissionSummary)

  // Replace {{*:table}} with HTML table format
  processed = processed.replace(/\{\{\*:table\}\}/g, createHtmlTable(submissionData))

  // Replace individual field values {{fieldName}}
  Object.entries(submissionData).forEach(([fieldName, fieldValue]) => {
    const regex = new RegExp(`\\{\\{${fieldName}\\}\\}`, 'g')
    processed = processed.replace(regex, String(fieldValue || ''))
  })

  return processed
}

// Helper function to create HTML table from submission data
function createHtmlTable(submissionData: SubmissionData): string {
  const rows = Object.entries(submissionData)
    .map(([field, value]) => `<tr><td><strong>${field}</strong></td><td>${value || ''}</td></tr>`)
    .join('')
  
  return `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
    <thead>
      <tr><th>Field</th><th>Value</th></tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>`
}

// Helper function to extract text content from Lexical editor format
function extractTextFromLexical(lexicalContent: any): string {
  if (!lexicalContent || !lexicalContent.children) {
    return ''
  }

  const extractText = (children: any[]): string => {
    return children.map((child: any) => {
      if (child.text) {
        return child.text
      }
      if (child.children) {
        return extractText(child.children)
      }
      return ''
    }).join('')
  }

  return extractText(lexicalContent.children)
}
