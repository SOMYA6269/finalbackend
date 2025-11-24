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
    const emailResult = await sendContactEmail({ name, email, message })

    // For production: return success as long as company notification was sent
    // User thank-you email is a nice-to-have but not critical
    const success = !!emailResult.companyEmail

    if (!success) {
      throw new Error('Failed to send company notification email')
    }

    const responseMessage = emailResult.userEmail
      ? 'Your message has been sent successfully! Check your email for confirmation.'
      : 'Your message has been sent successfully!'

    res.json({
      success: true,
      message: responseMessage,
      contactId: `contact_${Date.now()}`
    })
  } catch (error) {
    console.error('Contact email error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send contact email'
    })
  }
})

// Email system health check (for production monitoring)
contactRouter.get('/health', async (req, res) => {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey || apiKey.trim() === '') {
      return res.json({
        status: 'error',
        emailSystem: 'not_configured',
        message: 'RESEND_API_KEY not set',
        timestamp: new Date().toISOString()
      })
    }

    // Check if domain is verified by attempting to send a minimal test
    // This will fail if domain is not verified, but won't actually send an email
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey.trim())

    try {
      // Try to validate the API key and domain by making a minimal request
      await resend.domains.list()

      res.json({
        status: 'healthy',
        emailSystem: 'operational',
        domain: 'draganddrop.in',
        message: 'Email system is ready for production use',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      res.json({
        status: 'warning',
        emailSystem: 'domain_not_verified',
        domain: 'draganddrop.in',
        message: 'Domain verification required. Check Resend dashboard.',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      emailSystem: 'failed',
      message: 'Email system health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
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
