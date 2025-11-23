import SibApiV3Sdk from 'sib-api-v3-sdk'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Send contact email using Brevo Transactional Email API
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Contact name
 * @param {string} contactData.email - Contact email
 * @param {string} contactData.message - Contact message
 */
export async function sendContactEmail({ name, email, message }) {
  // Get API key from environment
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    console.error('❌ BREVO_API_KEY environment variable is not set')
    throw new Error('Brevo API key is not configured')
  }

  // Initialize Brevo API client
  const client = SibApiV3Sdk.ApiClient.instance
  client.authentications['api-key'].apiKey = apiKey.trim()

  // Create Brevo email API instance
  const brevoEmail = new SibApiV3Sdk.TransactionalEmailsApi()

  // Create email content
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    sender: {
      name: 'ERP Contact',
      email: 'dragdroperp@gmail.com'
    },
    to: [{
      email: 'dragdroperp@gmail.com'
    }],
    subject: 'New contact request',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">New Contact Request</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <p style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </p>
        </div>
        <p style="color: #64748b; font-size: 12px;">
          This email was sent from the ERP contact form.
        </p>
      </div>
    `
  })

  try {
    const result = await brevoEmail.sendTransacEmail(sendSmtpEmail)
    console.log('✅ Contact email sent successfully via Brevo API:', result.messageId)
    return result
  } catch (error) {
    console.error('❌ Brevo email sending error:', error.response?.body || error.message)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}
