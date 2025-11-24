import express from 'express'
import { Resend } from 'resend'
import { sendContactEmail } from '../email.js'

export const emailRouter = express.Router()

// Send email endpoint using Resend API
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

    // Check if RESEND_API_KEY is configured
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey.trim() === '') {
      console.error('❌ RESEND_API_KEY environment variable is not set or empty')
      return res.status(500).json({
        success: false,
        error: 'Email service not configured',
        details: 'RESEND_API_KEY environment variable is missing'
      })
    }

    // Initialize Resend client
    const resend = new Resend(apiKey.trim())

    // Send email using Resend API
    const result = await resend.emails.send({
      from: 'ERP Contact <noreply@resend.dev>',
      to: ['dragdroperp@gmail.com'],
      subject: 'New Contact Form Message',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    })

    console.log('✅ Email sent successfully via Resend API:', result.data?.id)
    res.json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.data?.id
    })
  } catch (error) {
    console.error('❌ Send email error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
      details: 'Make sure RESEND_API_KEY is configured correctly'
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
        to: 'dragdroperp@gmail.com',
        subject: 'New contact request',
        sent: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Email test error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send test email',
      details: 'Make sure RESEND_API_KEY is configured in .env'
    })
  }
})

// Check email configuration
emailRouter.get('/config', (req, res) => {
  const apiKey = process.env.RESEND_API_KEY
  const isConfigured = !!(apiKey && apiKey.trim())

  res.json({
    success: true,
    configured: isConfigured,
    service: 'Resend (API)',
    senderEmail: 'noreply@resend.dev',
    senderName: 'ERP Contact',
    contactEmail: 'dragdroperp@gmail.com',
    apiKeyConfigured: isConfigured,
    apiKeyLength: apiKey ? apiKey.length : 0,
    message: isConfigured
      ? 'Resend email service is configured and ready'
      : 'Email service is not configured. Add RESEND_API_KEY to .env'
  })
})

