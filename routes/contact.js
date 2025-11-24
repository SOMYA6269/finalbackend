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

// Domain verification and email testing endpoint
contactRouter.post('/test-email-delivery', async (req, res) => {
  try {
    const { testEmail } = req.body

    if (!testEmail) {
      return res.status(400).json({
        success: false,
        error: 'testEmail is required'
      })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey.trim() === '') {
      return res.json({
        success: false,
        error: 'RESEND_API_KEY not configured',
        issue: 'API key missing'
      })
    }

    const resend = new Resend(apiKey.trim())

    console.log('🧪 Testing email delivery to:', testEmail)

    // Test email delivery
    const result = await resend.emails.send({
      from: 'ERP Contact <noreply@resend.dev>',
      to: [testEmail],
      subject: 'Email Delivery Test - ERP Contact',
      html: `
        <!DOCTYPE html>
        <html>
        <head><title>Email Delivery Test</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Email Delivery Test</h2>
          <p>This is a test email to verify delivery to your inbox.</p>
          <p><strong>If you received this:</strong> ✅ Email delivery is working!</p>
          <p><strong>If this went to spam:</strong> ⚠️ Check your spam folder and email filters</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <hr>
          <p><small>ERP Contact - Email Delivery Test</small></p>
        </body>
        </html>
      `
    })

    res.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: result.data?.id,
      testEmail: testEmail,
      instructions: 'Check your inbox (and spam folder) for the test email',
      troubleshooting: [
        '1. Check your inbox for the test email',
        '2. If not found, check your spam/junk folder',
        '3. Add noreply@resend.dev to your contacts',
        '4. Check your email filters and rules',
        '5. For better deliverability, verify your domain in Resend'
      ]
    })

  } catch (error) {
    console.error('Email delivery test failed:', error.message)
    res.status(500).json({
      success: false,
      error: 'Email delivery test failed',
      details: error.message,
      troubleshooting: [
        'API key may be invalid',
        'Domain may need verification',
        'Check Resend dashboard for account status',
        'Verify your API key permissions'
      ]
    })
  }
})
