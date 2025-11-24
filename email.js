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
export async function sendContactEmail({ name, email, message }) {
  // Validate environment variables
  const gmailUser = process.env.GMAIL_USER
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailAppPassword) {
    console.error('❌ Gmail SMTP credentials not configured')
    throw new Error('Gmail SMTP credentials are not configured')
  }

  // Create Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword
    }
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

    const companyResult = await transporter.sendMail(companyMailOptions)
    console.log('   ✅ Company notification sent successfully:', companyResult.messageId)

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

    const userResult = await transporter.sendMail(userMailOptions)
    console.log('   ✅ Thank-you email sent successfully:', userResult.messageId)

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
      throw new Error('Gmail authentication failed. Please check your GMAIL_USER and GMAIL_APP_PASSWORD.')
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Gmail SMTP connection failed. Please check your internet connection.')
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Gmail SMTP connection timed out. Please try again.')
    } else {
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }
}
