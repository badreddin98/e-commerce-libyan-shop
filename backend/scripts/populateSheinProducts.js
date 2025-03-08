const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SheinScraper = require('../utils/sheinScraper');
const Product = require('../models/productModel');

// Load env vars
dotenv.config();

// Configure Mongoose
mongoose.set('strictQuery', true);

// Connect to MongoDB with extended timeout and additional options
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Timeout after 30s instead of 10s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const categories = [
  'women-dresses',
  'women-tops',
  'women-sweaters',
  'women-pants',
  'women-skirts',
  'women-jumpsuits',
  'women-swimwear',
  'women-shoes',
  'women-accessories'
];

const scraper = new SheinScraper();

async function clearExistingProducts() {
  try {
    await Product.deleteMany({});
    console.log('Existing products cleared');
  } catch (error) {
    console.error('Error clearing products:', error);
    process.exit(1);
  }
}

async function scrapeAndSaveProducts() {
  // Ensure DB is connected
  await connectDB();

  try {
    await clearExistingProducts();

    for (const category of categories) {
      console.log(`Scraping category: ${category}`);
      
      // Get products list from category page
      const products = await scraper.getProductsByCategory(category);
      console.log(`Found ${products.length} products in ${category}`);

      // Get detailed info for each product
      for (const product of products) {
        try {
          console.log(`Getting details for product: ${product.name}`);
          const details = await scraper.getProductDetails(product.url);

          // Combine product data with details
          const productData = {
            name: details.name || product.name,
            description: details.description,
            price: details.price || product.price,
            originalPrice: product.originalPrice,
            images: details.images.length > 0 ? details.images : product.images,
            category: product.category,
            size: details.sizes,
            color: details.colors,
            countInStock: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
            rating: (Math.random() * 2) + 3, // Random rating between 3-5
            numReviews: Math.floor(Math.random() * 100), // Random number of reviews
            sheinProductId: product.id,
            sheinUrl: product.url
          };

          // Save to database
          await Product.create(productData);
          console.log(`Saved product: ${productData.name}`);

          // Add delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
          console.error(`Error processing product ${product.name}:`, error);
          continue; // Continue with next product if one fails
        }
      }
    }

    console.log('All products have been scraped and saved');
    process.exit(0);

  } catch (error) {
    console.error('Error in main scraping process:', error);
    process.exit(1);
  }
}

// Run the script
scrapeAndSaveProducts();
