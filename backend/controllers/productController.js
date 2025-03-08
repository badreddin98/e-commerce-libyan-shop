const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  console.log('Getting products...');
  try {
    // Add timeout to the query
    const products = await Product.find({}).limit(10).maxTimeMS(5000);
    
    // Check if products is null or undefined
    if (!products) {
      console.log('No products found');
      return res.json({
        success: true,
        products: []
      });
    }
    
    console.log('Products found:', products.length);
    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Check for specific MongoDB errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({
        success: false,
        error: 'Database connection error. Please try again.'
      });
    }

    // Handle timeout error
    if (error.message && error.message.includes('timeout')) {
      return res.status(504).json({
        success: false,
        error: 'Request timed out. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    images,
    category,
    size,
    color,
    price,
    originalPrice,
    countInStock,
    sheinProductId,
  } = req.body;

  const product = new Product({
    name,
    description,
    images,
    category,
    size,
    color,
    price,
    originalPrice,
    countInStock,
    sheinProductId,
    user: 'admin', // Temporary default user
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    images,
    category,
    size,
    color,
    price,
    originalPrice,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.images = images || product.images;
    product.category = category || product.category;
    product.size = size || product.size;
    product.color = color || product.color;
    product.price = price || product.price;
    product.originalPrice = originalPrice || product.originalPrice;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    })
      .limit(4);
    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getProductsByCategory,
  searchProducts,
  getRelatedProducts,
};
