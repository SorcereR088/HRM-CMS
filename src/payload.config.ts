import { buildConfig } from 'payload'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Import organized modules
import { getTransportOptions } from './lib/email/transport'
import { getFormBuilderConfig } from './lib/form-builder/config'
import { getAdminConfig } from './lib/admin/config'

// Import existing modules
import { testEmailHandler } from './endpoints/test-email'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Pages from './collections/Pages'
import Navbar from './globals/Navbar'
import Footer from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: getAdminConfig(dirname),

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

  // Email configuration (only in non-test environments)
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

  plugins: [payloadCloudPlugin(), formBuilderPlugin(getFormBuilderConfig())],
})
