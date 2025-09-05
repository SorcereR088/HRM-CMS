// Create this file as: src/endpoints/test-email.ts
import { PayloadHandler } from 'payload'

export const testEmailHandler: PayloadHandler = async (req) => {
  try {
    console.log('🧪 Testing email configuration...')

    // Get email from query parameter or use default
    const toEmail = (req.query?.to as string) || 'test@example.com'

    // Test email data
    const emailData = {
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
    const result = (await req.payload.sendEmail(emailData)) as any

    console.log('✅ Email sent successfully!', result)

    // Return success response
    return Response.json({
      success: true,
      message: 'Test email sent successfully',
      emailSentTo: emailData.to,
      messageId: result?.messageId || 'Unknown',
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('❌ Email send failed:', error)

    // Return error response
    return Response.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        details: error.stack || 'No stack trace available',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
