import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create transporter
let transporter = null

if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

export async function sendContactEmail(data) {
  // Check if email is configured
  if (!transporter) {
    console.warn('⚠️  Email not configured. Skipping email send.')
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
  const companyMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.CONTACT_EMAIL || 'dragdroperp@gmail.com',
    subject: `New ${subject} from ${name}`,
    html: `
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
  }

  // Confirmation email to user
  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for contacting Drag & Drop ERP',
    html: `
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
  }

  try {
    await transporter.sendMail(companyMailOptions)
    await transporter.sendMail(userMailOptions)
    console.log('✅ Emails sent successfully')
  } catch (error) {
    console.error('❌ Email sending error:', error.message)
    throw error
  }
}
