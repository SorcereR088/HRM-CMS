export interface FormSubmissionField {
  name?: string
  field?: string
  value?: string
  data?: string
}

export type FormSubmissionData = FormSubmissionField[] | Record<string, unknown>

export interface EmailResult {
  type: 'admin' | 'confirmation'
  success: boolean
  error?: string
}
