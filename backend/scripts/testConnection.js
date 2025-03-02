require('dotenv').config();
const dns = require('dns');
const { MongoClient } = require('mongodb');

// Set DNS servers to Google's public DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function testConnection() {
  console.log('Testing DNS resolution with Google DNS...');
  
  try {
    // Test DNS resolution
    const records = await dns.promises.resolveSrv('_mongodb._tcp.cluster0.ajvsb.mongodb.net');
    console.log('DNS SRV records:', records);
  } catch (error) {
    console.error('DNS resolution error:', error);
    console.log('Trying direct connection...');
    
    try {
      // Try connecting without SRV resolution
      const uri = process.env.MONGODB_URI.replace('mongodb+srv://', 'mongodb://');
      const client = new MongoClient(uri, {
        directConnection: true,
        serverSelectionTimeoutMS: 5000
      });
      await client.connect();
      await client.db('admin').command({ ping: 1 });
      console.log("Successfully connected to MongoDB!");
      await client.close();
    } catch (directError) {
      console.error('Direct connection error:', directError);
    }
  }
}

testConnection();
