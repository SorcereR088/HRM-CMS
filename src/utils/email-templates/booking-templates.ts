export interface BookingFormData {
  fullName: string
  email: string
  phone?: string
  company?: string
  message?: string
}

export const generateBookingConfirmationEmail = (formData: BookingFormData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
            margin: -20px -20px 20px -20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 20px 0;
        }
        .highlight {
            background-color: #f0f8ff;
            padding: 15px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Demo Booking Confirmed!</h1>
        </div>
        
        <div class="content">
            <p>Dear ${formData.fullName},</p>
            
            <p>Thank you for your interest in our HRM System! We're excited to show you how our solution can transform your HR processes.</p>
            
            <div class="highlight">
                <h3>📅 What happens next?</h3>
                <ul>
                    <li>Our team will review your request</li>
                    <li>We'll contact you within 24 hours to schedule your demo</li>
                    <li>You'll receive a calendar invitation with demo details</li>
                </ul>
            </div>
            
            <h3>Your Demo Request Details:</h3>
            <ul>
                <li><strong>Name:</strong> ${formData.fullName}</li>
                <li><strong>Email:</strong> ${formData.email}</li>
                ${formData.phone ? `<li><strong>Phone:</strong> ${formData.phone}</li>` : ''}
                ${formData.company ? `<li><strong>Company:</strong> ${formData.company}</li>` : ''}
                ${formData.message ? `<li><strong>Message:</strong> ${formData.message}</li>` : ''}
            </ul>
            
            <div class="highlight">
                <h3>🎯 What to expect in your demo:</h3>
                <ul>
                    <li>30-minute personalized demonstration</li>
                    <li>Overview of key features and capabilities</li>
                    <li>Discussion of your specific HR needs</li>
                    <li>Q&A session with our experts</li>
                    <li>Next steps and implementation guidance</li>
                </ul>
            </div>
            
            <p>If you have any questions before your demo, feel free to reply to this email or contact us directly.</p>
            
            <p>Looking forward to showing you the future of HR management!</p>
            
            <p>Best regards,<br>
            <strong>The HRM System Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This email was sent to ${formData.email} because you requested a demo on our website.</p>
            <p>HRM System | Transforming HR Processes</p>
        </div>
    </div>
</body>
</html>
  `
}

export const generateAdminNotificationEmail = (formData: BookingFormData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Demo Booking Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
            margin: -20px -20px 20px -20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .alert {
            background-color: #fff3cd;
            color: #856404;
            padding: 15px;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            margin: 20px 0;
        }
        .customer-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
            margin: 20px 0;
        }
        .customer-info h3 {
            margin-top: 0;
            color: #495057;
        }
        .info-row {
            display: flex;
            margin: 10px 0;
            padding: 5px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .info-label {
            font-weight: bold;
            width: 100px;
            color: #6c757d;
        }
        .info-value {
            flex: 1;
        }
        .action-buttons {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 0 10px;
            font-weight: bold;
        }
        .urgent {
            background: linear-gradient(135deg, #ff7675 0%, #d63031 100%);
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 New Demo Booking Request</h1>
        </div>
        
        <div class="alert">
            <strong>Action Required:</strong> A new demo booking request has been submitted and requires your attention.
        </div>
        
        <div class="customer-info">
            <h3>👤 Customer Information</h3>
            
            <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">${formData.fullName}</div>
            </div>
            
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">
                    <a href="mailto:${formData.email}">${formData.email}</a>
                </div>
            </div>
            
            ${formData.phone ? `
            <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">
                    <a href="tel:${formData.phone}">${formData.phone}</a>
                </div>
            </div>
            ` : ''}
            
            ${formData.company ? `
            <div class="info-row">
                <div class="info-label">Company:</div>
                <div class="info-value">${formData.company}</div>
            </div>
            ` : ''}
            
            ${formData.message ? `
            <div class="info-row">
                <div class="info-label">Message:</div>
                <div class="info-value">${formData.message}</div>
            </div>
            ` : ''}
            
            <div class="info-row">
                <div class="info-label">Submitted:</div>
                <div class="info-value">${new Date().toLocaleString()}</div>
            </div>
        </div>
        
        <div class="action-buttons">
            <a href="mailto:${formData.email}?subject=Demo Scheduling - HRM System&body=Dear ${formData.fullName},%0D%0A%0D%0AThank you for your interest in our HRM System. I'd like to schedule your demo...%0D%0A%0D%0ABest regards" class="button">
                📧 Reply to Customer
            </a>
            <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=HRM Demo with ${formData.fullName}&dates=" class="button urgent">
                📅 Schedule Demo
            </a>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📋 Next Steps:</h3>
            <ol>
                <li>Contact the customer within 24 hours</li>
                <li>Schedule a convenient demo time</li>
                <li>Send calendar invitation with demo details</li>
                <li>Prepare personalized demo based on their requirements</li>
                <li>Follow up after the demo with next steps</li>
            </ol>
        </div>
        
        <div class="footer">
            <p>This notification was generated automatically from the HRM System demo booking form.</p>
            <p>Demo request received at: ${new Date().toISOString()}</p>
        </div>
    </div>
</body>
</html>
  `
}