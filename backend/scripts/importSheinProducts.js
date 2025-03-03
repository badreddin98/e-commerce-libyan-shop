const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Product model schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  stock: { type: Number, default: 50 },
  ratings: { type: Number, default: 4.5 },
  numReviews: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

// Categories to fetch from
const categories = [
  'dresses',
  'tops',
  'pants',
  'skirts',
  'outerwear',
  'shoes',
  'accessories'
];

async function fetchSheinProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    const products = [];
    let totalProducts = 0;

    for (const category of categories) {
      if (totalProducts >= 100) break;

      const response = await axios.get(`https://api.shein.com/v2/products/list?category=${category}&limit=15`);
      
      if (response.data && response.data.products) {
        const categoryProducts = response.data.products.map(item => ({
          name: item.name,
          description: item.description || `Beautiful ${category} item from our collection`,
          price: (item.price * 1.3).toFixed(2), // Adding 30% markup
          images: item.images || [`https://placeholder.com/400x600?text=${encodeURIComponent(item.name)}`],
          category: category,
          stock: Math.floor(Math.random() * 50) + 10,
          ratings: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3 and 5
          numReviews: Math.floor(Math.random() * 100)
        }));

        products.push(...categoryProducts);
        totalProducts += categoryProducts.length;
      }
    }

    // If we couldn't get real products, create sample ones
    if (products.length < 100) {
      const sampleProducts = Array.from({ length: 100 - products.length }, (_, i) => ({
        name: `Sample Product ${i + 1}`,
        description: 'A beautiful product from our collection',
        price: Math.floor(Math.random() * 100) + 20,
        images: ['https://via.placeholder.com/400x600'],
        category: categories[Math.floor(Math.random() * categories.length)],
        stock: Math.floor(Math.random() * 50) + 10,
        ratings: (Math.random() * 2 + 3).toFixed(1),
        numReviews: Math.floor(Math.random() * 100)
      }));

      products.push(...sampleProducts);
    }

    // Insert products into database
    await Product.insertMany(products);
    console.log(`Successfully imported ${products.length} products`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fetchSheinProducts();
