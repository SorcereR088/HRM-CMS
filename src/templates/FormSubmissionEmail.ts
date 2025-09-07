interface FormFieldData {
  name?: string
  field?: string
  label?: string
  value?: string | number | boolean
  data?: string | number | boolean
}

type SubmissionDataValue = string | number | boolean | null | undefined

interface SubmissionDataObject {
  [key: string]: SubmissionDataValue
}

type SubmissionData = FormFieldData[] | SubmissionDataObject | null | undefined

export interface FormSubmissionData {
  id: string | number
  formTitle: string
  createdAt: string
  submissionData: SubmissionData
  serverUrl?: string
}

export const generateFormSubmissionEmail = (data: FormSubmissionData) => {
  const { id, formTitle, createdAt, submissionData, serverUrl = 'localhost:3000' } = data

  // Field name mappings for better presentation
  const fieldMappings: Record<string, string> = {
    text: 'Full Name',
    email: 'Email Address',
    number: 'Phone Number',
    company: 'Company',
    select: 'Company Members',
  }

  // Handle different form data structures
  let formFieldsHtml = ''
  let formFieldsText = ''

  if (submissionData && Array.isArray(submissionData)) {
    submissionData.forEach((field, index) => {
      if (typeof field === 'object' && field !== null) {
        const fieldName = field.name || field.field || `Field ${index + 1}`
        const fieldValue = field.value || field.data || 'No value'
        const fieldLabel = fieldMappings[fieldName] || field.label || fieldName

        formFieldsHtml += `
          <tr>
            <td style="padding: 12px 15px; border-bottom: 1px solid #e9ecef; background-color: #f8f9fa; font-weight: 600; color: #495057; width: 35%;">
              ${fieldLabel}
            </td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #e9ecef; color: #495057;">
              ${fieldValue}
            </td>
          </tr>
        `
        formFieldsText += `${fieldLabel}: ${fieldValue}\n`
      }
    })
  } else if (submissionData && typeof submissionData === 'object') {
    Object.entries(submissionData).forEach(([key, value]) => {
      const fieldLabel = fieldMappings[key] || key.charAt(0).toUpperCase() + key.slice(1)

      formFieldsHtml += `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #666666; font-size: 14px; width: 140px; vertical-align: top;">
            ${fieldLabel}
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; color: #000000; font-weight: 600;">
            ${value || '(No value provided)'}
          </td>
        </tr>
      `
      formFieldsText += `${fieldLabel}: ${value || '(No value provided)'}\n`
    })
  }

  // Fallback if no data
  if (!formFieldsHtml) {
    formFieldsHtml = `
      <tr>
        <td colspan="2" style="padding: 20px; text-align: center; color: #6c757d; font-style: italic;">
          No form data received
        </td>
      </tr>
    `
    formFieldsText = 'No form data received'
  }

  const subject = `New ${formTitle} Submission - ID #${id}`

  const textContent = `
NEW FORM SUBMISSION RECEIVED

Form: ${formTitle}
Submission ID: ${id}
Submitted: ${new Date(createdAt).toLocaleString()}

CONTACT DETAILS:
${formFieldsText}

Access the admin panel to view full details and manage this submission.
  `.trim()

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${formTitle} Submission</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #00AA77 0%, #002D20 100%); padding: 30px 40px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
            New Form Submission
          </h1>
          <p style="margin: 10px 0 0 0; color: #e8eaff; font-size: 16px; opacity: 0.9;">
            ${formTitle}
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
          
          <!-- Submission Info -->
          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h2 style="margin: 0; color: #495057; font-size: 20px; font-weight: 600;">
                Submission Details
              </h2>
              <span style="background-color: #28a745; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                New
              </span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; color: #6c757d; font-size: 14px;">
              <div>
                <strong style="color: #495057;">Submission ID:</strong><br>
                #${id}
              </div>
              <div>
                <strong style="color: #495057;">Date & Time:</strong><br>
                ${new Date(createdAt).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          <!-- Form Data -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #495057; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
              Contact Information
            </h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);">
              ${formFieldsHtml}
            </table>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin: 30px 0;">
           <a href="${serverUrl}/admin/collections/form-submissions" 
             style="display: inline-block; background: #00AA77; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 14px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              View in Admin Panel
          </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; border-top: 1px solid #e9ecef; padding: 25px 40px; text-align: center;">
          <p style="margin: 0; color: #6c757d; font-size: 13px; line-height: 1.6;">
            This notification was sent automatically by your Payload CMS system.<br>
            <span style="color: #adb5bd;">Server: ${serverUrl}</span>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return {
    subject,
    text: textContent,
    html: htmlContent,
  }
}
