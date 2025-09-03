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

// Helper function to send form notification emails
async function sendFormNotificationEmails(
  payload: any,
  formData: Form,
  submission: any,
  dynamicFields: DynamicField[],
  submissionSummary: string
) {
  try {
    // Check if the form has email configurations
    if (!formData.emails || !Array.isArray(formData.emails) || formData.emails.length === 0) {
      console.log('No email configurations found for form:', formData.id)
      return
    }

    console.log('Processing email configurations for form:', formData.id, 'Count:', formData.emails.length)

    // Process each email configuration
    for (const emailConfig of formData.emails) {
      try {
        // Parse email recipients
        const emailTo = emailConfig.emailTo || ''
        const cc = emailConfig.cc || ''
        const bcc = emailConfig.bcc || ''
        const replyTo = emailConfig.replyTo || ''
        const emailFrom = emailConfig.emailFrom || process.env.MAIL_FROM_ADDRESS || 'sofware@vianet.com.np'
        
        if (!emailTo) {
          console.log('Skipping email config - no recipient specified')
          continue
        }

        // Process email subject and message with dynamic field replacement
        const subject = replacePlaceholders(emailConfig.subject || 'New Form Submission', dynamicFields)
        const messageText = emailConfig.message ? extractTextFromRichText(emailConfig.message) : ''
        const processedMessage = replacePlaceholders(messageText, dynamicFields)

        // Create HTML email content
        const htmlContent = createEmailHTML(formData, dynamicFields, submissionSummary, processedMessage, submission)

        console.log('Sending email to:', emailTo)

        // Send the email using Payload's email transport
        await payload.sendEmail({
          to: emailTo.split(',').map((email: string) => email.trim()),
          cc: cc ? cc.split(',').map((email: string) => email.trim()) : undefined,
          bcc: bcc ? bcc.split(',').map((email: string) => email.trim()) : undefined,
          replyTo: replyTo || undefined,
          from: emailFrom,
          subject,
          html: htmlContent,
        })

        console.log('Email sent successfully to:', emailTo)
      } catch (emailError) {
        console.error('Error sending individual email:', emailError)
        // Continue with next email configuration instead of failing completely
      }
    }
  } catch (error) {
    console.error('Error in sendFormNotificationEmails:', error)
    // Don't throw the error to avoid breaking form submission
  }
}

// Helper function to replace placeholders in text with form field values
function replacePlaceholders(text: string, dynamicFields: DynamicField[]): string {
  let result = text

  // Replace {{*}} with all form data
  if (result.includes('{{*}}')) {
    const allFieldsText = dynamicFields
      .map(field => `${field.fieldLabel}: ${field.fieldValue}`)
      .join('\n')
    result = result.replace(/\{\{\*\}\}/g, allFieldsText)
  }

  // Replace {{*:table}} with HTML table format
  if (result.includes('{{*:table}}')) {
    const tableHtml = `
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Field</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Value</th>
          </tr>
        </thead>
        <tbody>
          ${dynamicFields.map(field => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px;"><strong>${field.fieldLabel}</strong></td>
              <td style="border: 1px solid #ddd; padding: 12px;">${field.fieldValue}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    result = result.replace(/\{\{\*:table\}\}/g, tableHtml)
  }

  // Replace individual field placeholders {{fieldName}}
  dynamicFields.forEach(field => {
    const placeholder = new RegExp(`\\{\\{${field.fieldName}\\}\\}`, 'g')
    result = result.replace(placeholder, field.fieldValue)
  })

  return result
}

// Helper function to extract text from rich text content
function extractTextFromRichText(richText: any): string {
  if (typeof richText === 'string') {
    return richText
  }

  if (richText && richText.root && richText.root.children) {
    return richText.root.children
      .map((child: any) => {
        if (child.text) return child.text
        if (child.children) {
          return child.children.map((grandchild: any) => grandchild.text || '').join('')
        }
        return ''
      })
      .join('\n')
  }

  return ''
}

// Helper function to create HTML email content
function createEmailHTML(
  formData: Form,
  dynamicFields: DynamicField[],
  submissionSummary: string,
  customMessage: string,
  submission: any
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">New Form Submission</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Form: ${formData.title}</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        ${customMessage ? `
          <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #667eea; margin-bottom: 30px; border-radius: 0 5px 5px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Message</h3>
            <div style="color: #555; line-height: 1.6;">${customMessage.replace(/\n/g, '<br>')}</div>
          </div>
        ` : ''}
        
        <h3 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Submitted Information</h3>
        
        <table style="border-collapse: collapse; width: 100%; background: white;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="border: 1px solid #e0e0e0; padding: 15px; text-align: left; font-weight: 600; color: #495057;">Field</th>
              <th style="border: 1px solid #e0e0e0; padding: 15px; text-align: left; font-weight: 600; color: #495057;">Value</th>
            </tr>
          </thead>
          <tbody>
            ${dynamicFields.map(field => `
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="border: 1px solid #e0e0e0; padding: 15px; background: #fafafa; font-weight: 500; color: #495057;">${field.fieldLabel}</td>
                <td style="border: 1px solid #e0e0e0; padding: 15px; color: #212529;">${field.fieldValue || '<em>Not provided</em>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #28a745;">
          <h4 style="margin: 0 0 15px 0; color: #333;">Submission Details</h4>
          <p style="margin: 5px 0; color: #666;"><strong>Submission ID:</strong> ${submission.id}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Form ID:</strong> ${formData.id}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Submitted:</strong> ${new Date(submission.createdAt).toLocaleString()}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Total Fields:</strong> ${dynamicFields.length}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <div style="text-align: center; color: #6c757d; font-size: 14px;">
          <p style="margin: 0;">Sent from ${process.env.MAIL_FROM_NAME || 'Yak HRM'}</p>
          <p style="margin: 5px 0 0 0;">This is an automated notification from the HRM system.</p>
        </div>
      </div>
    </div>
  `
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

      // Send email notifications if configured for this form
      await sendFormNotificationEmails(payload, formData, submission, dynamicFields, submissionSummary)

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
