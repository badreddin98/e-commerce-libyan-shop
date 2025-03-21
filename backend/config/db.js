const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host} (${process.env.NODE_ENV} mode)`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
