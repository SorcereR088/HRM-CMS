import { PayloadRequest } from 'payload'
import { EmailResult } from './types'
import { generateFormSubmissionEmail } from '../../templates/FormSubmissionEmail'
import { generateFormConfirmationEmail } from '../../templates/FormConfirmationEmail'

// Define proper types for form submission document
interface FormSubmissionField {
  field: string
  value: string | number | boolean | undefined
}

interface FormSubmissionDocument {
  id: string
  createdAt: string
  form?: {
    title?: string
  }
  submissionData: FormSubmissionField[] | Record<string, unknown>
}

// Helper function to normalize submission data for email templates
const normalizeSubmissionDataForEmail = (
  data: FormSubmissionField[] | Record<string, unknown>,
): FormSubmissionField[] => {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      field: item.field,
      value:
        typeof item.value === 'string' ||
        typeof item.value === 'number' ||
        typeof item.value === 'boolean'
          ? item.value
          : item.value
            ? String(item.value)
            : undefined,
    }))
  }

  // Convert object to array format
  return Object.entries(data).map(([field, value]) => ({
    field,
    value:
      typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
        ? value
        : value
          ? String(value)
          : undefined,
  }))
}

// Helper function to extract email from normalized data
const extractEmailFromNormalizedData = (data: FormSubmissionField[]): string | null => {
  const emailField = data.find(
    (item) =>
      item.field.toLowerCase().includes('email') ||
      item.field.toLowerCase() === 'email' ||
      item.field.toLowerCase() === 'e-mail',
  )

  return emailField && typeof emailField.value === 'string' ? emailField.value : null
}

// Helper function to extract name from normalized data
const extractNameFromNormalizedData = (data: FormSubmissionField[]): string | null => {
  const nameField = data.find(
    (item) =>
      item.field.toLowerCase().includes('name') ||
      item.field.toLowerCase() === 'name' ||
      item.field.toLowerCase() === 'full_name' ||
      item.field.toLowerCase() === 'fullname',
  )

  return nameField && typeof nameField.value === 'string' ? nameField.value : null
}

interface HookContext {
  doc: FormSubmissionDocument
  req: PayloadRequest
  operation: string
}

export const handleFormSubmissionEmails = async ({ doc, req, operation }: HookContext) => {
  // Only process emails for new submissions
  if (operation !== 'create') {
    return
  }

  try {
    console.log('📧 Processing form submission emails for ID:', doc.id)

    const formTitle = doc.form?.title || 'Unknown Form'
    const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'localhost:3000'

    // Normalize submission data for email templates
    const normalizedSubmissionData = normalizeSubmissionDataForEmail(doc.submissionData)

    // Extract submitter's email and name from normalized data
    const submitterEmail = extractEmailFromNormalizedData(normalizedSubmissionData)
    const submitterName = extractNameFromNormalizedData(normalizedSubmissionData)

    // Prepare email promises for parallel execution
    const emailPromises: Promise<EmailResult>[] = []

    // 1. Admin notification email
    const adminEmailContent = generateFormSubmissionEmail({
      id: doc.id,
      formTitle,
      createdAt: doc.createdAt,
      submissionData: normalizedSubmissionData,
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
