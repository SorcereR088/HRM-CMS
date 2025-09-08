import { FormSubmissionData } from './types'

export const extractEmailFromSubmission = (submissionData: FormSubmissionData): string | null => {
  if (!submissionData) return null

  // Handle array format
  if (Array.isArray(submissionData)) {
    const emailField = submissionData.find(
      (field) =>
        field?.name === 'email' ||
        field?.field === 'email' ||
        (typeof field?.value === 'string' && field.value.includes('@')),
    )
    return emailField?.value || emailField?.data || null
  }

  // Handle object format
  if (typeof submissionData === 'object') {
    // Check for common email field names
    const emailValue =
      submissionData.email ||
      submissionData.emailAddress ||
      submissionData['email-address'] ||
      submissionData.Email

    if (emailValue && typeof emailValue === 'string' && emailValue.includes('@')) {
      return emailValue
    }

    // Fallback: find any field with @ symbol
    for (const [, value] of Object.entries(submissionData)) {
      if (typeof value === 'string' && value.includes('@')) {
        return value
      }
    }
  }

  return null
}

export const extractNameFromSubmission = (submissionData: FormSubmissionData): string | null => {
  if (!submissionData) return null

  // Handle array format
  if (Array.isArray(submissionData)) {
    const nameField = submissionData.find(
      (field) =>
        field?.name === 'text' ||
        field?.name === 'name' ||
        field?.name === 'fullName' ||
        field?.field === 'text' ||
        field?.field === 'name',
    )
    return nameField?.value || nameField?.data || null
  }

  // Handle object format
  if (typeof submissionData === 'object') {
    const nameValue =
      submissionData.text ||
      submissionData.name ||
      submissionData.fullName ||
      submissionData['full-name'] ||
      submissionData.Name

    if (nameValue && typeof nameValue === 'string') {
      return nameValue
    }
  }

  return null
}
