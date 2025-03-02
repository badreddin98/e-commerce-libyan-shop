const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars from the correct path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    mongoose.set('strictQuery', false);
    
    // Log the connection string (without sensitive data)
    const sanitizedUri = process.env.MONGODB_URI.replace(
      /(mongodb\+srv:\/\/)([^:]+):([^@]+)@/,
      '$1[username]:[password]@'
    );
    console.log('Attempting to connect to MongoDB with URI:', sanitizedUri);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      heartbeatFrequencyMS: 2000,
      retryWrites: true,
      w: 'majority',
      ssl: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.error('Stack trace:', error.stack);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Failed to connect to MongoDB server. Please check if:');
      console.error('1. The connection string is correct');
      console.error('2. Network connectivity is available');
      console.error('3. MongoDB Atlas whitelist includes your IP address');
      console.error('4. MongoDB Atlas user has correct permissions');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
