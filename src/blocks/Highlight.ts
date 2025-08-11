import { Block } from 'payload'

const HighlightsBlock: Block = {
  slug: 'highlights',
  labels: {
    singular: 'Highlights Section',
    plural: 'Highlights Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      required: false,
      admin: {
        description: 'Optional heading for the highlights section',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Section Subheading',
      required: false,
      admin: {
        description: 'Optional subheading or description for the highlights section',
      },
    },
    {
      name: 'globalIcon',
      type: 'text',
      label: 'Global Icon (Iconify)',
      required: true,
      defaultValue: 'mdi:check-circle',
      admin: {
        description:
          'Enter an Iconify icon name that will be used for all highlight items (e.g., "mdi:check-circle", "heroicons:check-circle")',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlights List',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Highlight Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Highlight Description',
          required: true,
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      options: [
        {
          label: 'White',
          value: 'white',
        },
        {
          label: 'Light Gray',
          value: 'gray-50',
        },
        {
          label: 'Teal Light',
          value: 'teal-50',
        },
      ],
      defaultValue: 'white',
    },
  ],
}

export default HighlightsBlock
