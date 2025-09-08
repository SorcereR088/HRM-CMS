import { FormSubmissionData, EmailResult } from './types'
import { extractEmailFromSubmission, extractNameFromSubmission } from './extractors'
import { generateFormSubmissionEmail } from '../../templates/FormSubmissionEmail'
import { generateFormConfirmationEmail } from '../../templates/FormConfirmationEmail'

export const handleFormSubmissionEmails = async ({ doc, req, operation }: any) => {
  // Only process emails for new submissions
  if (operation !== 'create') {
    return
  }

  try {
    console.log('📧 Processing form submission emails for ID:', doc.id)

    const formTitle = doc.form?.title || 'Unknown Form'
    const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'localhost:3000'

    // Extract submitter's email and name
    const submitterEmail = extractEmailFromSubmission(doc.submissionData)
    const submitterName = extractNameFromSubmission(doc.submissionData)

    // Prepare email promises for parallel execution
    const emailPromises: Promise<EmailResult>[] = []

    // 1. Admin notification email
    const adminEmailContent = generateFormSubmissionEmail({
      id: doc.id,
      formTitle,
      createdAt: doc.createdAt,
      submissionData: doc.submissionData,
      serverUrl,
    })

    emailPromises.push(
      req.payload
        .sendEmail({
          to: process.env.ADMIN_EMAIL || process.env.MAIL_FROM_ADDRESS || 'admin@vianet.com.np',
          from: process.env.MAIL_FROM_ADDRESS || 'software@vianet.com.np',
          ...adminEmailContent,
        })
        .then(() => {
          console.log('✅ Admin notification email sent')
          return { type: 'admin' as const, success: true }
        })
        .catch((error: Error) => {
          console.error('❌ Admin email failed:', error.message)
          return { type: 'admin' as const, success: false, error: error.message }
        }),
    )

    // 2. Confirmation email to submitter (if email found)
    if (submitterEmail) {
      const confirmationEmailContent = generateFormConfirmationEmail({
        id: doc.id,
        formTitle,
        createdAt: doc.createdAt,
        submitterName: submitterName || undefined,
        serverUrl,
      })

      // Use no-reply address for confirmation emails
      const noReplyEmail =
        process.env.NO_REPLY_EMAIL ||
        `no-reply@${process.env.MAIL_FROM_ADDRESS?.split('@')[1] || 'vianet.com.np'}`

      emailPromises.push(
        req.payload
          .sendEmail({
            to: submitterEmail,
            from: noReplyEmail,
            replyTo: process.env.MAIL_FROM_ADDRESS || 'software@vianet.com.np',
            ...confirmationEmailContent,
          })
          .then(() => {
            console.log('✅ Confirmation email sent to submitter')
            return { type: 'confirmation' as const, success: true }
          })
          .catch((error: Error) => {
            console.error('❌ Confirmation email failed:', error.message)
            return {
              type: 'confirmation' as const,
              success: false,
              error: error.message,
            }
          }),
      )
    } else {
      console.log('⚠️ No email address found - skipping confirmation email')
    }

    // Execute all emails in parallel using the pooled connection
    const results = await Promise.allSettled(emailPromises)
    console.log('📊 Email sending summary:', results.length, 'emails processed')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Email processing failed:', errorMessage)
  }
}
