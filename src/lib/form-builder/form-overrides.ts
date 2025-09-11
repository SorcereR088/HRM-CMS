import type { Field } from 'payload'

interface DefaultFieldsArg {
  defaultFields: Field[]
}

export const getFormOverrides = () => ({
  slug: 'forms',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: ({ defaultFields }: DefaultFieldsArg): Field[] =>
    defaultFields.map((field: Field) => {
      if ('name' in field && field.name === 'fields') {
        return {
          ...field,
          admin: {
            ...(field.admin || {}),
            readOnly: false,
            disabled: false,
          },
        } as Field
      }
      return field
    }),
})
