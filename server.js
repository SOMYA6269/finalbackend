import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { contactRouter } from './routes/contact.js'
import { ratingsRouter } from './routes/ratings.js'
import { emailRouter } from './routes/email.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dragdrop'

// -------------------------------
// FIXED CORS ORIGINS (100% WORKING)
// -------------------------------
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://draganddrop.in',
  'https://www.draganddrop.in'
]

// CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow no-origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.warn(`⚠️  CORS blocked origin: ${origin}`)
        callback(new Error('CORS blocked'))
      }
    },
    credentials: true,
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// -------------------------------
// MongoDB Connection
// -------------------------------
async function connectMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    console.log('⚠️  Server will continue without DB')
  }
}

// -------------------------------
// Email Service Check
// -------------------------------
function checkEmailService() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    console.warn('⚠️  RESEND_API_KEY environment variable is not set')
    console.warn('   Email functionality will not work')
    console.warn('   Set RESEND_API_KEY in your environment variables')
  } else {
    console.log('✅ Resend API key is configured')
  }
}

connectMongoDB()

// Check email service configuration
checkEmailService()

// -------------------------------
// Routes
// -------------------------------
app.use('/api/contact', contactRouter)
app.use('/api/ratings', ratingsRouter)
app.use('/api/email', emailRouter)

app.get('/ping', (req, res) => {
  res.send('pong')
})

// Health Check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState
  const dbStatus =
    dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected'

  res.json({
    status: 'ok',
    message: 'Server is running',
    database: dbStatus,
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
  })
})

// Root API (only for /api routes, not for frontend)
app.get('/api', (req, res) => {
  res.json({
    message: 'Drag & Drop ERP Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact/submit',
      ratings: '/api/ratings/submit',
    },
  })
})

// -------------------------------
// Static File Serving for React Router (Only if frontend/dist exists)
// -------------------------------
// Check if frontend/dist directory exists (for local development)
const distPath = path.resolve(__dirname, '../frontend/dist')
const distExists = fs.existsSync(distPath) && fs.statSync(distPath).isDirectory()

if (distExists) {
  // Serve static files from frontend/dist directory (favicon, assets, etc.)
  app.use(express.static(distPath, {
    maxAge: '1y', // Cache static assets for 1 year
    etag: true,
    lastModified: true
  }))

  // Wildcard route: All non-API routes should serve index.html (for React Router)
  // This must be LAST, after all other routes
  app.get('*', (req, res, next) => {
    // Skip API routes - they should have been handled above
    if (req.path.startsWith('/api')) {
      return next()
    }
    
    // Skip static files that should exist (favicon, robots.txt, sitemap.xml, etc.)
    const staticFiles = ['/favicon.ico', '/robots.txt', '/sitemap.xml']
    if (staticFiles.includes(req.path)) {
      return next()
    }
    
    // Serve index.html for all other routes (React Router will handle routing)
    const indexPath = path.resolve(distPath, 'index.html')
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err)
        res.status(404).json({ error: 'Page not found' })
      }
    })
  })
} else {
  // If frontend/dist doesn't exist (production backend-only deployment)
  // Only handle API routes, return 404 for everything else
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' })
    }
    res.status(404).json({ error: 'Not found. This is a backend API server.' })
  })
}

// -------------------------------
// Start Server
// -------------------------------
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

// Handle errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use`)
    process.exit(1)
  } else {
    console.error('❌ Server error:', error)
    process.exit(1)
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received. Shutting down...')
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0)
    })
  })
})
