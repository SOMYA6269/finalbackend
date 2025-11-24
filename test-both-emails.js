

#!/usr/bin/env node

import { sendContactEmail } from './email.js'

async function testBothEmails() {
  console.log('🧪 Testing both email sending functionality...')

  try {
    const result = await sendContactEmail({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message to verify both emails are sent with professional formatting and logo.'
    })

    console.log('✅ Test completed!')
    console.log('   Company email ID:', result.companyEmail || 'FAILED')
    console.log('   User email ID:', result.userEmail || 'FAILED')
    console.log('   Partial success:', result.partialSuccess ? 'Yes' : 'No')

    if (result.companyEmail && result.userEmail) {
      console.log('🎉 Both emails sent successfully with professional formatting!')
      console.log('   📧 Company notification sent to dragdroperp@gmail.com')
      console.log('   🙏 Thank-you email sent to test@example.com')
      console.log('   🖼️  Both emails include ddfinal.png logo')
    } else if (result.companyEmail) {
      console.log('⚠️  Company email sent, but thank-you email failed')
      console.log('   📧 Company notification: SUCCESS')
      console.log('   🙏 Thank-you email: FAILED')
    } else {
      console.log('❌ Both emails failed - check API key and domain setup')
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('   Possible issues:')
    console.log('   - RESEND_API_KEY not set')
    console.log('   - API key invalid')
    console.log('   - Domain not verified (for user emails)')
    process.exit(1)
  }
}

testBothEmails()
