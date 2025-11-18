import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Anonymous user',
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  page: {
    type: String,
    default: 'grocery-studio',
    trim: true
  }
}, {
  timestamps: true
})

export const Rating = mongoose.model('Rating', ratingSchema)
