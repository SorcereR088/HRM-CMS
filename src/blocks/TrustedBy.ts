import { Block } from 'payload'

const TrustedBy: Block = {
  slug: 'trusted-by',
  labels: {
    singular: 'Trusted By Section',
    plural: 'Trusted By Sections',
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
