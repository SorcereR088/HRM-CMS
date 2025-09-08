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
  fields: ({ defaultFields }: any) =>
    defaultFields.map((field: any) => {
      if ('name' in field && field.name === 'fields') {
        return {
          ...field,
          admin: {
            ...field.admin,
            readOnly: false,
            disabled: false,
          },
        } as typeof field
      }
      return field
    }),
})
