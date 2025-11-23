import express from 'express'
import SibApiV3Sdk from 'sib-api-v3-sdk'
import { sendContactEmail } from '../services/email.js'

export const emailRouter = express.Router()

// Send email endpoint using Brevo API
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

    // Check if BREVO_API_KEY is configured
    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey || apiKey.trim() === '') {
      console.error('❌ BREVO_API_KEY environment variable is not set or empty')
      return res.status(500).json({
        success: false,
        error: 'Email service not configured',
        details: 'BREVO_API_KEY environment variable is missing'
      })
    }

    // Initialize Brevo API client
    const client = SibApiV3Sdk.ApiClient.instance
    client.authentications['api-key'].apiKey = apiKey.trim()

    const brevoEmail = new SibApiV3Sdk.TransactionalEmailsApi()

    // Send email using Brevo API
    const result = await brevoEmail.sendTransacEmail({
      sender: { email: process.env.SENDER_EMAIL || 'dragdroperp@gmail.com', name: process.env.SENDER_NAME || 'Drag & Drop ERP' },
      to: [{ email: process.env.CONTACT_EMAIL || 'dragdroperp@gmail.com' }],
      subject: 'New Contact Form Message',
      htmlContent: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    })

    console.log('✅ Email sent successfully via Brevo API:', result.messageId)
    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('❌ Send email error:', error.response?.body || error.message)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
      details: error.response?.body || 'Make sure BREVO_API_KEY is configured correctly'
    })
  }
})

// Test email endpoint
emailRouter.post('/test', async (req, res) => {
  try {
    const { 
      name = 'Test User', 
      email = 'test@example.com', 
      phone = '1234567890',
      reason = 'general',
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

    // Send test email
    await sendContactEmail({
      name,
      email,
      phone,
      reason,
      message
    })

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      details: {
        to: email,
        subject: `New ${reason} from ${name}`,
        sent: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Email test error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send test email',
      details: 'Make sure BREVO_API_KEY is configured in .env'
    })
  }
})

// Check email configuration
emailRouter.get('/config', (req, res) => {
  const apiKey = process.env.BREVO_API_KEY
  const isConfigured = !!(apiKey && apiKey.trim())

  res.json({
    success: true,
    configured: isConfigured,
    service: 'Brevo (API)',
    senderEmail: process.env.SENDER_EMAIL || 'dragdroperp@gmail.com',
    senderName: process.env.SENDER_NAME || 'Drag & Drop ERP',
    contactEmail: process.env.CONTACT_EMAIL || 'dragdroperp@gmail.com',
    apiKeyConfigured: isConfigured,
    apiKeyLength: apiKey ? apiKey.length : 0,
    message: isConfigured
      ? 'Brevo email service is configured and ready'
      : 'Email service is not configured. Add BREVO_API_KEY environment variable'
  })
})

