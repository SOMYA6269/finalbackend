#!/usr/bin/env node

// Simple test to verify resend can be imported and templates work
console.log('🔍 Testing resend import and email templates...')

try {
  const { Resend } = await import('resend')
  console.log('✅ resend imported successfully')

  // Test API client creation
  const resend = new Resend('test-api-key')
  console.log('✅ Resend client created successfully')

  // Test email template functions exist
  const emailModule = await import('./email.js')
  console.log('✅ Email module imported successfully')

  if (typeof emailModule.sendContactEmail === 'function') {
    console.log('✅ sendContactEmail function available')
  } else {
    throw new Error('sendContactEmail function not found')
  }

  console.log('🎉 All tests passed!')
  console.log('   Note: This test only verifies imports and function availability.')
  console.log('   Actual email sending requires valid RESEND_API_KEY and domain verification.')
} catch (error) {
  console.error('❌ Test failed:', error.message)
  console.error('   Stack:', error.stack)
  process.exit(1)
}
