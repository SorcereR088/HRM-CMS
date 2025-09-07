import { PayloadHandler } from 'payload'

// Define comprehensive interfaces
interface EmailConfiguration {
  to: string
  from: string
  subject: string
  text: string
  html: string
}

interface EmailSendResult {
  messageId?: string
  response?: string
  envelope?: {
    from: string
    to: string[]
  }
  accepted?: string[]
  rejected?: string[]
  pending?: string[]
}

interface EmailSuccessResponse {
  success: true
  message: string
  emailSentTo: string
  messageId: string
  response?: string
  accepted?: string[]
  rejected?: string[]
  timestamp: string
}

interface EmailErrorResponse {
  success: false
  error: string
  code?: string
  response?: string
  details: string
  timestamp: string
}

// Keep the union type and use it
type EmailResponse = EmailSuccessResponse | EmailErrorResponse

// Custom error type guard
function isEmailError(error: unknown): error is Error & {
  code?: string
  command?: string
  response?: string
  responseCode?: number
} {
  return error instanceof Error
}

// Helper function to create typed responses
function createResponse(data: EmailResponse, status = 200): Response {
  return Response.json(data, { status })
}

export const testEmailHandler: PayloadHandler = async (req): Promise<Response> => {
  try {
    console.log('🧪 Testing email configuration...')

    // Get email from query parameter or use default
    const toEmail = (req.query?.to as string) || 'test@example.com'

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(toEmail)) {
      const errorResponse: EmailErrorResponse = {
        success: false,
        error: 'Invalid email format',
        details: `Provided email "${toEmail}" is not valid`,
        timestamp: new Date().toISOString(),
      }
      return createResponse(errorResponse, 400)
    }

    // Test email configuration
    const emailData: EmailConfiguration = {
      to: toEmail,
      from: process.env.MAIL_FROM_ADDRESS || 'software@vianet.com.np',
      subject: 'Test Email from Payload CMS',
      text: 'This is a test email to verify SMTP configuration is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email from Payload CMS</h2>
          <p>This is a test email to verify your SMTP configuration is working correctly.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p><strong>SMTP Configuration:</strong></p>
          <ul>
            <li>Host: ${process.env.MAIL_HOST || 'Not set'}</li>
            <li>Port: ${process.env.MAIL_PORT || 'Not set'}</li>
            <li>From: ${process.env.MAIL_FROM_ADDRESS || 'Not set'}</li>
            <li>Authentication: ${process.env.MAIL_USERNAME === 'null' ? 'None' : 'Yes'}</li>
          </ul>
          <p style="color: #666; font-size: 12px;">
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
    }

    console.log('📧 Attempting to send test email to:', emailData.to)

    // Send email using Payload's sendEmail method
    const result = (await req.payload.sendEmail(emailData)) as EmailSendResult

    console.log('✅ Email sent successfully!', result)

    // Return success response
    const successResponse: EmailSuccessResponse = {
      success: true,
      message: 'Test email sent successfully',
      emailSentTo: emailData.to,
      messageId: result?.messageId || 'Unknown',
      response: result?.response,
      accepted: result?.accepted,
      rejected: result?.rejected,
      timestamp: new Date().toISOString(),
    }

    return createResponse(successResponse)
  } catch (error) {
    console.error('❌ Email send failed:', error)

    // Type-safe error handling
    let errorResponse: EmailErrorResponse

    if (isEmailError(error)) {
      errorResponse = {
        success: false,
        error: error.message,
        code: error.code,
        response: error.response,
        details: error.stack || 'No stack trace available',
        timestamp: new Date().toISOString(),
      }
    } else if (typeof error === 'string') {
      errorResponse = {
        success: false,
        error,
        details: 'String error thrown',
        timestamp: new Date().toISOString(),
      }
    } else {
      errorResponse = {
        success: false,
        error: 'Unknown error type',
        details: String(error),
        timestamp: new Date().toISOString(),
      }
    }

    return createResponse(errorResponse, 500)
  }
}
