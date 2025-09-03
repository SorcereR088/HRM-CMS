import { Block } from 'payload'

const ContactUs: Block = {
  slug: 'contact-us',
  labels: {
    singular: 'Contact Us',
    plural: 'Contact Us Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Get in touch with us',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        "We're happy to assist with any inquiries and guide you through what our system can offer.",
      required: false,
    },
    {
      name: 'contactInfo',
      type: 'array',
      label: 'Contact Information',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label (e.g. Email, Phone, Location)',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          label: 'Value (e.g. info@company.com, +977 9800000000, Office address)',
          required: true,
        },
        // Icon logic
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
      required: false,
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Select Form',
      required: false,
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
      defaultValue: 'gray-50',
      required: false,
    },
  ],
}

export default ContactUs
