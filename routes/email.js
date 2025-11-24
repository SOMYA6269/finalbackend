import express from 'express'
import nodemailer from 'nodemailer'
import { sendContactEmail } from '../email.js'

export const emailRouter = express.Router()

// Send email endpoint using Gmail SMTP
emailRouter.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      })
    }

    // Check if Gmail credentials are configured
    const gmailUser = process.env.GMAIL_USER
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
    if (!gmailUser || !gmailAppPassword) {
      console.error('❌ Gmail SMTP credentials not configured')
      return res.status(500).json({
        success: false,
        error: 'Email service not configured',
        details: 'GMAIL_USER and GMAIL_APP_PASSWORD environment variables are missing'
      })
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

    // Send email using Gmail SMTP
    const mailOptions = {
      from: `ERP Contact <${gmailUser}>`,
      to: 'dragdroperp@gmail.com',
      subject: 'New Contact Form Message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">New Contact Form Submission</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>💬 Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #0f172a;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `,
      text: `New Contact Form Submission

Name: ${name}
Email: ${email}
Message: ${message}`
    }

    const result = await transporter.sendMail(mailOptions)

    console.log('✅ Email sent successfully via Gmail SMTP:', result.messageId)
    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('❌ Send email error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
      details: 'Make sure GMAIL_USER and GMAIL_APP_PASSWORD are configured correctly'
    })
  }
})

// Test email endpoint
emailRouter.post('/test', async (req, res) => {
  try {
    const {
      name = 'Test User',
      email = 'test@example.com',
      message = 'This is a test email from the API'
    } = req.body

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      })
    }

    // Send test email using the main sendContactEmail function
    await sendContactEmail({
      name,
      email,
      message
    })

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      details: {
        companyEmail: 'dragdroperp@gmail.com',
        userEmail: email,
        sent: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Email test error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send test email',
      details: 'Make sure GMAIL_USER and GMAIL_APP_PASSWORD are configured in .env'
    })
  }
})

// Check email configuration
emailRouter.get('/config', (req, res) => {
  const gmailUser = process.env.GMAIL_USER
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
  const isConfigured = !!(gmailUser && gmailAppPassword)

  res.json({
    success: true,
    configured: isConfigured,
    service: 'Gmail SMTP',
    senderEmail: gmailUser || 'not-configured',
    senderName: 'ERP Contact',
    contactEmail: 'dragdroperp@gmail.com',
    gmailUserConfigured: !!gmailUser,
    gmailAppPasswordConfigured: !!gmailAppPassword,
    message: isConfigured
      ? 'Gmail SMTP email service is configured and ready'
      : 'Email service is not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD to .env'
  })
})

