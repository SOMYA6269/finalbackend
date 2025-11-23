import express from 'express'
import { Resend } from 'resend'
import { sendContactEmail } from '../email.js'

export const contactRouter = express.Router()

contactRouter.post('/submit', async (req, res) => {
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

    // Send emails using Resend API (notification to company + thank-you to user)
    await sendContactEmail({ name, email, message })

    res.json({
      success: true,
      message: 'Contact emails sent successfully'
    })
  } catch (error) {
    console.error('Contact email error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send contact email'
    })
  }
})

// Domain verification test endpoint
contactRouter.post('/test-domain', async (req, res) => {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey || apiKey.trim() === '') {
      return res.json({
        success: false,
        error: 'RESEND_API_KEY environment variable is not set',
        domainConfigured: false
      })
    }

    // Initialize Resend client
    const resend = new Resend(apiKey.trim())

    // Test sending with the verified domain
    const result = await resend.emails.send({
      from: 'ERP Contact <noreply@draganddrop.in>',
      to: ['dragdroperp@gmail.com'],
      subject: 'Domain Verification Test - ERP Contact',
      html: `
        <!DOCTYPE html>
        <html>
        <head><title>Domain Test</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Domain Verification Successful!</h2>
          <p>This email confirms that <strong>noreply@draganddrop.in</strong> is properly verified and working.</p>
          <p><em>Sent at: ${new Date().toISOString()}</em></p>
        </body>
        </html>
      `
    })

    res.json({
      success: true,
      message: 'Domain verification test email sent successfully',
      emailId: result.data?.id,
      sender: 'noreply@draganddrop.in',
      domainConfigured: true
    })

  } catch (error) {
    console.error('Domain test error:', error.message)

    // Provide specific error messages for domain issues
    if (error.statusCode === 403) {
      return res.json({
        success: false,
        error: 'Domain not verified. Please complete domain verification in Resend dashboard.',
        details: 'Add draganddrop.in to your verified domains at resend.com/domains',
        domainConfigured: false,
        statusCode: error.statusCode
      })
    }

    res.status(500).json({
      success: false,
      error: 'Domain verification test failed',
      details: error.message,
      domainConfigured: false,
      statusCode: error.statusCode
    })
  }
})
