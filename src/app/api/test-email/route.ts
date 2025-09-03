import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    
    const { to, subject, message } = body

    if (!to) {
      return NextResponse.json({ message: 'Email recipient is required' }, { status: 400 })
    }

    // Send test email using Payload's email transport
    await payload.sendEmail({
      to,
      subject: subject || 'Test Email from HRM System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">SMTP Configuration Test</h2>
          <p>This is a test email to verify that the SMTP configuration is working correctly.</p>
          ${message ? `<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;"><strong>Custom Message:</strong><br>${message}</div>` : ''}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Sent from: ${process.env.MAIL_FROM_NAME || 'Yak HRM'}<br>
            SMTP Server: ${process.env.MAIL_HOST || '172.16.61.53'}:${process.env.MAIL_PORT || '25'}<br>
            Timestamp: ${new Date().toISOString()}
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      message: 'Test email sent successfully',
      details: {
        to,
        subject: subject || 'Test Email from HRM System',
        smtpHost: process.env.MAIL_HOST || '172.16.61.53',
        smtpPort: process.env.MAIL_PORT || '25',
        fromAddress: process.env.MAIL_FROM_ADDRESS || 'sofware@vianet.com.np',
        fromName: process.env.MAIL_FROM_NAME || 'Yak HRM',
      },
    })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : String(error),
        details: {
          smtpHost: process.env.MAIL_HOST || '172.16.61.53',
          smtpPort: process.env.MAIL_PORT || '25',
          fromAddress: process.env.MAIL_FROM_ADDRESS || 'sofware@vianet.com.np',
          fromName: process.env.MAIL_FROM_NAME || 'Yak HRM',
        },
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test Email Endpoint',
    usage: 'POST to this endpoint with { "to": "email@example.com", "subject": "optional", "message": "optional" }',
    smtpConfig: {
      host: process.env.MAIL_HOST || '172.16.61.53',
      port: process.env.MAIL_PORT || '25',
      fromAddress: process.env.MAIL_FROM_ADDRESS || 'sofware@vianet.com.np',
      fromName: process.env.MAIL_FROM_NAME || 'Yak HRM',
      authConfigured: !!(process.env.MAIL_USERNAME && process.env.MAIL_USERNAME !== 'null'),
    },
  })
}