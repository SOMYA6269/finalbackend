import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

// Brevo API Configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'dragdroperp@gmail.com'
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@draganddrop.in'
const SENDER_NAME = process.env.SENDER_NAME || 'Drag & Drop ERP'

/**
 * Send email using Brevo API
 * @param {Object} emailData - Email data object
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - HTML email content
 * @param {string} [emailData.name] - Recipient name (optional)
 */
async function sendBrevoEmail({ to, subject, html, name }) {
  if (!BREVO_API_KEY) {
    console.warn('⚠️  Brevo API key not configured. Skipping email send.')
    return
  }

  try {
    const payload = {
      sender: {
        name: SENDER_NAME,
        email: SENDER_EMAIL
      },
      to: [
        {
          email: to,
          name: name || to
        }
      ],
      subject: subject,
      htmlContent: html
    }

    const response = await axios.post(BREVO_API_URL, payload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    console.log('✅ Email sent successfully via Brevo:', response.data.messageId)
    return response.data
  } catch (error) {
    console.error('❌ Brevo email sending error:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Send contact form emails (to company and user confirmation)
 * @param {Object} data - Contact form data
 * @param {string} data.name - User name
 * @param {string} data.email - User email
 * @param {string} data.phone - User phone (optional)
 * @param {string} data.reason - Contact reason
 * @param {string} data.message - User message
 */
export async function sendContactEmail(data) {
  // Check if Brevo is configured
  if (!BREVO_API_KEY) {
    console.warn('⚠️  Brevo API key not configured. Skipping email send.')
    return
  }

  const { name, email, phone, reason, message } = data

  const subjectMap = {
    'general': 'General Inquiry',
    'support': 'Technical Support Request',
    'sales': 'Sales Inquiry',
    'partnership': 'Partnership Inquiry',
    'other': 'Other Inquiry'
  }

  const subject = subjectMap[reason] || 'Contact Form Submission'

  // Email to company
  const companyEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0f172a;">New Contact Form Submission</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </p>
      </div>
      <p style="color: #64748b; font-size: 12px;">
        This email was sent from the Drag & Drop ERP contact form.
      </p>
    </div>
  `

  // Confirmation email to user
  const userEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0f172a;">Thank you for reaching out!</h2>
      <p>Hi ${name},</p>
      <p>We've received your message and our team will get back to you within 24 hours.</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Your Message:</strong></p>
        <p style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
          ${message.replace(/\n/g, '<br>')}
        </p>
      </div>
      <p>Best regards,<br>The Drag & Drop ERP Team</p>
    </div>
  `

  try {
    // Send both emails in parallel
    await Promise.all([
      sendBrevoEmail({
        to: CONTACT_EMAIL,
        subject: `New ${subject} from ${name}`,
        html: companyEmailHtml
      }),
      sendBrevoEmail({
        to: email,
        subject: 'Thank you for contacting Drag & Drop ERP',
        html: userEmailHtml,
        name: name
      })
    ])
    
    console.log('✅ Contact form emails sent successfully via Brevo')
  } catch (error) {
    console.error('❌ Contact email sending error:', error.response?.data || error.message)
    throw error
  }
}
