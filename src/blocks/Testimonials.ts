import { Block } from 'payload'

const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials Section',
    plural: 'Testimonials Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      required: false,
      defaultValue: 'From Those Who Know Us Best',
      admin: {
        description: 'Main heading for the testimonials section',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Section Subheading',
      required: false,
      admin: {
        description: 'Optional subheading or description',
      },
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Testimonial Quote',
          required: true,
          maxLength: 150,
          admin: {
            description: 'The testimonial text from the customer (max 150 characters)',
            placeholder: 'Enter your testimonial here...',
          },
          validate: (value?: string | null) => {
            if (!value) return 'Quote is required'
            if (value.length > 150)
              return `Quote is too long (${value.length}/150 characters). Please shorten it.`
            return true
          },
        },
        {
          name: 'rating',
          type: 'number',
          label: 'Star Rating',
          required: true,
          min: 1,
          max: 5,
          defaultValue: 5,
          admin: {
            description: 'Rating out of 5 stars',
          },
        },
        {
          name: 'authorName',
          type: 'text',
          label: 'Author Name',
          required: true,
        },
        {
          name: 'authorTitle',
          type: 'text',
          label: 'Author Job Title',
          required: false,
        },
        {
          name: 'company',
          type: 'text',
          label: 'Company Name',
          required: false,
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

export default TestimonialsBlock
