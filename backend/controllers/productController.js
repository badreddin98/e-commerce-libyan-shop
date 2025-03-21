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

// @desc    Search products with advanced filtering
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  try {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      size,
      rating,
      inStock,
      onSale,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter criteria
    const filter = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) filter.category = category;
    if (size) filter.size = size;
    if (inStock === 'true') filter.countInStock = { $gt: 0 };
    if (onSale === 'true') filter.originalPrice = { $gt: '$price' };
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // Build sort criteria
    let sortCriteria = {};
    switch (sort) {
      case 'price_asc':
        sortCriteria.price = 1;
        break;
      case 'price_desc':
        sortCriteria.price = -1;
        break;
      case 'rating':
        sortCriteria.rating = -1;
        break;
      case 'newest':
        sortCriteria.createdAt = -1;
        break;
      default:
        sortCriteria.createdAt = -1;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .sort(sortCriteria)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Error searching products'
    });
  }
});

// @desc    Get available filters
// @route   GET /api/products/filters
// @access  Public
const getFilters = asyncHandler(async (req, res) => {
  try {
    const [categories, sizes, priceRange] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('size'),
      Product.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      filters: {
        categories,
        sizes,
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 }
      }
    });
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({
      success: false,
      error: 'Error getting filters'
    });
  }
});

// @desc    Get personalized recommendations
// @route   GET /api/products/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  try {
    // Get user's purchase history and viewed products
    const userHistory = await Order.find({ user: req.user._id })
      .select('orderItems')
      .populate('orderItems.product');

    // Extract categories and preferences
    const userPreferences = analyzeUserPreferences(userHistory);

    // Find products matching user preferences
    const recommendations = await Product.aggregate([
      {
        $match: {
          category: { $in: userPreferences.categories },
          price: { $gte: userPreferences.minPrice, $lte: userPreferences.maxPrice }
        }
      },
      { $sample: { size: 10 } }
    ]);

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Error getting recommendations'
    });
  }
});

// @desc    Get similar products
// @route   GET /api/products/similar/:productId
// @access  Public
const getSimilarProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Find similar products based on category and price range
    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      price: {
        $gte: product.price * 0.7,
        $lte: product.price * 1.3
      }
    }).limit(6);

    res.json({
      success: true,
      products: similarProducts
    });
  } catch (error) {
    console.error('Similar products error:', error);
    res.status(500).json({
      success: false,
      error: 'Error getting similar products'
    });
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  searchProducts,
  getFilters,
  getRecommendations,
  getSimilarProducts,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getProductsByCategory,
  searchProducts,
  getRelatedProducts,
};
