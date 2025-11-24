import express from 'express'
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
