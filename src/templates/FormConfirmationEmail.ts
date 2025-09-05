// Create this file as: src/templates/formConfirmationEmail.ts

export interface FormConfirmationData {
  id: string | number
  formTitle: string
  createdAt: string
  submitterName?: string
  serverUrl?: string
}

export const generateFormConfirmationEmail = (data: FormConfirmationData) => {
  const { id, formTitle, createdAt, submitterName, serverUrl = 'localhost:3000' } = data

  const subject = `Thank you for your submission - ${formTitle}`

  const textContent = `
Hi ${submitterName || 'there'},

Thank you for contacting us! We've successfully received your ${formTitle.toLowerCase()} submission.

SUBMISSION DETAILS:
- Submission ID: #${id}
- Received: ${new Date(createdAt).toLocaleString()}
- Form: ${formTitle}

We'll review your submission and get back to you as soon as possible. If you have any urgent questions, please don't hesitate to contact us directly.

Thank you for your interest!

Best regards,
The Team
  `.trim()

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for your submission</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
    <div style="max-width:680px; margin:0 auto; background-color:#ffffff; box-shadow:0 4px 6px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#00AA77 0%,#002D20 100%); padding:30px 40px; text-align:center;">
        <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:300; letter-spacing:1px;">
          Submission Confirmed ✅
        </h1>
        <p style="margin:10px 0 0 0; color:#e8eaff; font-size:16px; opacity:0.9;">
          ${formTitle}
        </p>
      </div>

      <!-- Content -->
      <div style="padding:40px;">

        <!-- Greeting -->
        <div style="margin-bottom:30px;">
          <p style="margin:0; color:#495057; font-size:16px; line-height:1.5;">
            Hi ${submitterName || 'there'},
          </p>
          <p style="margin:10px 0 0 0; color:#495057; font-size:16px; line-height:1.5;">
            Thank you for contacting us! We've successfully received your ${formTitle.toLowerCase()} 
            submission and will review it shortly.
          </p>
        </div>

        <!-- Confirmation Summary -->
        <div style="background-color:#f8f9fa; border:1px solid #e9ecef; border-radius:8px; padding:25px; margin-bottom:30px;">
          <h2 style="margin:0 0 20px 0; color:#495057; font-size:20px; font-weight:600;">
            Confirmation Summary
          </h2>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:15px; color:#6c757d; font-size:14px;">
            <div>
              <strong style="color:#495057;">Submission ID:</strong><br>
              #${id}
            </div>
            <div>
              <strong style="color:#495057;">Date & Time:</strong><br>
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
          <div style="margin-top:20px; padding-top:15px; border-top:1px solid #e9ecef; color:#28a745; font-weight:600;">
            Status: Received
          </div>
        </div>

        <!-- Next Steps -->
        <div style="margin-bottom:30px;">
          <h3 style="color:#495057; font-size:18px; font-weight:600; margin:0 0 16px 0;">
            What happens next?
          </h3>
          <ul style="margin:0; padding-left:20px; color:#6c757d; font-size:16px; line-height:1.6;">
            <li style="margin-bottom:8px;">Our team will review your submission</li>
            <li style="margin-bottom:8px;">We'll get back to you within 1-2 business days</li>
            <li>Keep this email for your records</li>
          </ul>
        </div>

        <!-- Action Button -->
        <div style="text-align:center; margin:30px 0;">
          <a href="${serverUrl}" 
            style="display:inline-block; background:#00AA77; color:#ffffff; text-decoration:none; padding:12px 30px; border-radius:6px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; font-size:14px; box-shadow:0 4px 15px rgba(102,126,234,0.3);">
            Visit Our Website
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color:#f8f9fa; border-top:1px solid #e9ecef; padding:25px 40px; text-align:center;">
        <p style="margin:0; color:#6c757d; font-size:13px; line-height:1.6;">
          Thank you for your interest! If you have any urgent questions, please contact us directly.<br>
          <span style="color:#adb5bd;">Server: ${serverUrl}</span>
        </p>
        <p style="margin-top:16px; font-size:12px; color:#adb5bd;">
          This is an automated confirmation email. Please do not reply to this message.
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
