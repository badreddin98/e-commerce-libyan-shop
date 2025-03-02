const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../models/productModel');

const scrapeProduct = async (url) => {
  try {
    // Add headers to mimic a browser request
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const product = {};

    // Generic selectors - you may need to adjust these based on the website
    product.name = $('h1').first().text().trim();
    product.description = $('meta[name="description"]').attr('content') || '';
    
    // Try different price selectors
    const priceSelectors = [
      '.price',
      '[data-price]',
      '[itemprop="price"]',
      '.product-price',
      'meta[property="product:price:amount"]'
    ];

    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        product.price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        break;
      }
    }

    // Try to find images
    product.images = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && src.includes('http')) {
        product.images.push(src);
      }
    });

    // Try to find available sizes
    product.sizes = new Set();
    $('select option, [data-size]').each((i, el) => {
      const size = $(el).text().trim() || $(el).attr('data-size');
      if (size && !size.includes('Select')) {
        product.sizes.add(size);
      }
    });
    product.sizes = Array.from(product.sizes);

    // Try to find available colors
    product.colors = new Set();
    $('[data-color], .color-option').each((i, el) => {
      const color = $(el).attr('data-color') || $(el).text().trim();
      if (color) {
        product.colors.add(color);
      }
    });
    product.colors = Array.from(product.colors);

    // Set default values if not found
    product.price = product.price || 0;
    product.images = product.images.length ? product.images : ['https://via.placeholder.com/300'];
    product.sizes = product.sizes.length ? product.sizes : ['S', 'M', 'L', 'XL'];
    product.colors = product.colors.length ? product.colors : ['Black', 'White'];
    product.brand = product.brand || 'Unknown';
    product.category = product.category || 'Other';
    product.countInStock = 100;
    product.rating = 0;
    product.numReviews = 0;

    return product;
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('Failed to scrape product');
  }
};

module.exports = { scrapeProduct };
