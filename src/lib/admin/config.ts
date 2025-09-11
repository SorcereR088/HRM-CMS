import path from 'path'

export const getAdminConfig = (dirname: string) => ({
  user: 'users', // Assuming Users.slug is 'users'
  importMap: {
    baseDir: path.resolve(dirname),
  },
  livePreview: {
    url: ({ data }: { data: Record<string, unknown> }) => {
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
})
