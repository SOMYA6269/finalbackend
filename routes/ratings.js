import express from 'express'
import mongoose from 'mongoose'
import { Rating } from '../models/Rating.js'

export const ratingsRouter = express.Router()

// Submit a rating
ratingsRouter.post('/submit', async (req, res) => {
  try {
    const { name, rating, comment, page } = req.body

    // Validation
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Rating and comment are required'
      })
    }

    const ratingNum = parseInt(rating)
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      })
    }

    if (comment.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Comment must be at least 3 characters long'
      })
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database is not connected. Please check MongoDB connection.'
      })
    }

    // Save rating to MongoDB
    const ratingDoc = new Rating({
      name: name?.trim() || undefined,
      rating: ratingNum,
      comment: comment.trim(),
      page: page || 'grocery-studio'
    })

    const savedRating = await ratingDoc.save()

    res.json({
      success: true,
      message: 'Thank you! Your feedback has been captured.',
      ratingId: savedRating._id
    })
  } catch (error) {
    console.error('Rating submission error:', error)
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message).join(', ')
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to submit rating. Please try again later.'
    })
  }
})

// Get all ratings
ratingsRouter.get('/all', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database is not connected. Please check MongoDB connection.',
        ratings: []
      })
    }

    const { page, limit = 50 } = req.query
    
    const query = page ? { page } : {}
    
    const ratings = await Rating.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('name rating comment page createdAt')

    res.json({
      success: true,
      ratings
    })
  } catch (error) {
    console.error('Get ratings error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ratings',
      ratings: []
    })
  }
})
