import { CollectionConfig } from 'payload'

import Navbar from '../blocks/Navbar'
import Hero from '../blocks/Hero'
import TrustedBy from '../blocks/TrustedBy'

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    preview: (doc) => {
      if (process.env.PAYLOAD_PUBLIC_SERVER_URL) {
        return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/preview?slug=${doc.slug}&collection=pages`
      }
      return `http://localhost:3000/preview?slug=${doc.slug}&collection=pages`
    },
    livePreview: {
      url: ({ data, collectionConfig, payload }) => {
        const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

        // For home page, use root path
        if (data.slug === 'home') {
          return `${baseUrl}/api/preview?slug=home&collection=pages`
        }

        return `${baseUrl}/api/preview?slug=${data.slug}&collection=pages`
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Page Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description:
          'This will be the URL path for this page (e.g., "home", "contact-us", "book-a-demo")',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            return value
              ?.toLowerCase()
              .replace(/ /g, '-')
              .replace(/[^\w-]/g, '')
          },
        ],
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
      admin: {
        description: 'SEO title for this page',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
      admin: {
        description: 'SEO description for this page',
      },
    },
    {
      name: 'content',
      type: 'blocks',
      required: true,
      label: 'Page Sections',
      admin: {
        initCollapsed: false,
        description: 'Drag and drop to reorder sections',
      },
      blocks: [Navbar, Hero, TrustedBy],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req, operation }) => {
        // You can add cache revalidation logic here if needed
        console.log(`Page "${doc.title}" was ${operation}d`)
      },
    ],
  },
}

export default Pages
