#!/usr/bin/env node

import { sendContactEmail } from './email.js'

async function testBothEmails() {
  console.log('🧪 Testing both email sending functionality...')

  try {
    const result = await sendContactEmail({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message to verify both emails are sent.'
    })

    console.log('✅ Test completed!')
    console.log('   Company email ID:', result.companyEmail || 'FAILED')
    console.log('   User email ID:', result.userEmail || 'FAILED')
    console.log('   Partial success:', result.partialSuccess ? 'Yes' : 'No')

    if (result.companyEmail && result.userEmail) {
      console.log('🎉 Both emails sent successfully!')
    } else if (result.companyEmail || result.userEmail) {
      console.log('⚠️  One email sent, one failed - check domain verification')
    } else {
      console.log('❌ Both emails failed - check API key and domain')
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

testBothEmails()
