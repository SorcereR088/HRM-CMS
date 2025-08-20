// Update your BookADemo block configuration file
import { Block } from 'payload'

const BookADemo: Block = {
  slug: 'book-demo',
  labels: {
    singular: 'Book a Demo',
    plural: 'Book a Demo Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Experience YAK HRM in action',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
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
            { label: 'Upload Icon', value: 'upload' },
            { label: 'Icon URL', value: 'url' },
            { label: 'Lucide Icon', value: 'lucide' },
            { label: 'Iconify Icon', value: 'iconify' },
          ],
          defaultValue: 'lucide',
        },
        {
          name: 'iconUpload',
          type: 'upload',
          label: 'Upload Icon',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.iconType === 'upload',
          },
        },
        {
          name: 'iconUrl',
          type: 'text',
          label: 'Icon URL',
          admin: {
            condition: (data, siblingData) => siblingData?.iconType === 'url',
          },
        },
        {
          name: 'lucideIcon',
          type: 'text',
          label: 'Lucide Icon Name',
          admin: {
            condition: (data, siblingData) => siblingData?.iconType === 'lucide',
          },
        },
        {
          name: 'iconifyIcon',
          type: 'text',
          label: 'Iconify Icon Name',
          admin: {
            condition: (data, siblingData) => siblingData?.iconType === 'iconify',
          },
        },
      ],
    },
    {
      name: 'formHeading',
      type: 'text',
      label: 'Form Heading',
      defaultValue: "Fill out the form and we'll reach you out soon",
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Select Form',
      admin: {
        description:
          'Choose a form created with the Form Builder plugin. Leave empty to use default fields.',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Gray', value: 'gray-50' },
      ],
      defaultValue: 'white',
    },
  ],
}

export default BookADemo
