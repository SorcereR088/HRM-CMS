import type { CollectionConfig } from 'payload'

const TrustedBy: CollectionConfig = {
  slug: 'trusted-by',
  admin: {
    useAsTitle: 'highlightText', // Use the highlighted part as the display title
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'preText',
      label: 'Text before highlighted part',
      type: 'text',
      required: true,
    },
    {
      name: 'highlightText',
      label: 'Highlighted text (e.g. 1000+)',
      type: 'text',
      required: true,
    },
    {
      name: 'postText',
      label: 'Text after highlighted part',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
      required: false,
    },
    {
      name: 'logos',
      label: 'Company Logos',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'logo',
          label: 'Logo Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

export default TrustedBy
