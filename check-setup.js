// Quick setup checker script
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dragdrop'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

console.log('🔍 Checking Backend Configuration...\n')

// Check Port
console.log(`✅ Port: ${PORT}`)
if (PORT >= 6000 && PORT < 7000) {
  console.log('⚠️  WARNING: Ports 6000-6999 are unsafe ports blocked by browsers!')
  console.log('   Use port 5000 instead: PORT=5000\n')
}

// Check MongoDB URI
const maskedUri = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
console.log(`📊 MongoDB URI: ${maskedUri}`)

if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
  console.log('⚠️  WARNING: Using local MongoDB. For production, use MongoDB Atlas!')
}

// Test MongoDB Connection
console.log('\n🔌 Testing MongoDB connection...')
try {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  })
  console.log('✅ MongoDB connection successful!')
  console.log(`📊 Database: ${mongoose.connection.db.databaseName}`)
  await mongoose.disconnect()
} catch (error) {
  console.log('❌ MongoDB connection failed!')
  console.log(`   Error: ${error.message}`)
  console.log('\n💡 Solutions:')
  if (error.message.includes('ECONNREFUSED')) {
    console.log('   1. For MongoDB Atlas:')
    console.log('      - Check your connection string in .env')
    console.log('      - Verify username/password are correct')
    console.log('      - Make sure IP address is whitelisted (0.0.0.0/0 for testing)')
    console.log('   2. For local MongoDB:')
    console.log('      - Make sure MongoDB service is running')
    console.log('      - Check if MongoDB is installed')
  } else if (error.message.includes('authentication')) {
    console.log('   1. Check username/password in connection string')
    console.log('   2. Verify database user has correct permissions')
  } else {
    console.log('   1. Verify MONGODB_URI in .env file')
    console.log('   2. Check network/firewall settings')
    console.log('   3. Ensure MongoDB Atlas cluster is running')
  }
}

// Check Frontend URL
console.log(`\n🌐 Frontend URL: ${FRONTEND_URL}`)

console.log('\n✅ Setup check complete!')
console.log('\n📝 Next steps:')
console.log('   1. Update PORT=5000 in backend/.env')
console.log('   2. Add MongoDB Atlas connection string to backend/.env')
console.log('   3. Update VITE_API_URL=http://localhost:5000/api in frontend/.env')
console.log('   4. Run: npm install (if not done)')
console.log('   5. Run: npm start')
