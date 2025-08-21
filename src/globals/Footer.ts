import { GlobalConfig } from 'payload'

const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  fields: [
    {
      name: 'mainHeading',
      type: 'text',
      label: 'Main Heading',
      defaultValue: 'Experience YAK HRM in action',
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'CTA Button',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Button Text',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Links Section',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'Follow Us',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Social Links',
          fields: [
            {
              name: 'platform',
              type: 'text',
              label: 'Platform Name',
              required: true,
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
          defaultValue: 'Contact Us',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
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
          defaultValue: '© 2024 YAK HRM. All rights reserved.',
        },
        {
          name: 'designCredit',
          type: 'text',
          label: 'Design Credit',
          defaultValue: 'Designed by CodeBright',
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

export default Footer
