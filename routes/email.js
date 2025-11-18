import express from 'express'
import { sendContactEmail } from '../services/email.js'

export const emailRouter = express.Router()

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
      details: 'Make sure EMAIL_USER and EMAIL_PASSWORD are configured in .env'
    })
  }
})

// Check email configuration
emailRouter.get('/config', (req, res) => {
  const isConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
  
  res.json({
    success: true,
    configured: isConfigured,
    service: process.env.EMAIL_SERVICE || 'gmail',
    email: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***` : 'Not configured',
    contactEmail: process.env.CONTACT_EMAIL || 'dragdroperp@gmail.com',
    message: isConfigured 
      ? 'Email service is configured and ready' 
      : 'Email service is not configured. Add EMAIL_USER and EMAIL_PASSWORD to .env'
  })
})

