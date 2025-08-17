import { Block } from 'payload'

const BookADemoBlock: Block = {
  slug: 'book-demo',
  labels: {
    singular: 'Book a Demo Section',
    plural: 'Book a Demo Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Main Heading',
      required: true,
      defaultValue: 'Experience YAK HRM in action',
      admin: {
        description: 'Main heading for the book demo section. Use "YAK" and "HRM" for green styling.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
      admin: {
        description: 'Optional description text below the heading',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features List',
      required: true,
      minRows: 1,
      defaultValue: [
        {
          title: 'Streamlined Operations',
          description: 'Handle HR tasks like attendance, payroll, and employee data from one easy-to-use platform',
          iconType: 'lucide',
          lucideIcon: 'Zap',
        },
        {
          title: 'Accurate & Compliant',
          description: 'Reduce errors and stay aligned with company policies and legal standards through automation',
          iconType: 'lucide',
          lucideIcon: 'Shield',
        },
        {
          title: 'Fits Any Team Size',
          description: 'Whether you\'re a small team or a large organization, the system scales with your needs',
          iconType: 'lucide',
          lucideIcon: 'Users',
        },
      ],
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
          defaultValue: 'lucide',
          options: [
            {
              label: 'Upload Icon',
              value: 'upload',
            },
            {
              label: 'Icon URL',
              value: 'url',
            },
            {
              label: 'Lucide Icon',
              value: 'lucide',
            },
            {
              label: 'Iconify Icon',
              value: 'iconify',
            },
          ],
        },
        {
          name: 'iconUpload',
          type: 'upload',
          relationTo: 'media',
          label: 'Upload Icon',
          admin: {
            condition: (_, siblingData) => siblingData.iconType === 'upload',
            description: 'Upload an icon/image file',
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
      name: 'formHeading',
      type: 'text',
      label: 'Form Heading',
      required: true,
      defaultValue: "Fill out the form and we'll reach you out soon",
      admin: {
        description: 'Heading text for the contact form',
      },
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
      ],
      defaultValue: 'white',
    },
  ],
}

export default BookADemoBlock