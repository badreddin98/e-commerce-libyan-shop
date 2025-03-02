const { scrapeProduct } = require('../utils/scraper');
const Product = require('../models/productModel');

// @desc    Scrape and save product from URL
// @route   POST /api/scraper/product
// @access  Private/Admin
const scrapeAndSaveProduct = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Scrape the product
    const scrapedProduct = await scrapeProduct(url);

    // Create the product in database
    const product = await Product.create(scrapedProduct);

    res.status(201).json(product);
  } catch (error) {
    console.error('Scraper controller error:', error);
    res.status(500).json({ 
      message: 'Failed to scrape and save product',
      error: error.message 
    });
  }
};

// @desc    Scrape product details only (without saving)
// @route   POST /api/scraper/preview
// @access  Private/Admin
const previewScrapedProduct = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Scrape the product
    const scrapedProduct = await scrapeProduct(url);

    res.status(200).json(scrapedProduct);
  } catch (error) {
    console.error('Scraper preview error:', error);
    res.status(500).json({ 
      message: 'Failed to scrape product',
      error: error.message 
    });
  }
};

module.exports = {
  scrapeAndSaveProduct,
  previewScrapedProduct
};
