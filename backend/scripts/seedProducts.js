require('dotenv').config();
const { MongoClient } = require('mongodb');
const products = require('../data/products');

async function seedProducts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('fashion_store');
    const collection = db.collection('products');
    
    // Clear existing products
    await collection.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const result = await collection.insertMany(products);
    console.log(`Added ${result.insertedCount} products to the database`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

seedProducts().catch(console.error);
