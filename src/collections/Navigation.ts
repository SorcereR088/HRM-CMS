import type { CollectionConfig } from 'payload'

const Navigation: CollectionConfig = {
  slug: 'navigation',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    //Logo Image
    {
      name: 'title',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo Image',
      required: true,
    },

    // Navigation Links
    {
      name: 'links',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },

    // Button
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Text',
      required: true,
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'CTA URL',
      required: true,
    },
  ],
}

export default Navigation
