import { CollectionConfig } from 'payload'

import Hero from '../blocks/Hero'
import TrustedBy from '../blocks/TrustedBy'
import FeaturesBlock from '../blocks/Features'
import Highlight from '../blocks/Highlight'
import Testimonial from '../blocks/Testimonials'
import CrossPlatform from '../blocks/Crossplatform'
import Form from '../blocks/Form'
import BookADemo from '../blocks/BookADemo'
import AboutUs from '@/blocks/AboutUs'
import ContactUs from '@/blocks/ContactUs'
import Careers from '@/blocks/Careers'

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
          'This will be the URL path for this page (e.g., "home", "contact-us", "about-us")',
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
      blocks: [
        Hero,
        TrustedBy,
        FeaturesBlock,
        CrossPlatform,
        Highlight,
        Testimonial,
        BookADemo,
        Form,
        AboutUs,
        ContactUs,
        Careers,
      ],
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
      ({ doc, operation }) => {
        console.log(`Page "${doc.title}" was ${operation}d`)
      },
    ],
  },
}

export default Pages
