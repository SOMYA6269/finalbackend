import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Send contact emails using Gmail SMTP with Nodemailer
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Contact name
 * @param {string} contactData.email - Contact email
 * @param {string} contactData.message - Contact message
 */
// Retry function for email sending
async function sendEmailWithRetry(transporter, mailOptions, maxRetries = 2) {
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`   📤 Attempt ${attempt}/${maxRetries}...`)
      const result = await transporter.sendMail(mailOptions)
      console.log(`   ✅ Email sent successfully on attempt ${attempt}:`, result.messageId)
      return result
    } catch (error) {
      console.error(`   ❌ Attempt ${attempt}/${maxRetries} failed:`, error.message)
      lastError = error

      // Don't retry on authentication errors
      if (error.code === 'EAUTH') {
        break
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 // 2s, 4s
        console.log(`   ⏳ Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

export async function sendContactEmail({ name, email, message }) {
  // Validate environment variables
  const gmailUser = process.env.GMAIL_USER
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailAppPassword) {
    console.error('❌ Gmail SMTP credentials not configured')
    throw new Error('Gmail SMTP credentials are not configured')
  }

  // Create Gmail SMTP transporter with improved settings
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL instead of STARTTLS
    auth: {
      user: gmailUser,
      pass: gmailAppPassword
    },
    // Add timeout and connection settings for better reliability
    connectionTimeout: 15000, // 15 seconds (increased)
    greetingTimeout: 10000,  // 10 seconds (increased)
    socketTimeout: 15000,    // 15 seconds (increased)
    // Enable debugging for troubleshooting
    debug: process.env.NODE_ENV !== 'production',
    logger: process.env.NODE_ENV !== 'production'
  })

  try {
    console.log('📧 [PRODUCTION] Sending contact emails via Gmail SMTP...')
    console.log('   User:', name, '<' + email + '>')
    console.log('   Message length:', message.length, 'characters')
    console.log('   Timestamp:', new Date().toISOString())

    // 1. Send notification email to company
    console.log('   📤 Sending notification to company...')
    console.log('      From: ERP Contact <' + gmailUser + '>')
    console.log('      To: dragdroperp@gmail.com')

    const companyMailOptions = {
      from: `ERP Contact <${gmailUser}>`,
      to: 'dragdroperp@gmail.com',
      subject: 'New Contact Form Submission - ERP Contact',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0f172a;">🔔 New Contact Request</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>💬 Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #0f172a;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">
              Sent: ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `,
      text: `New Contact Request

Name: ${name}
Email: ${email}
Message: ${message}

Sent: ${new Date().toISOString()}`
    }

    const companyResult = await sendEmailWithRetry(transporter, companyMailOptions)

    // 2. Send thank-you email to user
    console.log('   📤 Sending thank-you to user...')
    console.log('      From: ERP Contact <' + gmailUser + '>')
    console.log('      To:', email)

    const userMailOptions = {
      from: `ERP Contact <${gmailUser}>`,
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0f172a;">🙏 Thank You for Contacting Us</h2>

          <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 30px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Hi <strong>${name}</strong>,
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for reaching out to us! We've received your message and appreciate your interest in our services.
            </p>

            <div style="background: #10b981; color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; font-size: 18px;">🚀 What happens next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Our team will review your inquiry within 24 hours</li>
                <li>We'll contact you back with tailored solutions</li>
                <li>Together we'll find the perfect solution for your needs</li>
              </ul>
            </div>

            <p style="font-size: 16px; margin-top: 20px;">
              If you have any questions in the meantime, feel free to reply to this email.
            </p>

            <p style="font-size: 16px;">
              Best regards,<br>
              <strong>The ERP Contact Team</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              ERP Contact | Professional ERP Solutions<br>
              Email: <a href="mailto:dragdroperp@gmail.com">dragdroperp@gmail.com</a> |
              Website: <a href="https://draganddrop.in">draganddrop.in</a>
            </p>
          </div>
        </div>
      `,
      text: `Thank You for Contacting Us

Hi ${name},

Thank you for reaching out to us! We've received your message and appreciate your interest in our services.

What happens next?
• Our team will review your inquiry within 24 hours
• We'll contact you back with tailored solutions
• Together we'll find the perfect solution for your needs

If you have any questions in the meantime, feel free to reply to this email.

Best regards,
The ERP Contact Team

---
ERP Contact | Professional ERP Solutions
Email: dragdroperp@gmail.com | Website: draganddrop.in`
    }

    const userResult = await sendEmailWithRetry(transporter, userMailOptions)

    console.log('🎉 [PRODUCTION] Both emails sent successfully!')
    console.log('   📧 Company notification: Sent')
    console.log('   🙏 User thank-you: Sent')

    return {
      companyEmail: companyResult.messageId,
      userEmail: userResult.messageId,
      success: true
    }

  } catch (error) {
    console.error('❌ Gmail SMTP email sending error:')
    console.error('   Message:', error.message)
    console.error('   Code:', error.code)

    // Provide specific error messages for Gmail SMTP issues
    if (error.code === 'EAUTH') {
      throw new Error('Gmail authentication failed. Please check your GMAIL_USER and GMAIL_APP_PASSWORD. Make sure you are using an App Password, not your regular password.')
    } else if (error.code === 'ECONNECTION' || error.code === 'ENOTFOUND') {
      throw new Error('Gmail SMTP connection failed. This might be due to network restrictions. Please try again in a few minutes.')
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Gmail SMTP connection timed out. Please try again. If this persists, check if Gmail is blocking your requests.')
    } else if (error.code === 'EPROTOCOL') {
      throw new Error('Gmail SMTP protocol error. This might be due to Gmail security restrictions. Please check your account security settings.')
    } else {
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }
}
