const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = 'mongodb+srv://elyazgi98:TjGyVgyz7L44U8A4@cluster0.ajvsb.mongodb.net/libyan-shop?retryWrites=true&w=majority&appName=Cluster0';

// Product model schema
// Drop the existing products collection to remove indexes
const dropCollection = async () => {
  try {
    await mongoose.connection.dropCollection('products');
    console.log('Dropped products collection');
  } catch (error) {
    console.log('Collection might not exist, continuing...');
  }
};

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

async function createSampleProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop collection to remove indexes
    await dropCollection();
    
    // Clear existing products if any remain
    await Product.deleteMany({});
    console.log('Cleared existing products');

    const products = [];
    
    // Sample product data for each category
    const productData = {
      dresses: [
        { name: 'Floral Summer Dress', price: 49.99 },
        { name: 'Evening Gown', price: 89.99 },
        { name: 'Casual Maxi Dress', price: 39.99 }
      ],
      tops: [
        { name: 'Basic White T-Shirt', price: 19.99 },
        { name: 'Striped Blouse', price: 29.99 },
        { name: 'Crop Top', price: 24.99 }
      ],
      pants: [
        { name: 'High-Waist Jeans', price: 59.99 },
        { name: 'Cargo Pants', price: 49.99 },
        { name: 'Leggings', price: 29.99 }
      ],
      skirts: [
        { name: 'Pleated Midi Skirt', price: 39.99 },
        { name: 'Mini Denim Skirt', price: 34.99 },
        { name: 'A-Line Skirt', price: 44.99 }
      ],
      outerwear: [
        { name: 'Denim Jacket', price: 69.99 },
        { name: 'Winter Coat', price: 99.99 },
        { name: 'Bomber Jacket', price: 79.99 }
      ],
      shoes: [
        { name: 'Sneakers', price: 59.99 },
        { name: 'Ankle Boots', price: 79.99 },
        { name: 'Sandals', price: 39.99 }
      ],
      accessories: [
        { name: 'Leather Handbag', price: 89.99 },
        { name: 'Statement Necklace', price: 29.99 },
        { name: 'Silk Scarf', price: 24.99 }
      ]
    };

    // Create multiple variations of each product
    for (const category of categories) {
      const baseProducts = productData[category];
      for (const baseProduct of baseProducts) {
        // Create variations of each product
        const variations = [
          { color: 'Black', size: 'S' },
          { color: 'White', size: 'M' },
          { color: 'Blue', size: 'L' },
          { color: 'Red', size: 'XL' },
          { color: 'Pink', size: 'S' }
        ];

        for (const variation of variations) {
          products.push({
            name: `${baseProduct.name} - ${variation.color}`,
            description: `Beautiful ${category} item from our collection. Color: ${variation.color}, Size: ${variation.size}`,
            price: baseProduct.price,
            images: [
              `https://picsum.photos/400/600?random=${Math.floor(Math.random() * 1000)}`,
              `https://picsum.photos/400/600?random=${Math.floor(Math.random() * 1000)}`
            ],
            category: category,
            stock: Math.floor(Math.random() * 50) + 10,
            ratings: (Math.random() * 2 + 3).toFixed(1),
            numReviews: Math.floor(Math.random() * 100)
          });
        }
      }
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

createSampleProducts();
