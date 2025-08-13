import { Block } from 'payload'

const FooterBlock: Block = {
  slug: 'footer',
  labels: {
    singular: 'Footer Section',
    plural: 'Footer Sections',
  },
  fields: [
    {
      name: 'mainHeading',
      type: 'text',
      label: 'Main Heading',
      required: true,
      defaultValue: 'Experience YAK HRM in action',
      admin: {
        description: 'Main call-to-action heading',
      },
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Call to Action Button',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Button Text',
          required: true,
          defaultValue: 'Book a demo',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
          required: false,
          admin: {
            description: 'Link destination for the button',
          },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Links',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'Socials',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Social Media Links',
          maxRows: 6,
          fields: [
            {
              name: 'platform',
              type: 'text',
              label: 'Platform Name',
              required: true,
              admin: {
                description: 'e.g., LinkedIn, Instagram, Facebook',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'Contacts',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          required: false,
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          required: false,
        },
        {
          name: 'address',
          type: 'text',
          label: 'Address',
          required: false,
        },
      ],
    },
    {
      name: 'footerBottom',
      type: 'group',
      label: 'Footer Bottom',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: '© 2025 CodeBright Pvt. Ltd.',
        },
        {
          name: 'designCredit',
          type: 'text',
          label: 'Design Credit',
          defaultValue: 'Website designed by CodeBright Pvt. Ltd.',
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      options: [
        {
          label: 'Teal Gradient',
          value: 'teal-gradient',
        },
        {
          label: 'Dark Green',
          value: 'dark-green',
        },
        {
          label: 'Custom Teal',
          value: 'custom-teal',
        },
      ],
      defaultValue: 'teal-gradient',
    },
  ],
}

export default FooterBlock
