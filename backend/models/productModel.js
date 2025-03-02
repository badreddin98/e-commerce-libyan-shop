const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    category: {
      type: String,
      required: true,
    },
    size: [{
      type: String,
      required: true,
    }],
    color: [{
      type: String,
      required: true,
    }],
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    originalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    sheinProductId: {
      type: String,
      required: true,
      unique: true,
    },
    sheinUrl: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
