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
    {
      name: 'title',
      type: 'text',
      label: 'Site Title or Logo Text',
      required: true,
    },

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

    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Text',
      required: true,
    },
  ],
}

export default Navigation
