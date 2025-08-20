import { describe, it, expect } from 'vitest'

describe('Form System Validation', () => {
  it('should have removed duplicate formSubmission API endpoint', () => {
    const fs = require('fs')
    const path = require('path')
    
    const duplicateApiPath = path.join(process.cwd(), 'src/app/api/formSubmission/route.ts')
    
    // The duplicate endpoint should be removed
    expect(fs.existsSync(duplicateApiPath)).toBe(false)
  })

  it('should have proper FormRenderer rich text utility', () => {
    const fs = require('fs')
    const path = require('path')
    
    const utilityPath = path.join(process.cwd(), 'src/app/(frontend)/Components/utils/serializeRichText.ts')
    const content = fs.readFileSync(utilityPath, 'utf8')
    
    // Check that the utility function exists
    expect(content).toContain('export function serializeRichText')
    expect(content).toContain('richTextObject')
  })

  it('should have updated FormRenderer to use rich text utility', () => {
    const fs = require('fs')
    const path = require('path')
    
    const formRendererPath = path.join(process.cwd(), 'src/app/(frontend)/Components/FormRenderer.tsx')
    const content = fs.readFileSync(formRendererPath, 'utf8')
    
    // Check that FormRenderer imports and uses the rich text utility
    expect(content).toContain('import { serializeRichText }')
    expect(content).toContain('form.formconfirmationMessage')
    expect(content).toContain('serializeRichText(form.formconfirmationMessage)')
  })

  it('should have updated payload config with proper access controls', () => {
    const fs = require('fs')
    const path = require('path')
    
    const configPath = path.join(process.cwd(), 'src/payload.config.ts')
    const content = fs.readFileSync(configPath, 'utf8')
    
    // Check that access controls are defined
    expect(content).toContain('access: {')
    expect(content).toContain('beforeDelete:')
    expect(content).toContain('form-submissions')
  })

  it('should have fixed BookADemoBlock component', () => {
    const fs = require('fs')
    const path = require('path')
    
    const componentPath = path.join(process.cwd(), 'src/app/(frontend)/Components/blocks/BookADemoBlock.tsx')
    const content = fs.readFileSync(componentPath, 'utf8')
    
    // Check that hardcoded form elements were removed
    expect(content).not.toContain('handleChange')
    expect(content).not.toContain('formData.companyName')
    
    // Check that FormRenderer is properly used
    expect(content).toContain('<FormRenderer form={form}')
  })

  it('should have form duplication API endpoint', () => {
    const fs = require('fs')
    const path = require('path')
    
    const duplicateApiPath = path.join(process.cwd(), 'src/app/api/forms/[id]/duplicate/route.ts')
    const content = fs.readFileSync(duplicateApiPath, 'utf8')
    
    // Check that the duplicate endpoint exists and has proper structure
    expect(content).toContain('export async function POST')
    expect(content).toContain('Form duplicated successfully')
    expect(content).toContain('(Copy)')
  })
})