export interface Form {
  id: string
  title: string
  fields: Array<{
    label: string
    name: string
    type: 'text' | 'email' | 'textarea' | 'checkbox' | 'select'
    required?: boolean
    options?: string[] // For select fields
  }>
}
