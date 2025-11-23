#!/usr/bin/env node

// Simple test to verify sib-api-v3-sdk can be imported
console.log('🔍 Testing sib-api-v3-sdk import...')

try {
  const SibApiV3Sdk = await import('sib-api-v3-sdk')
  console.log('✅ sib-api-v3-sdk imported successfully')
  console.log('   Version:', SibApiV3Sdk.default?.version || 'unknown')

  // Test API client creation
  const client = SibApiV3Sdk.ApiClient.instance
  console.log('✅ API client created successfully')

  console.log('🎉 All tests passed!')
} catch (error) {
  console.error('❌ Import failed:', error.message)
  console.error('   Stack:', error.stack)
  process.exit(1)
}
