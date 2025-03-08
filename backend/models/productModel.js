const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
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
      enum: ['women', 'men', 'accessories', 'shoes'],
    },
    subcategory: {
      type: String,
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    thumbnails: [{
      type: String,
    }],
    size: [{
      type: String,
      required: true,
    }],
    shortDescription: {
      type: String,
      required: true,
      maxLength: 200,
    },
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
    variants: [{
      size: String,
      color: String,
      price: Number,
      countInStock: Number,
      sku: String,
    }],
    specifications: {
      type: Map,
      of: String,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    tags: [{
      type: String,
    }],
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
