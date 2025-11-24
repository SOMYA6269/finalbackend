#!/usr/bin/env node

// Simple test to verify resend can be imported
console.log('🔍 Testing resend import...')

try {
  const { Resend } = await import('resend')
  console.log('✅ resend imported successfully')

  // Test API client creation
  const resend = new Resend('test-api-key')
  console.log('✅ Resend client created successfully')

  console.log('🎉 All tests passed!')
} catch (error) {
  console.error('❌ Import failed:', error.message)
  console.error('   Stack:', error.stack)
  process.exit(1)
}
