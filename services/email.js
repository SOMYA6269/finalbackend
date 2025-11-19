import SibApiV3Sdk from 'sib-api-v3-sdk'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Brevo API client
const client = SibApiV3Sdk.ApiClient.instance
const apiKey = client.authentications['api-key']

// Get Brevo API key from environment (read at runtime, not module load)
function getBrevoApiKey() {
  const apiKeyValue = process.env.BREVO_API_KEY
  if (!apiKeyValue) {
    console.error('❌ BREVO_API_KEY environment variable is not set')
    console.error('   Available env vars:', Object.keys(process.env).filter(k => k.includes('BREVO') || k.includes('EMAIL')).join(', ') || 'none')
  }
  return apiKeyValue
}

// Configure API key
const BREVO_API_KEY = getBrevoApiKey()
if (BREVO_API_KEY) {
  apiKey.apiKey = BREVO_API_KEY.trim()
}

// Create Brevo email API instance
const brevoEmail = new SibApiV3Sdk.TransactionalEmailsApi()

/**
 * Send email using Brevo API
 * @param {Object} emailData - Email data object
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.htmlContent - HTML email content
 * @param {string} [emailData.name] - Recipient name (optional)
 * @param {string} [emailData.senderName] - Sender name (optional, defaults to env var)
 * @param {string} [emailData.senderEmail] - Sender email (optional, defaults to env var)
 */
export async function sendBrevoEmail({ to, subject, htmlContent, name, senderName, senderEmail }) {
  const apiKeyValue = getBrevoApiKey()
  
  if (!apiKeyValue || apiKeyValue.trim() === '') {
    console.error('❌ Brevo API key is missing or empty. Cannot send email.')
    throw new Error('Brevo API key is not configured. Please set BREVO_API_KEY environment variable.')
  }

  // Update API key if needed
  apiKey.apiKey = apiKeyValue.trim()

  const SENDER_NAME = senderName || process.env.SENDER_NAME || 'Drag & Drop ERP'
  const SENDER_EMAIL = senderEmail || process.env.SENDER_EMAIL || 'dragdroperp@gmail.com'

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
      sender: {
        email: SENDER_EMAIL,
        name: SENDER_NAME
      },
      to: [
        {
          email: to,
          name: name || to
        }
      ],
      subject: subject,
      htmlContent: htmlContent
    })

    const data = await brevoEmail.sendTransacEmail(sendSmtpEmail)
    console.log('✅ Email sent successfully via Brevo API:', data.messageId)
    return data
  } catch (error) {
    console.error('❌ Brevo email sending error:', error.response?.body || error.message)
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
  // Get API key at runtime (not module load time)
  const BREVO_API_KEY = getBrevoApiKey()
  
  if (!BREVO_API_KEY || BREVO_API_KEY.trim() === '') {
    console.error('❌ Brevo API key is missing or empty. Cannot send contact emails.')
    throw new Error('Brevo API key is not configured. Please set BREVO_API_KEY environment variable.')
  }

  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'dragdroperp@gmail.com'
  const SENDER_EMAIL = process.env.SENDER_EMAIL || 'dragdroperp@gmail.com'
  const SENDER_NAME = process.env.SENDER_NAME || 'Drag & Drop ERP'

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
        htmlContent: companyEmailHtml,
        senderName: SENDER_NAME,
        senderEmail: SENDER_EMAIL
      }),
      sendBrevoEmail({
        to: email,
        subject: 'Thank you for contacting Drag & Drop ERP',
        htmlContent: userEmailHtml,
        name: name,
        senderName: SENDER_NAME,
        senderEmail: SENDER_EMAIL
      })
    ])
    
    console.log('✅ Contact form emails sent successfully via Brevo API')
  } catch (error) {
    console.error('❌ Contact email sending error:', error.response?.body || error.message)
    throw error
  }
}
