import { Block } from 'payload'

const FeaturesBlock: Block = {
  slug: 'features',
  labels: {
    singular: 'Features Section',
    plural: 'Features Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Main Heading',
      required: true,
      defaultValue: 'Features That Work The Way You Do.',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      required: false,
      defaultValue: 'Manage your employee, payroll, and processes — all in one place.',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features List',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Feature Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Feature Description',
          required: true,
        },
        {
          name: 'iconType',
          type: 'select',
          label: 'Icon Type',
          required: true,
          options: [
            {
              label: 'Upload Image/SVG',
              value: 'upload',
            },
            {
              label: 'Icon URL/Link',
              value: 'url',
            },
            {
              label: 'Lucide Icon Name',
              value: 'lucide',
            },
            {
              label: 'Iconify Icon',
              value: 'iconify',
            },
          ],
          defaultValue: 'upload',
        },
        {
          name: 'iconUpload',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon Image/SVG',
          admin: {
            condition: (_, siblingData) => siblingData.iconType === 'upload',
            description: 'Upload an image or SVG file for the icon',
          },
        },
        {
          name: 'iconUrl',
          type: 'text',
          label: 'Icon URL',
          admin: {
            condition: (_, siblingData) => siblingData.iconType === 'url',
            description: 'Enter a URL to an icon/image',
          },
        },
        {
          name: 'lucideIcon',
          type: 'text',
          label: 'Lucide Icon Name',
          admin: {
            condition: (_, siblingData) => siblingData.iconType === 'lucide',
            description: 'Enter a Lucide icon name (e.g., "User", "Search", "Settings")',
          },
        },
        {
          name: 'iconifyIcon',
          type: 'text',
          label: 'Iconify Icon Name',
          admin: {
            condition: (_, siblingData) => siblingData.iconType === 'iconify',
            description:
              'Enter an Iconify icon name (e.g., "mdi:account", "heroicons:search", "ph:gear")',
          },
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
      defaultValue: 'gray-50',
    },
  ],
}

export default FeaturesBlock
