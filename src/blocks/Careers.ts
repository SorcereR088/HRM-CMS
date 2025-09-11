import { Block } from 'payload'

const Careers: Block = {
  slug: 'careers',
  labels: {
    singular: 'Careers',
    plural: 'Careers Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Our Open Roles',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'Join our team and make a difference in your career.',
      required: false,
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Contact Label',
          defaultValue: 'OR CONTACT US WITH',
          required: false,
        },
        {
          name: 'email',
          type: 'email',
          label: 'Contact Email',
          defaultValue: 'hello@avalontx.com',
          required: false,
        },
      ],
    },
    {
      name: 'jobListings',
      type: 'array',
      label: 'Job Listings',
      minRows: 1,
      fields: [
        {
          name: 'category',
          type: 'text',
          label: 'Category',
          defaultValue: 'OPEN ROLES',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Job Title',
          required: true,
        },
        {
          name: 'jobType',
          type: 'select',
          label: 'Job Type',
          required: true,
          options: [
            { label: 'Full Time', value: 'full-time' },
            { label: 'Part Time', value: 'part-time' },
            { label: 'Contract', value: 'contract' },
            { label: 'Internship', value: 'internship' },
            { label: 'Remote', value: 'remote' },
          ],
          defaultValue: 'full-time',
        },
        {
          name: 'salaryRange',
          type: 'text',
          label: 'Salary Range',
          required: false,
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          required: false,
        },
        {
          name: 'applicationFormUrl',
          type: 'text',
          label: 'Application Form URL',
          required: false,
          admin: {
            description: 'URL to the job application form page',
          },
        },
        {
          name: 'jobDescription',
          type: 'richText',
          label: 'Job Description',
          required: false,
          admin: {
            description: 'Detailed job description (optional)',
          },
        },
        {
          name: 'requirements',
          type: 'array',
          label: 'Requirements',
          required: false,
          fields: [
            {
              name: 'requirement',
              type: 'text',
              label: 'Requirement',
              required: false,
            },
          ],
        },
        {
          name: 'benefits',
          type: 'array',
          label: 'Benefits',
          required: false,
          fields: [
            {
              name: 'benefit',
              type: 'text',
              label: 'Benefit',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'CTA Button Settings',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'Submit Application',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          label: 'Button Style',
          options: [
            { label: 'Primary (Orange)', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
          defaultValue: 'primary',
          required: true,
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Gray', value: 'gray-50' },
        { label: 'Light Blue', value: 'blue-50' },
      ],
      defaultValue: 'white',
      required: false,
    },
  ],
}

export default Careers
