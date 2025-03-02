require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {
    console.log('Starting MongoDB connection test...');
    console.log('Node.js version:', process.version);
    
    const uri = process.env.MONGODB_URI;
    console.log('Using connection string:', uri.replace(/:[^:@]+@/, ':****@'));
    
    const client = new MongoClient(uri, {
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 30000,
        ssl: true,
        tls: true,
        directConnection: false,
        retryWrites: true,
        retryReads: true
    });

    try {
        console.log('Attempting to connect...');
        await client.connect();
        console.log('Successfully connected to MongoDB!');

        const db = client.db('fashion_store');
        console.log('Attempting to query database...');
        
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        await client.close();
        console.log('Connection closed successfully');
    } catch (err) {
        console.error('Connection error:', err);
        if (err.cause) {
            console.error('Underlying error:', err.cause);
        }
    }
}

main().catch(console.error);
