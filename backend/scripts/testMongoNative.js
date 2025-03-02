require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testMongoConnection() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db('fashion_store');
    const collection = db.collection('products');
    
    const count = await collection.countDocuments();
    console.log(`Number of products in database: ${count}`);
    
    await client.close();
    console.log('Connection closed.');
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testMongoConnection();
