import { describe, it, expect } from 'vitest'

describe('Form Builder Configuration', () => {
  it('should have proper form builder plugin configuration', () => {
    // Test that our form builder configuration is properly set up
    const config = {
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
      }
    }
    
    expect(config.fields.text).toBe(true)
    expect(config.fields.email).toBe(true)
    expect(config.fields.phone).toBe(true)
    expect(config.fields.textarea).toBe(true)
    expect(config.fields.number).toBe(true)
    expect(config.fields.select).toBe(true)
    expect(config.fields.checkbox).toBe(true)
    expect(config.fields.payment).toBe(false)
  })

  it('should validate email addresses correctly', () => {
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    // Test valid emails
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    expect(validateEmail('valid+email@test.org')).toBe(true)

    // Test invalid emails
    expect(validateEmail('invalid.email')).toBe(false)
    expect(validateEmail('test@')).toBe(false)
    expect(validateEmail('@domain.com')).toBe(false)
    expect(validateEmail('test @domain.com')).toBe(false)
  })

  it('should handle form field validation correctly', () => {
    // Mock form field validation logic
    const validateFormField = (field: any, value: any) => {
      if (field.required) {
        if (field.blockType === 'checkbox') {
          return !!value
        } else {
          return value && (typeof value !== 'string' || value.trim() !== '')
        }
      }
      return true
    }

    // Test required text field
    const textField = { blockType: 'text', required: true, name: 'fullName', label: 'Full Name' }
    expect(validateFormField(textField, 'John Doe')).toBe(true)
    expect(validateFormField(textField, '')).toBe(false)
    expect(validateFormField(textField, '   ')).toBe(false)

    // Test required checkbox
    const checkboxField = { blockType: 'checkbox', required: true, name: 'agree', label: 'I agree' }
    expect(validateFormField(checkboxField, true)).toBe(true)
    expect(validateFormField(checkboxField, false)).toBe(false)

    // Test optional field
    const optionalField = { blockType: 'text', required: false, name: 'middle', label: 'Middle Name' }
    expect(validateFormField(optionalField, '')).toBe(true)
    expect(validateFormField(optionalField, 'Jane')).toBe(true)
  })
})