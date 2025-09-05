// Create this file as test-smtp.js in your project root
// Run with: node test-smtp.js

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransporter({
  host: '172.16.61.53',
  port: 25,
  secure: false,
  auth: undefined, // No authentication
  tls: {
    rejectUnauthorized: false,
  },
  debug: true, // Enable debug output
  logger: true, // Enable logging
})

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP Connection Error:', error)
  } else {
    console.log('✅ SMTP Server is ready to take our messages')

    // Send test email
    const mailOptions = {
      from: 'software@vianet.com.np',
      to: 'test@example.com', // Change this to your test email
      subject: 'Test Email from Node.js',
      text: 'This is a test email sent from Node.js using Nodemailer',
      html: '<p>This is a test email sent from Node.js using Nodemailer</p>',
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Email Send Error:', error)
      } else {
        console.log('✅ Email sent successfully:', info.messageId)
        console.log('Response:', info.response)
      }
    })
  }
})
