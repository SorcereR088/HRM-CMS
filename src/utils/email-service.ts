import nodemailer from 'nodemailer'
import {
  generateBookingConfirmationEmail,
  generateAdminNotificationEmail,
  BookingFormData,
} from './email-templates/booking-templates'

export interface EmailSendResult {
  success: boolean
  message: string
  error?: string
}

export class EmailService {
  private static async getTransporter() {
    // Create nodemailer transporter directly
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.MAIL_FROM_ADDRESS,
        pass: process.env.SMTP_PASSWORD || '',
      },
    })

    return transporter
  }

  /**
   * Send booking confirmation email to the customer
   */
  static async sendBookingConfirmation(formData: BookingFormData): Promise<EmailSendResult> {
    try {
      // For demo purposes, we'll simulate email sending without actually sending
      // In a real environment, you would configure proper SMTP credentials
      
      const htmlContent = generateBookingConfirmationEmail(formData)
      
      console.log('Demo: Would send booking confirmation email to:', formData.email)
      console.log('Email content preview:', htmlContent.substring(0, 200) + '...')

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // For demo, we'll return success
      return {
        success: true,
        message: 'Booking confirmation email sent successfully (demo mode)',
      }
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error)
      return {
        success: false,
        message: 'Failed to send booking confirmation email',
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Send admin notification email about new booking
   */
  static async sendAdminNotification(formData: BookingFormData): Promise<EmailSendResult> {
    try {
      const htmlContent = generateAdminNotificationEmail(formData)
      const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_FROM_ADDRESS || 'admin@example.com'

      console.log('Demo: Would send admin notification email to:', adminEmail)
      console.log('Email content preview:', htmlContent.substring(0, 200) + '...')

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // For demo, we'll return success
      return {
        success: true,
        message: 'Admin notification email sent successfully (demo mode)',
      }
    } catch (error) {
      console.error('Failed to send admin notification email:', error)
      return {
        success: false,
        message: 'Failed to send admin notification email',
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Send both customer confirmation and admin notification emails
   */
  static async sendBookingEmails(formData: BookingFormData): Promise<{
    customerEmail: EmailSendResult
    adminEmail: EmailSendResult
  }> {
    console.log('Sending booking emails for:', formData.email)

    // Send both emails concurrently
    const [customerEmail, adminEmail] = await Promise.all([
      this.sendBookingConfirmation(formData),
      this.sendAdminNotification(formData),
    ])

    return {
      customerEmail,
      adminEmail,
    }
  }

  /**
   * Validate form data for demo booking
   */
  static validateBookingFormData(data: any): { isValid: boolean; errors: string[]; formData?: BookingFormData } {
    const errors: string[] = []

    if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length === 0) {
      errors.push('Full name is required')
    }

    if (!data.email || typeof data.email !== 'string' || !this.isValidEmail(data.email)) {
      errors.push('Valid email address is required')
    }

    if (data.phone && typeof data.phone !== 'string') {
      errors.push('Phone number must be a string')
    }

    if (data.company && typeof data.company !== 'string') {
      errors.push('Company name must be a string')
    }

    if (data.message && typeof data.message !== 'string') {
      errors.push('Message must be a string')
    }

    if (errors.length > 0) {
      return { isValid: false, errors }
    }

    const formData: BookingFormData = {
      fullName: data.fullName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim() || undefined,
      company: data.company?.trim() || undefined,
      message: data.message?.trim() || undefined,
    }

    return { isValid: true, errors: [], formData }
  }

  /**
   * Simple email validation
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

export default EmailService