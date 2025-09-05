// Create this file as: src/templates/formSubmissionEmail.ts

export interface FormSubmissionData {
  id: string | number
  formTitle: string
  createdAt: string
  submissionData: any
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
    // Handle array format (most common with Payload form builder)
    submissionData.forEach((field, index) => {
      if (typeof field === 'object' && field !== null) {
        const fieldName = field.name || field.field || `Field ${index + 1}`
        const fieldValue = field.value || field.data || 'No value'
        const fieldLabel = fieldMappings[fieldName] || field.label || fieldName

        formFieldsHtml += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #f0f0f0;">
            <div style="color: #666666; font-size: 16px; font-weight: 400;">
              ${fieldLabel}
            </div>
            <div style="color: #000000; font-size: 16px; font-weight: 500; text-align: right; max-width: 60%;">
              ${fieldValue}
            </div>
          </div>
        `
        formFieldsText += `${fieldLabel}: ${fieldValue}\n`
      }
    })
  } else if (submissionData && typeof submissionData === 'object') {
    // Handle object format
    Object.entries(submissionData).forEach(([key, value]) => {
      const fieldLabel = fieldMappings[key] || key.charAt(0).toUpperCase() + key.slice(1)

      formFieldsHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #f0f0f0;">
          <div style="color: #666666; font-size: 16px; font-weight: 400;">
            ${fieldLabel}
          </div>
          <div style="color: #000000; font-size: 16px; font-weight: 500; text-align: right; max-width: 60%;">
            ${value || '(No value provided)'}
          </div>
        </div>
      `
      formFieldsText += `${fieldLabel}: ${value || '(No value provided)'}\n`
    })
  }

  // Fallback if no data
  if (!formFieldsHtml) {
    formFieldsHtml = `
      <div style="padding: 40px; text-align: center; color: #999999; font-style: italic;">
        No form data received
      </div>
    `
    formFieldsText = 'No form data received'
  }

  const subject = `New ${formTitle} Submission - #${id}`

  const textContent = `
NEW FORM SUBMISSION

Form: ${formTitle}
Submission ID: #${id}
Submitted: ${new Date(createdAt).toLocaleString()}

SUBMISSION DETAILS:
${formFieldsText}

Access the admin panel to view full details and manage this submission.
  `.trim()

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New ${formTitle} Submission</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
      
      <!-- Container -->
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="margin-bottom: 40px;">
          <!-- Company Logo/Name -->
          <div style="display: flex; align-items: center; margin-bottom: 30px;">
            <div style="width: 12px; height: 12px; background-color: #ff6b6b; border-radius: 50%; margin-right: 6px;"></div>
            <div style="width: 12px; height: 12px; background-color: #4ecdc4; border-radius: 50%; margin-right: 6px;"></div>
            <div style="width: 12px; height: 12px; background-color: #45b7d1; border-radius: 50%; margin-right: 12px;"></div>
            <span style="color: #000000; font-size: 18px; font-weight: 600;">Company</span>
          </div>

          <!-- Main Title -->
          <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: 700; line-height: 1.2;">
            New form<br>
            submission 📋
          </h1>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom: 30px;">
          <p style="margin: 0; color: #000000; font-size: 16px; line-height: 1.5;">
            Hi there,
          </p>
          <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px; line-height: 1.5;">
            You've received a new ${formTitle.toLowerCase()} submission 
            #${id}. Here are the details:
          </p>
        </div>

        <!-- Submission Summary -->
        <div style="background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
          <h2 style="margin: 0 0 20px 0; color: #000000; font-size: 20px; font-weight: 600;">
            Submission summary
          </h2>
          
          <!-- Submission Info -->
          <div style="display: flex; align-items: flex-start; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background-color: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
              <span style="font-size: 24px;">📋</span>
            </div>
            <div style="flex: 1;">
              <div style="color: #000000; font-size: 16px; font-weight: 600; margin-bottom: 4px;">
                ${formTitle}
              </div>
              <div style="color: #666666; font-size: 14px;">
                Submitted ${new Date(createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })} at ${new Date(createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div>
            ${formFieldsHtml}
          </div>

          <!-- Total/Summary Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 0 0 0; border-top: 2px solid #000000; margin-top: 20px;">
            <div style="color: #000000; font-size: 18px; font-weight: 700;">
              Submission ID
            </div>
            <div style="color: #000000; font-size: 18px; font-weight: 700;">
              #${id}
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div style="margin-bottom: 40px;">
          <a href="${serverUrl}/admin/collections/form-submissions" 
             style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
            View in Admin Panel
          </a>
        </div>

        <!-- Footer -->
        <div style="color: #999999; font-size: 14px; line-height: 1.5;">
          <p style="margin: 0;">
            This notification was sent automatically by your Payload CMS system.
          </p>
          <p style="margin: 8px 0 0 0;">
            Server: ${serverUrl}
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
