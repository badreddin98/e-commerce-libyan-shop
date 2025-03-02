require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const dns = require('dns');
const SheinScraper = require('../utils/sheinScraper');

// Set DNS servers to Google's public DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Categories to scrape
const categories = [
  'dresses',
  'tops',
  'bottoms',
  'outerwear',
  'swimwear'
];

const fetchAndSaveProducts = async () => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect to MongoDB
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB');

    const scraper = new SheinScraper();

    for (const category of categories) {
      console.log(`Fetching products for category: ${category}`);
      
      // Fetch products from first 3 pages of each category
      for (let page = 1; page <= 3; page++) {
        const products = await scraper.getProductsByCategory(category, page);
        console.log(`Found ${products.length} products on page ${page}`);

        // Process each product
        for (const product of products) {
          try {
            // Check if product already exists
            const db = client.db('fashion_store');
            const collection = db.collection('products');
            const existingProduct = await collection.findOne({ sheinProductId: product.id });
            
            if (!existingProduct) {
              // Get detailed product information
              const details = await scraper.getProductDetails(product.url);
              
              // Combine basic and detailed information
              const productData = {
                name: product.name,
                description: details.description || 'No description available',
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                images: details.images.length > 0 ? details.images : product.images,
                category: product.category,
                size: details.sizes || [],
                color: details.colors || [],
                sheinProductId: product.id,
                sheinUrl: product.url,
                countInStock: 100, // Default value
                rating: 0,
                numReviews: 0,
                createdAt: new Date(),
                updatedAt: new Date()
              };

              // Save to database
              await collection.insertOne(productData);
              console.log(`Saved product: ${product.name}`);
            } else {
              console.log(`Product already exists: ${product.name}`);
            }
          } catch (error) {
            console.error(`Error processing product: ${product.name}`, error);
          }
        }
      }
    }

    console.log('Finished fetching all products');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
};

fetchAndSaveProducts();
