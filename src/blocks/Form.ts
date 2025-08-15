import { Block } from 'payload'

const FormBlock: Block = {
  slug: 'form-block',
  labels: {
    singular: 'Form Block',
    plural: 'Form Blocks',
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Select Form',
    },
    {
      name: 'enableAjax',
      type: 'checkbox',
      label: 'Enable AJAX submission',
      defaultValue: true,
      admin: {
        description: 'Submit form without page reload',
      },
    },
  ],
}

export default FormBlock
