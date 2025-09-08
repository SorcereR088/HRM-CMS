import { handleFormSubmissionEmails } from '../email/handlers'

export const getFormSubmissionOverrides = () => ({
  slug: 'form-submissions',
  labels: {
    singular: 'Form Submission',
    plural: 'Form Submissions',
  },
  admin: {
    defaultColumns: ['id', 'form', 'createdAt'],
    useAsTitle: 'submissionSummary',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => false,
    delete: () => true,
  },
  fields: ({ defaultFields }: any) => [
    ...defaultFields,
    {
      name: 'dynamicFields',
      type: 'array',
      label: 'Submitted Fields',
      admin: {
        readOnly: true,
        description: 'All fields submitted with this form',
      },
      fields: [
        {
          name: 'fieldName',
          type: 'text',
          label: 'Field Name',
          admin: { readOnly: true },
        },
        {
          name: 'fieldLabel',
          type: 'text',
          label: 'Field Label',
          admin: { readOnly: true },
        },
        {
          name: 'fieldValue',
          type: 'textarea',
          label: 'Field Value',
          admin: { readOnly: true },
        },
        {
          name: 'fieldType',
          type: 'text',
          label: 'Field Type',
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'submissionSummary',
      type: 'textarea',
      label: 'Quick Summary',
      admin: {
        readOnly: true,
        description: 'Human-readable summary of all submitted data',
      },
    },
  ],
  hooks: {
    afterChange: [handleFormSubmissionEmails],
  },
})
