import { describe, it, expect } from 'vitest'

describe('Form System Integration', () => {
  it('should have correct API endpoints structure', () => {
    // Test that the expected API routes exist
    const fs = require('fs')
    const path = require('path')
    
    // The form builder plugin creates collections automatically through Payload CMS
    // We should check for the submit-form API endpoint that we created
    const submitFormApiPath = path.join(process.cwd(), 'src/app/api/submit-form/route.ts')
    
    expect(fs.existsSync(submitFormApiPath)).toBe(true)
  })

  it('should have updated BookADemo component structure', () => {
    const fs = require('fs')
    const path = require('path')
    
    const bookADemoPath = path.join(process.cwd(), 'src/app/(frontend)/Components/blocks/BookADemoBlock.tsx')
    const content = fs.readFileSync(bookADemoPath, 'utf8')
    
    // Check that it imports FormRenderer
    expect(content).toContain('import FormRenderer')
    
    // Check that it uses FormRenderer component
    expect(content).toContain('<FormRenderer form={formData}')
    
    // Check that it fetches form data from API
    expect(content).toContain('/api/forms/')
    
    // Check that old hardcoded form submission logic was removed
    expect(content).not.toContain('handleSubmit = async (e: React.FormEvent)')
  })

  it('should have FormRenderer with correct property mappings', () => {
    const fs = require('fs')
    const path = require('path')
    
    const formRendererPath = path.join(process.cwd(), 'src/app/(frontend)/Components/FormRenderer.tsx')
    const content = fs.readFileSync(formRendererPath, 'utf8')
    
    // Check that it uses the correct property name
    expect(content).toContain('form.redirect?.url')
    expect(content).not.toContain('form.formredirect')
  })
})