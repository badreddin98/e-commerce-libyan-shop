const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Sample data for development
const sampleProducts = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    description: 'Comfortable cotton t-shirt',
    price: 29.99,
    image: 'https://img.ltwebstatic.com/images3_pi/2023/11/20/1700468611d61c0cafcd50b0ec7602961cab46d468_thumbnail_900x.webp',
    category: 'Men',
    rating: 4.5,
    numReviews: 10,
    countInStock: 20
  },
  {
    id: '2',
    name: 'Denim Jeans',
    description: 'Classic blue jeans',
    price: 59.99,
    image: 'https://img.ltwebstatic.com/images3_pi/2023/11/21/17005511432f2d6f4b8f0def6ce0b9c6f2dd658f6d_thumbnail_900x.webp',
    category: 'Men',
    rating: 4.0,
    numReviews: 8,
    countInStock: 15
  }
];

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products.length > 0 ? products : sampleProducts);
  } catch (error) {
    res.json(sampleProducts); // Fallback to sample data
  }
});

// Get trending products
router.get('/trending', async (req, res) => {
  try {
    const products = await Product.find({}).limit(4);
    res.json(products.length > 0 ? products : sampleProducts);
  } catch (error) {
    res.json(sampleProducts); // Fallback to sample data
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({}).limit(4);
    res.json(products.length > 0 ? products : sampleProducts);
  } catch (error) {
    res.json(sampleProducts); // Fallback to sample data
  }
});

// Get new arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
    res.json(products.length > 0 ? products : sampleProducts);
  } catch (error) {
    res.json(sampleProducts); // Fallback to sample data
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
