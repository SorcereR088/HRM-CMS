# Email Templates for HRM-CMS Forms

This directory contains example email templates for different form types in the HRM-CMS application.

## Demo Booking Form Templates

### Admin Notification for Demo Booking

**Subject:** `New Demo Booking Request from {{name}} - {{company}}`

**Message:**
```
A new demo booking request has been submitted through the website.

Contact Information:
- Name: {{name}}
- Email: {{email}}
- Company: {{company}}
- Phone: {{phone}}
- Preferred Date: {{preferredDate}}
- Preferred Time: {{preferredTime}}

Additional Details:
{{message}}

Please follow up within 24 hours to schedule the demo.

---
Submitted on: {{submissionDate}}
Form: Demo Booking Request
```

### User Confirmation for Demo Booking

**Subject:** `Demo Booking Confirmed - YAK HRM`

**Message:**
```
Dear {{name}},

Thank you for your interest in YAK HRM! We have received your demo booking request.

Your submission details:
- Company: {{company}}
- Preferred Date: {{preferredDate}}
- Preferred Time: {{preferredTime}}

Our team will contact you within 24 hours at {{email}} or {{phone}} to confirm the demo schedule and provide you with meeting details.

What to expect in the demo:
• Complete overview of YAK HRM features
• Customization options for your company
• Q&A session with our product experts
• Pricing and implementation discussion

If you have any immediate questions, please reply to this email or call us at [Your Phone Number].

Best regards,
YAK HRM Team

---
Website: [Your Website]
Email: sofware@vianet.com.np
```

## Contact Form Templates

### Admin Notification for Contact Form

**Subject:** `New Contact Form Submission from {{name}}`

**Message:**
```
A new contact form submission has been received.

{{*:table}}

Priority Level: {{priority}}
Subject: {{subject}}

Please respond within 48 hours.

Best regards,
Website Contact System
```

### User Confirmation for Contact Form

**Subject:** `Thank you for contacting YAK HRM`

**Message:**
```
Dear {{name}},

Thank you for reaching out to YAK HRM. We have received your message and will respond within 48 hours.

Your message:
"{{message}}"

If this is urgent, please call us directly at [Your Phone Number].

Best regards,
YAK HRM Support Team

---
Reference ID: {{submissionId}}
Submitted: {{submissionDate}}
```

## Newsletter Subscription Templates

### Admin Notification for Newsletter

**Subject:** `New Newsletter Subscription: {{email}}`

**Message:**
```
New newsletter subscription received:

Email: {{email}}
Name: {{name}}
Source: {{source}}
Interests: {{interests}}

Please add to the mailing list.
```

### User Confirmation for Newsletter

**Subject:** `Welcome to YAK HRM Newsletter!`

**Message:**
```
Dear {{name}},

Welcome to the YAK HRM newsletter! You'll receive updates about:

• Product features and improvements
• Industry insights and best practices
• Company news and events
• Special offers and promotions

You can unsubscribe at any time by clicking the link in our emails.

Best regards,
YAK HRM Marketing Team
```

## Support Request Templates

### Admin Notification for Support

**Subject:** `Support Request #{{ticketId}} - {{category}}`

**Message:**
```
New support request submitted:

Category: {{category}}
Priority: {{priority}}
Customer: {{name}} ({{email}})
Company: {{company}}

Issue Description:
{{description}}

System Information:
- Browser: {{browser}}
- Operating System: {{os}}
- YAK HRM Version: {{version}}

Please assign to appropriate team member and respond within SLA.
```

### User Confirmation for Support

**Subject:** `Support Request Received - Ticket #{{ticketId}}`

**Message:**
```
Dear {{name}},

Your support request has been received and assigned ticket number {{ticketId}}.

Issue Category: {{category}}
Priority: {{priority}}

Our support team will review your request and respond within:
- High Priority: 4 hours
- Medium Priority: 24 hours  
- Low Priority: 48 hours

You can track your ticket status by replying to this email with your ticket number.

Best regards,
YAK HRM Support Team
```

## HTML Table Template Example

For forms where you want to display all data in a structured format, use `{{*:table}}`:

```html
<h3>Form Submission Details</h3>
{{*:table}}

<p>Please review the above information and take appropriate action.</p>
```

This will generate an HTML table with all form fields and their values.

## Best Practices

1. **Personalization**: Always use the submitter's name when available
2. **Clear Next Steps**: Tell users what to expect next
3. **Contact Information**: Provide multiple ways to reach you
4. **Professional Tone**: Maintain consistent branding
5. **Mobile-Friendly**: Keep emails concise for mobile viewing
6. **Unsubscribe Options**: Include for marketing emails
7. **Auto-Reply Timing**: Set clear expectations for response time

## Template Variables Reference

Common variables available in most forms:
- `{{name}}` - Full name
- `{{email}}` - Email address
- `{{phone}}` - Phone number
- `{{company}}` - Company name
- `{{message}}` - Message content
- `{{submissionDate}}` - When submitted
- `{{submissionId}}` - Unique submission ID

Use `{{*}}` to see all available variables for debugging.