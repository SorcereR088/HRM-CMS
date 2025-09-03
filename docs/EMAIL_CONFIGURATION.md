# Email Configuration for HRM-CMS

This document describes the SMTP email configuration and form submission email functionality implemented in the HRM-CMS Payload application.

## Features

- **Automatic email sending** when forms are submitted through the form builder plugin
- **SMTP configuration** using environment variables
- **Email template interpolation** with form field values
- **Admin notifications** and user confirmations
- **Support for multiple email recipients** (To, CC, BCC)
- **HTML table formatting** for submission data

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# SMTP Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=172.16.61.53
MAIL_PORT=25
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=sofware@vianet.com.np
MAIL_FROM_NAME="Yak HRM"
```

## Configuration

The email functionality is automatically configured in `src/payload.config.ts` using the `@payloadcms/email-nodemailer` adapter.

## Email Templates

### Field Interpolation

You can use the following placeholders in your email subject and message:

- `{{fieldName}}` - Replace with specific form field values (e.g., `{{name}}`, `{{email}}`)
- `{{*}}` - Replace with all form data as plain text
- `{{*:table}}` - Replace with all form data formatted as an HTML table

### Example Email Configuration

When creating or editing a form in the Payload Admin, you can configure emails in the "Emails" section:

**Admin Notification Email:**
- **Email To:** `admin@yakhrm.com`
- **Subject:** `New {{formType}} submission from {{name}}`
- **Message:**
  ```
  A new form submission has been received:
  
  {{*:table}}
  
  Please review and follow up as needed.
  ```

**User Confirmation Email:**
- **Email To:** `{{email}}` (uses the email field from the form)
- **Subject:** `Thank you for contacting YAK HRM`
- **Message:**
  ```
  Dear {{name}},
  
  Thank you for your interest in YAK HRM. We have received your submission and will contact you shortly.
  
  Your submission details:
  {{*}}
  
  Best regards,
  YAK HRM Team
  ```

## Form Types

The system works with all form types created through the form builder plugin, including:

- Demo booking forms
- Contact us forms
- Newsletter subscriptions
- Support requests
- Any custom forms

## Technical Implementation

### Email Processing Flow

1. Form is submitted via `/api/submit-form`
2. Form data is validated and saved to the database
3. Email configurations are retrieved from the form settings
4. Email templates are processed with field interpolation
5. Emails are sent using the configured SMTP transport
6. Success/failure is logged

### File Structure

- `src/payload.config.ts` - Email transport configuration
- `src/app/api/submit-form/route.ts` - Form submission and email handling
- `.env.example` - SMTP environment variables template

## Troubleshooting

### Common Issues

1. **Emails not sending:**
   - Check SMTP configuration in environment variables
   - Verify SMTP server connectivity
   - Check server logs for error messages

2. **Template interpolation not working:**
   - Ensure field names match exactly (case-sensitive)
   - Use `{{*}}` to see all available field data

3. **Missing email configurations:**
   - Verify that emails are configured in the form settings
   - Check that email addresses are valid

### Logs

Email sending activities are logged to the console. Check your application logs for:
- `Processing emails for form: [FormName]`
- `Email sent successfully to: [EmailAddress]`
- Error messages for failed email deliveries

## Security Considerations

- Email addresses are validated before sending
- SMTP authentication is optional (set to null for local servers)
- Email content is sanitized to prevent injection attacks
- Rate limiting should be implemented for production use

## Testing

Integration tests are available in `tests/int/email-integration.int.spec.ts` to verify:
- SMTP configuration
- Email template processing
- Field interpolation functionality
- HTML table generation