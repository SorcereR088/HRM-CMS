import { buildConfig } from 'payload'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { testEmailHandler } from './endpoints/test-email'
import { generateFormSubmissionEmail } from './templates/FormSubmissionEmail'
import { generateFormConfirmationEmail } from './templates/FormConfirmationEmail'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Pages from './collections/Pages'
import Navbar from './globals/Navbar'
import Footer from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Helper function to extract email from form submission data
const extractEmailFromSubmission = (submissionData: any): string | null => {
  if (!submissionData) return null

  // Handle array format
  if (Array.isArray(submissionData)) {
    const emailField = submissionData.find(
      (field) =>
        field?.name === 'email' ||
        field?.field === 'email' ||
        (typeof field?.value === 'string' && field.value.includes('@')),
    )
    return emailField?.value || emailField?.data || null
  }

  // Handle object format
  if (typeof submissionData === 'object') {
    // Check for common email field names
    const emailValue =
      submissionData.email ||
      submissionData.emailAddress ||
      submissionData['email-address'] ||
      submissionData.Email

    if (emailValue && typeof emailValue === 'string' && emailValue.includes('@')) {
      return emailValue
    }

    // Fallback: find any field with @ symbol
    for (const [key, value] of Object.entries(submissionData)) {
      if (typeof value === 'string' && value.includes('@')) {
        return value
      }
    }
  }

  return null
}

// Helper function to extract name from form submission data
const extractNameFromSubmission = (submissionData: any): string | null => {
  if (!submissionData) return null

  // Handle array format
  if (Array.isArray(submissionData)) {
    const nameField = submissionData.find(
      (field) =>
        field?.name === 'text' ||
        field?.name === 'name' ||
        field?.name === 'fullName' ||
        field?.field === 'text' ||
        field?.field === 'name',
    )
    return nameField?.value || nameField?.data || null
  }

  // Handle object format
  if (typeof submissionData === 'object') {
    const nameValue =
      submissionData.text ||
      submissionData.name ||
      submissionData.fullName ||
      submissionData['full-name'] ||
      submissionData.Name

    if (nameValue && typeof nameValue === 'string') {
      return nameValue
    }
  }

  return null
}

// Optimized transport options with connection pooling
const getTransportOptions = () => ({
  host: process.env.MAIL_HOST || '172.16.61.53',
  port: parseInt(process.env.MAIL_PORT || '25', 10),
  secure: false,
  auth: undefined,
  tls: {
    rejectUnauthorized: false,
  },

  // Connection pooling to reuse connections
  pool: true,
  maxConnections: 5, // Maximum number of simultaneous connections
  maxMessages: 100, // Maximum number of messages per connection

  // Keep connections alive to avoid reconnecting
  keepAlive: true,

  // Rate limiting to prevent overwhelming the server
  rateLimit: 10, // Max 10 messages per second
  rateDelta: 1000, // Per 1000ms

  // Connection timeouts
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,

  // Disable debug logging in production and reduce development logs
  debug: process.env.MAIL_DEBUG === 'true',
  logger: process.env.MAIL_DEBUG === 'true',
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ data, locale }) => {
        const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return `${baseUrl}/preview/${data.slug}?id=${data.id}`
      },
      collections: ['pages'],
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },

  collections: [Users, Media, Pages],
  globals: [Navbar, Footer],

  endpoints: [
    {
      path: '/test-email',
      method: 'get',
      handler: testEmailHandler,
    },
  ],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  // Optimized email configuration
  ...(process.env.NODE_ENV !== 'test'
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.MAIL_FROM_ADDRESS || 'software@vianet.com.np',
          defaultFromName: process.env.MAIL_FROM_NAME?.replace(/"/g, '') || 'Yak HRM',
          transportOptions: getTransportOptions(),
        }),
      }
    : {}),

  sharp,
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [
    'http://localhost:3000',
    'https://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),
  csrf: [
    'http://localhost:3000',
    'https://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),
  plugins: [
    payloadCloudPlugin(),
    formBuilderPlugin({
      fields: {
        text: true,
        email: true,
        phone: true,
        textarea: true,
        number: true,
        select: true,
        checkbox: true,
        country: true,
        state: true,
        payment: false,
      },
      formOverrides: {
        slug: 'forms',
        admin: {
          useAsTitle: 'title',
          defaultColumns: ['title', 'updatedAt'],
        },
        access: {
          read: () => true,
          create: () => true,
          update: () => true,
          delete: () => true,
        },
        fields: ({ defaultFields }) =>
          defaultFields.map((field) => {
            if ('name' in field && field.name === 'fields') {
              return {
                ...field,
                admin: {
                  ...field.admin,
                  readOnly: false,
                  disabled: false,
                },
              } as typeof field
            }
            return field
          }),
      },
      formSubmissionOverrides: {
        slug: 'form-submissions',
        labels: {
          singular: 'Form Submission',
          plural: 'Form Submissions',
        },
        admin: {
          defaultColumns: ['id', 'form', 'createdAt'],
          useAsTitle: 'submissionSummary',
        },
        access: {
          read: () => true,
          create: () => true,
          update: () => false,
          delete: () => true,
        },
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'dynamicFields',
            type: 'array',
            label: 'Submitted Fields',
            admin: {
              readOnly: true,
              description: 'All fields submitted with this form',
            },
            fields: [
              {
                name: 'fieldName',
                type: 'text',
                label: 'Field Name',
                admin: { readOnly: true },
              },
              {
                name: 'fieldLabel',
                type: 'text',
                label: 'Field Label',
                admin: { readOnly: true },
              },
              {
                name: 'fieldValue',
                type: 'textarea',
                label: 'Field Value',
                admin: { readOnly: true },
              },
              {
                name: 'fieldType',
                type: 'text',
                label: 'Field Type',
                admin: { readOnly: true },
              },
            ],
          },
          {
            name: 'submissionSummary',
            type: 'textarea',
            label: 'Quick Summary',
            admin: {
              readOnly: true,
              description: 'Human-readable summary of all submitted data',
            },
          },
        ],
        hooks: {
          afterChange: [
            async ({ doc, req, operation }) => {
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
                const emailPromises: Promise<any>[] = []

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
                      to:
                        process.env.ADMIN_EMAIL ||
                        process.env.MAIL_FROM_ADDRESS ||
                        'admin@vianet.com.np',
                      from: process.env.MAIL_FROM_ADDRESS || 'software@vianet.com.np',
                      ...adminEmailContent,
                    })
                    .then((result) => {
                      console.log('✅ Admin notification email sent')
                      return { type: 'admin', success: true }
                    })
                    .catch((error) => {
                      console.error('❌ Admin email failed:', error.message)
                      return { type: 'admin', success: false, error: error.message }
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
                      .then((result) => {
                        console.log('✅ Confirmation email sent to submitter')
                        return { type: 'confirmation', success: true }
                      })
                      .catch((error) => {
                        console.error('❌ Confirmation email failed:', error.message)
                        return { type: 'confirmation', success: false, error: error.message }
                      }),
                  )
                } else {
                  console.log('⚠️ No email address found - skipping confirmation email')
                }

                // Execute all emails in parallel using the pooled connection
                const results = await Promise.allSettled(emailPromises)
                console.log('📊 Email sending summary:', results.length, 'emails processed')
              } catch (error: any) {
                console.error('❌ Email processing failed:', error.message)
              }
            },
          ],
        },
      },
    }),
  ],
})
