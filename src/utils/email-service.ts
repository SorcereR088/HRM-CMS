import { getPayload } from 'payload'
import config from '@payload-config'
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
  private static async getPayloadInstance() {
    try {
      return await getPayload({ config })
    } catch (error) {
      console.error('Failed to get Payload instance:', error)
      throw new Error('Email service initialization failed')
    }
  }

  /**
   * Send booking confirmation email to the customer
   */
  static async sendBookingConfirmation(formData: BookingFormData): Promise<EmailSendResult> {
    try {
      const payload = await this.getPayloadInstance()

      if (!payload.sendEmail) {
        console.error('Email adapter not configured in Payload')
        return {
          success: false,
          message: 'Email service not configured',
          error: 'Email adapter not configured in Payload',
        }
      }

      const htmlContent = generateBookingConfirmationEmail(formData)

      await payload.sendEmail({
        to: formData.email,
        subject: 'Demo Booking Confirmation - HRM System',
        html: htmlContent,
      })

      console.log(`Booking confirmation email sent to: ${formData.email}`)
      
      return {
        success: true,
        message: 'Booking confirmation email sent successfully',
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
      const payload = await this.getPayloadInstance()

      if (!payload.sendEmail) {
        console.error('Email adapter not configured in Payload')
        return {
          success: false,
          message: 'Email service not configured',
          error: 'Email adapter not configured in Payload',
        }
      }

      const htmlContent = generateAdminNotificationEmail(formData)
      const adminEmail = process.env.ADMIN_EMAIL || process.env.MAIL_FROM_ADDRESS || 'admin@example.com'

      await payload.sendEmail({
        to: adminEmail,
        subject: `New Demo Booking Request from ${formData.fullName}`,
        html: htmlContent,
      })

      console.log(`Admin notification email sent to: ${adminEmail}`)
      
      return {
        success: true,
        message: 'Admin notification email sent successfully',
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