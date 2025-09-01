const mongoose = require('mongoose');

// Test Mongoose connection
async function testMongooseConnection() {
  console.log('🔍 Testing Mongoose Connection...\n');
  
  // Check if MONGODB_URI is set
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI environment variable is not set');
    console.log('💡 Please set MONGODB_URI in your .env file');
    console.log('   Example: MONGODB_URI=mongodb://localhost:27017/your_database');
    return;
  }
  
  console.log('✅ MONGODB_URI is configured');
  console.log(`📝 Connection string: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`);
  
  try {
    // Set strict query mode
    mongoose.set('strictQuery', true);
    
    console.log('🔄 Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Get connection info
    const connection = mongoose.connection;
    console.log(`📊 Connection state: ${connection.readyState}`);
    console.log(`🏠 Database name: ${connection.name}`);
    console.log(`🔗 Host: ${connection.host}`);
    console.log(`🚪 Port: ${connection.port}`);
    
    // Test a simple operation
    console.log('\n🧪 Testing database operation...');
    const collections = await connection.db.listCollections().toArray();
    console.log(`📚 Found ${collections.length} collections in database`);
    
    if (collections.length > 0) {
      console.log('📋 Collections:');
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }
    
    console.log('\n✅ Mongoose connection test completed successfully!');
    
  } catch (error) {
    console.log('❌ Failed to connect to MongoDB');
    console.log('🔍 Error details:');
    console.log(`   Message: ${error.message}`);
    console.log(`   Code: ${error.code}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Make sure MongoDB server is running');
      console.log('   2. Check if the connection string is correct');
      console.log('   3. Verify network connectivity');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Check if the hostname in MONGODB_URI is correct');
      console.log('   2. Verify DNS resolution');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Check username and password in connection string');
      console.log('   2. Verify user has proper permissions');
    }
    
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run the test
testMongooseConnection().catch(console.error);
