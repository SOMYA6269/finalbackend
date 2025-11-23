import express from 'express'
import SibApiV3Sdk from 'sib-api-v3-sdk'
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

// Test Brevo configuration endpoint
contactRouter.get('/test-brevo', async (req, res) => {
  try {
    const apiKey = process.env.BREVO_API_KEY

    if (!apiKey || apiKey.trim() === '') {
      return res.json({
        success: false,
        error: 'BREVO_API_KEY environment variable is not set',
        configured: false
      })
    }

    // Initialize Brevo API client
    const client = SibApiV3Sdk.ApiClient.instance
    client.authentications['api-key'].apiKey = apiKey.trim()

    // Try to get account info to test API key
    const accountApi = new SibApiV3Sdk.AccountApi()

    try {
      const accountInfo = await accountApi.getAccount()
      res.json({
        success: true,
        configured: true,
        message: 'Brevo API key is valid',
        account: {
          email: accountInfo.email,
          companyName: accountInfo.companyName,
          plan: accountInfo.plan?.type
        }
      })
    } catch (apiError) {
      res.json({
        success: false,
        configured: false,
        error: 'Brevo API key is invalid or has insufficient permissions',
        details: apiError.message,
        status: apiError.response?.status
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to test Brevo configuration',
      details: error.message
    })
  }
})
