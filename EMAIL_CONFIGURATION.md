# SMTP Email Configuration Guide

This document explains how to configure and use the SMTP email functionality for the Payload CMS form builder plugin.

## Overview

The HRM-CMS system now supports automatic email notifications when forms are submitted through the Payload CMS form builder plugin. The system uses nodemailer with SMTP transport to send emails.

## Environment Configuration

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

### Environment Variables Explained

- `MAIL_HOST`: SMTP server hostname (defaults to 172.16.61.53)
- `MAIL_PORT`: SMTP server port (defaults to 25)
- `MAIL_USERNAME`: SMTP authentication username (set to "null" if no auth required)
- `MAIL_PASSWORD`: SMTP authentication password (optional)
- `MAIL_FROM_ADDRESS`: Default sender email address
- `MAIL_FROM_NAME`: Default sender name

## How It Works

### 1. Form Configuration

When creating forms in the Payload CMS admin panel, you can configure email notifications in the form's email settings:

- **Email To**: Recipient email addresses (comma-separated)
- **CC**: Carbon copy recipients (optional)
- **BCC**: Blind carbon copy recipients (optional)
- **Reply To**: Reply-to email address (optional)
- **Email From**: Custom sender email (optional, uses default if not set)
- **Subject**: Email subject line
- **Message**: Custom message content (supports rich text)

### 2. Form Submission Process

When a user submits a form:

1. Form data is validated and saved to the database
2. System checks if the form has email configurations
3. For each email configuration:
   - Email content is generated with form data
   - Placeholders are replaced with actual values
   - Email is sent via SMTP transport
4. Success/error responses are returned

### 3. Email Template Features

#### Placeholder Support

- `{{fieldName}}` - Replaced with the value of a specific form field
- `{{*}}` - Replaced with all form data as plain text
- `{{*:table}}` - Replaced with all form data formatted as an HTML table

#### Example Usage

If your form has fields named "firstName" and "email", you can use:

```
Subject: New contact from {{firstName}}

Hello,

You received a new contact form submission:

{{*:table}}

Best regards,
{{firstName}}
Email: {{email}}
```

## API Endpoints

### Test Email Endpoint

Use the test email endpoint to verify SMTP configuration:

**GET** `/api/test-email`
- Returns current SMTP configuration status

**POST** `/api/test-email`
```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "message": "This is a test message"
}
```

### Form Management

- **GET** `/api/forms/{id}?depth=2` - Fetch form configuration
- **GET** `/api/form-submissions` - List form submissions
- **DELETE** `/api/form-submissions?id={id}` - Delete form submission

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check SMTP server connectivity
   - Verify environment variables are loaded
   - Check server logs for error messages
   - Test with `/api/test-email` endpoint

2. **Authentication errors**
   - Verify MAIL_USERNAME and MAIL_PASSWORD if required
   - Some internal SMTP servers don't require authentication

3. **SSL/TLS issues**
   - Internal servers often use self-signed certificates
   - Current configuration allows self-signed certificates

### Testing SMTP Configuration

1. Use the test email endpoint:
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@company.com", "subject": "SMTP Test"}'
```

2. Check server logs for detailed error messages

3. Verify SMTP server settings with your network administrator

## Production Deployment

### Docker Environment

The SMTP configuration works with Docker. Ensure environment variables are properly passed to the container:

```dockerfile
ENV MAIL_HOST=172.16.61.53
ENV MAIL_PORT=25
ENV MAIL_FROM_ADDRESS=sofware@vianet.com.np
ENV MAIL_FROM_NAME="Yak HRM"
```

### Security Considerations

- Use environment variables for sensitive configuration
- Consider using authentication for production SMTP servers
- Monitor email sending logs for security issues
- Implement rate limiting for form submissions if needed

## Support

For technical support with email configuration:

1. Check the server logs for detailed error messages
2. Test SMTP connectivity using the test endpoint
3. Verify network connectivity to the SMTP server (172.16.61.53:25)
4. Contact system administrator for SMTP server issues