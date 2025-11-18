import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['general', 'support', 'sales', 'partnership', 'other']
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

export const Contact = mongoose.model('Contact', contactSchema)
