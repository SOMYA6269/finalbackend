import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Send contact email using Resend API
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Contact name
 * @param {string} contactData.email - Contact email
 * @param {string} contactData.message - Contact message
 */
export async function sendContactEmail({ name, email, message }) {
  // Get API key from environment
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    console.error('❌ RESEND_API_KEY environment variable is not set')
    throw new Error('Resend API key is not configured')
  }

  // Initialize Resend client
  const resend = new Resend(apiKey.trim())

  // Create email content
  const emailHtml = `
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

  try {
    console.log('📧 Sending email via Resend API...')
    console.log('   From: ERP Contact <noreply@resend.dev>')
    console.log('   To: dragdroperp@gmail.com')
    console.log('   Subject: New contact request')

    const result = await resend.emails.send({
      from: 'ERP Contact <noreply@resend.dev>',
      to: ['dragdroperp@gmail.com'],
      subject: 'New contact request',
      html: emailHtml,
    })

    console.log('✅ Contact email sent successfully via Resend API:', result.data?.id)
    return result
  } catch (error) {
    console.error('❌ Resend email sending error:')
    console.error('   Message:', error.message)
    console.error('   Status Code:', error.statusCode)
    console.error('   Response:', error.response?.body)

    // Provide more specific error messages
    if (error.statusCode === 401) {
      throw new Error('Resend API authentication failed. Please check your RESEND_API_KEY.')
    } else if (error.statusCode === 403) {
      throw new Error('Resend API access forbidden. Please check your API key permissions.')
    } else if (error.statusCode === 400) {
      throw new Error('Invalid email request. Please check the email format and content.')
    } else {
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }
}
