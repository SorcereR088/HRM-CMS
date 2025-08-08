import { CollectionConfig } from 'payload'
import Navbar from '../blocks/Navbar'
import Hero from '../blocks/Hero'
import TrustedBy from '../blocks/TrustedBy'

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
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
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [Navbar, Hero, TrustedBy],
    },
  ],
}
