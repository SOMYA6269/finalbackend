import express from 'express'
import mongoose from 'mongoose'
import { Contact } from '../models/Contact.js'
import { sendContactEmail } from '../services/email.js'

export const contactRouter = express.Router()

contactRouter.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, reason, message } = req.body

    // Validation
    if (!name || !email || !reason || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, reason, and message are required'
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

    // Check MongoDB connection before saving
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database is not connected. Please check MongoDB connection and try again.'
      })
    }

    // Save to MongoDB
    const contact = new Contact({
      name,
      email,
      phone: phone || undefined,
      reason,
      message
    })

    const savedContact = await contact.save()

    // Send immediate response (don't wait for email)
    res.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
      submissionId: savedContact._id
    })

    // Send email asynchronously (non-blocking, won't delay response)
    sendContactEmail({
      name,
      email,
      phone: phone || 'Not provided',
      reason,
      message
    }).catch((emailError) => {
      console.error('Email sending failed (non-blocking):', emailError.message)
      // Email failure doesn't affect the user response
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message).join(', ')
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form. Please try again later.'
    })
  }
})

// Get all contact submissions (admin endpoint)
contactRouter.get('/all', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database is not connected. Please check MongoDB connection.',
        contacts: []
      })
    }

    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100)
    res.json({
      success: true,
      contacts
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contacts',
      contacts: []
    })
  }
})
