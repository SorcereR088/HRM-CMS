import { Block } from 'payload'

export const AboutUs: Block = {
  slug: 'companyInfo',
  labels: {
    singular: 'Company Info',
    plural: 'Company Info Blocks',
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Company Name',
      defaultValue: 'CODE BRIGHT',
      required: false,
    },
    {
      name: 'logo',
      label: 'Company Logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'illustration',
      label: 'Side Illustration',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description:
          'Upload an image, SVG, or GIF for the right side illustration. Recommended size: 400x400px or larger.',
      },
    },
    {
      name: 'tagline',
      type: 'textarea',
      label: 'Tagline/Main Heading',
      defaultValue:
        'We would like to call ourselves problem solvers who incorporate software in the process.',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Company Description',
      defaultValue:
        'Code Bright Pvt. Ltd is a software development company that specializes in building innovative and scalable software solutions for businesses of all sizes. Our team of experienced developers, designers, and project managers work closely with clients to understand their specific needs and provide tailored solutions that help them achieve their business goals. We have been working with clients like Vianet for over 8 years, building a strong track record of delivering reliable and impactful software solutions.',
      required: true,
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
          defaultValue: 'Contact Us',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
          defaultValue: '#contact',
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Statistic Value',
          required: true,
          admin: {
            description: 'e.g., 1000+, 50+, 10',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Statistic Label',
          required: true,
          admin: {
            description: 'e.g., active users, projects completed, years in business',
          },
        },
      ],
      defaultValue: [
        {
          value: '1000+',
          label: 'active users',
        },
        {
          value: '50+',
          label: 'projects completed',
        },
        {
          value: '10',
          label: 'years in business',
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      options: [
        {
          label: 'Light Blue Gradient',
          value: 'light-blue',
        },
        {
          label: 'White',
          value: 'white',
        },
        {
          label: 'Light Gray',
          value: 'gray',
        },
      ],
      defaultValue: 'light-blue',
    },
  ],
}

export default AboutUs
