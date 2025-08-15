import { buildConfig } from 'payload'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Pages from './collections/Pages'

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
        fields: ({ defaultFields }) => [
          {
            name: 'formtitle',
            type: 'text',
            required: true,
            admin: {
              position: 'sidebar',
            },
          },
          {
            name: 'formconfirmationMessage',
            type: 'richText',
            editor: lexicalEditor(),
            label: 'Confirmation Message',
            admin: {
              description: 'Message to show after form submission',
            },
          },
          {
            name: 'formredirect',
            type: 'text',
            label: 'Redirect URL (optional)',
            admin: {
              description: 'URL to redirect to after form submission (optional)',
            },
          },
          ...defaultFields,
        ],
      },
      formSubmissionOverrides: {
        slug: 'form-submissions',
        labels: {
          singular: 'Form Submission',
          plural: 'Form Submissions',
        },
      },
    }),
  ],
})
