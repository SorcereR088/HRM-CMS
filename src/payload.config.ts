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

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Pages from './collections/Pages'
import Navbar from './globals/Navbar'
import Footer from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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

  ...(process.env.NODE_ENV !== 'test'
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.MAIL_FROM_ADDRESS || 'software@vianet.com.np',
          defaultFromName: process.env.MAIL_FROM_NAME?.replace(/"/g, '') || 'Yak HRM',
          transportOptions: {
            host: process.env.MAIL_HOST || '172.16.61.53',
            port: parseInt(process.env.MAIL_PORT || '25', 10),
            secure: false,
            auth: undefined,
            tls: {
              rejectUnauthorized: false,
            },
            debug: process.env.NODE_ENV === 'development',
            logger: process.env.NODE_ENV === 'development',
            connectionTimeout: 60000,
            greetingTimeout: 30000,
            socketTimeout: 60000,
          },
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
              if (operation === 'create') {
                try {
                  console.log('📧 Processing form submission email for ID:', doc.id)

                  const formTitle = doc.form?.title || 'Unknown Form'
                  const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'localhost:3000'

                  // Generate email content using template
                  const emailContent = generateFormSubmissionEmail({
                    id: doc.id,
                    formTitle,
                    createdAt: doc.createdAt,
                    submissionData: doc.submissionData,
                    serverUrl,
                  })

                  // Send the email
                  const result = await req.payload.sendEmail({
                    to:
                      process.env.ADMIN_EMAIL ||
                      process.env.MAIL_FROM_ADDRESS ||
                      'admin@vianet.com.np',
                    from: process.env.MAIL_FROM_ADDRESS || 'software@vianet.com.np',
                    ...emailContent,
                  })

                  console.log('✅ Email sent successfully:', result)
                } catch (error: any) {
                  console.error('❌ Email notification failed:', error.message)
                }
              }
            },
          ],
        },
      },
    }),
  ],
})
