import express from 'express'
import { sendContactEmail } from '../email.js'

export const contactRouter = express.Router()

contactRouter.post('/contact', async (req, res) => {
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

    // Send email using Brevo API
    await sendContactEmail({ name, email, message })

    res.json({
      success: true,
      message: 'Contact email sent successfully'
    })
  } catch (error) {
    console.error('Contact email error:', error.message)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send contact email'
    })
  }
})
