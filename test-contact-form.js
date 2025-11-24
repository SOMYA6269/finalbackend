#!/usr/bin/env node

import { sendContactEmail } from './email.js'

async function testContactForm() {
  console.log('🧪 Testing contact form email functionality...')
  console.log('   This will send test emails to verify Gmail SMTP works')
  console.log('')

  const testData = {
    name: 'Test User',
    email: 'dragdroperp@gmail.com', // Use your own email to test both sending and receiving
    message: 'This is a test message from the contact form. Please ignore this email.'
  }

  try {
    console.log('📝 Test data:', testData)
    console.log('')

    // Note: This will actually send emails to dragdroperp@gmail.com and to the test@example.com (which will likely bounce or go to spam)
    const result = await sendContactEmail(testData)

    console.log('✅ Contact form test completed successfully!')
    console.log('   Company email ID:', result.companyEmail)
    console.log('   User email ID:', result.userEmail)
    console.log('')
    console.log('📧 Check dragdroperp@gmail.com for the notification email')
    console.log('⚠️  The user thank-you email may go to spam or bounce since test@example.com is not real')

  } catch (error) {
    console.error('❌ Contact form test failed:', error.message)
    console.error('')
    console.error('🔧 Troubleshooting:')
    console.error('   1. Make sure GMAIL_USER and GMAIL_APP_PASSWORD are set in .env')
    console.error('   2. Enable 2-factor authentication on Gmail account')
    console.error('   3. Generate an App Password in Gmail settings')
    console.error('   4. Make sure the App Password is correct (no spaces)')
    process.exit(1)
  }
}

testContactForm()
