import { getFormOverrides } from './form-overrides'
import { getFormSubmissionOverrides } from './form-submission-overrides'

export const getFormBuilderConfig = () => ({
  fields: {
    text: true,
    email: true,
    phone: true,
    textarea: true,
    number: true,
    select: true,
    checkbox: true,
    country: true,
    state: true,
    payment: false,
  },
  formOverrides: getFormOverrides(),
  formSubmissionOverrides: getFormSubmissionOverrides(),
})
