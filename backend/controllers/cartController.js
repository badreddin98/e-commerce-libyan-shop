const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find user's cart or create new one
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0
      });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += quantity;
    } else {
      // Add new item if it doesn't exist
      cart.items.push({
        product: productId,
        quantity,
        size,
        color
      });
    }

    // Calculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.quantity * product.price);
    }, 0);

    // Save cart
    await cart.save();

    // Populate product details
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      return res.status(200).json({
        items: [],
        totalPrice: 0
      });
    }

    // Remove any items where the product no longer exists
    cart.items = cart.items.filter(item => item.product);

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.quantity * (item.product ? item.product.price : 0));
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      message: 'Failed to get cart', 
      error: error.message 
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity > 0) {
      item.quantity = quantity;
    } else {
      // Remove item if quantity is 0
      cart.items = cart.items.filter(
        item => !(item.product.toString() === productId && item.size === size && item.color === color)
      );
    }

    // Recalculate total price
    const product = await Product.findById(productId);
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.quantity * product.price);
    }, 0);

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item
    cart.items = cart.items.filter(
      item => !(item.product.toString() === productId && item.size === size && item.color === color)
    );

    // Recalculate total price
    const product = await Product.findById(productId);
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (item.quantity * product.price);
    }, 0);

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart
};
