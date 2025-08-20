# Select Form Integration Guide

## Overview

The "Select Form" functionality allows admins to choose which form to display in the BookADemo component using forms created with the Form Builder plugin.

## How It Works

### 1. Admin Interface (Form Selection)

In the Payload CMS admin panel, when configuring a BookADemo block:

1. Navigate to **Pages** collection
2. Edit or create a page 
3. Add or edit a **Book a Demo** block
4. You will see the following fields:
   - Heading
   - Description  
   - Features (array)
   - **Form Heading**
   - **Select Form** ← This is the key field
   - Background Color

### 2. Select Form Field

The "Select Form" field:
- **Type**: Relationship field
- **Connects to**: `forms` collection 
- **Label**: "Select Form"
- **Description**: "Choose a form created with the Form Builder plugin. Leave empty to use default fields."
- **Required**: No (optional)

### 3. Form Display Logic

The BookADemo component handles form display as follows:

#### When a form is selected:
- Fetches form data from `/api/forms/{id}` if form ID is provided
- Uses the selected form directly if form object is provided  
- Displays the form using the `FormRenderer` component
- Shows loading state while fetching
- Handles errors gracefully

#### When no form is selected:
- Shows a message: "No form configured. Please select a form in the admin panel."

#### Form States:
- **Loading**: Shows animated skeleton
- **Error**: Shows error message with red background
- **Success**: Displays the selected form with FormRenderer
- **Empty**: Shows guidance message to select a form

## Technical Implementation

### Block Configuration (`src/blocks/BookADemo.ts`)
```typescript
{
  name: 'form',
  type: 'relationship',
  relationTo: 'forms',
  label: 'Select Form',
  admin: {
    description: 'Choose a form created with the Form Builder plugin. Leave empty to use default fields.',
  },
}
```

### Component Implementation (`BookADemoBlock.tsx`)
```typescript
// Handles both form objects and form IDs
const formData = typeof form === 'object' && form !== null ? form : null

// Fetches form data if ID is provided
useEffect(() => {
  if (typeof form === 'string' || typeof form === 'number') {
    fetchFormData(form)
  }
}, [form])

// Renders form using FormRenderer
{formData && <FormRenderer form={formData} />}
```

## Usage Examples

### Example 1: Basic Form Selection
1. Create a form in Form Builder with fields like:
   - Full Name (text, required)
   - Email (email, required)
   - Phone (phone, optional)
   - Message (textarea, optional)

2. In BookADemo block configuration:
   - Set "Form Heading" to "Contact Us"
   - Select your created form in "Select Form" field

3. The component will display your custom form

### Example 2: Multiple Forms
You can create different forms for different purposes:
- **Demo Request Form**: Simple fields for demo bookings
- **Contact Form**: More detailed contact information
- **Support Form**: Technical support request fields

Then select the appropriate form for each BookADemo block instance.

## Benefits

✅ **Admin Control**: Admins can modify forms without code changes
✅ **Reusability**: Same form can be used across multiple components  
✅ **Flexibility**: Different forms for different contexts
✅ **Dynamic**: Forms update automatically when modified in admin
✅ **Validation**: Built-in validation from Form Builder plugin
✅ **Submissions**: All submissions stored in Payload CMS

## API Endpoints

- `GET /api/forms/{id}` - Fetch form definition
- `POST /api/form-submissions` - Submit form data

## Form Builder Integration

This feature is fully integrated with the `@payloadcms/plugin-form-builder` plugin, supporting:
- Text fields
- Email fields  
- Phone fields
- Textarea fields
- Select dropdowns
- Checkbox fields
- Number fields
- Country/State fields

## Troubleshooting

### Form not displaying?
- Check that a form is selected in the "Select Form" field
- Verify the form exists in the Forms collection
- Check browser console for API errors

### Form submission not working?
- Ensure form has proper validation
- Check `/api/form-submissions` endpoint
- Verify form ID is correct

### Form fields not rendering?
- Check that form fields are properly configured
- Verify field types are supported by FormRenderer
- Check for JavaScript errors in console