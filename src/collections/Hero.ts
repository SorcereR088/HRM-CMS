import type { CollectionConfig } from 'payload'

const Hero: CollectionConfig = {
  slug: 'hero',
  admin: {
    useAsTitle: 'heading',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Main Heading',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading / Description',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image (optional)',
    },
  ],
}

export default Hero
