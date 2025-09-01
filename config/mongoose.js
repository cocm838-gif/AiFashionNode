const mongooseLib = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || '';

let isConnected = false;

const connectMongo = async () => {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set; skipping MongoDB connection');
    return null;
  }

  if (isConnected) {
    console.log('✅ MongoDB already connected');
    return mongooseLib.connection;
  }

  try {
    mongooseLib.set('strictQuery', true);

    await mongooseLib.connect(MONGODB_URI, {
      autoIndex: true,
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    // Log connection details
    const connection = mongooseLib.connection;
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    isConnected = false;
    throw error;
  }
};

const disconnectMongo = async () => {
  try {
    if (isConnected) {
      await mongooseLib.disconnect();
      isConnected = false;
      console.log('🔌 MongoDB disconnected');
    }
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error);
  }
};

// Initialize MongoDB connection (non-blocking)
connectMongo().catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// module.exports = {
//   mongoose: mongooseLib,
//   connectMongo,
//   disconnectMongo,
// };


