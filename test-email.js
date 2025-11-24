#!/usr/bin/env node

// Simple test to verify nodemailer can be imported
console.log('🔍 Testing nodemailer import...')

try {
  const nodemailer = await import('nodemailer')
  console.log('✅ nodemailer imported successfully')

  // Test transporter creation (without actual connection)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com',
      pass: 'test-password'
    }
  })
  console.log('✅ Nodemailer transporter created successfully')

  console.log('🎉 All tests passed!')
} catch (error) {
  console.error('❌ Import failed:', error.message)
  console.error('   Stack:', error.stack)
  process.exit(1)
}
