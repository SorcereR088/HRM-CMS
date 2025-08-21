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
// Import your navbar global
import Navbar from './globals/Navbar'

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
  // Add globals array here
  globals: [Navbar],
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
          useAsTitle: 'form',
          defaultColumns: ['form', 'dynamicFields', 'createdAt'],
          listSearchableFields: ['dynamicFields'],
        },
        access: {
          read: () => true,
          create: () => true,
          update: () => true,
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
      },
    }),
  ],
})
