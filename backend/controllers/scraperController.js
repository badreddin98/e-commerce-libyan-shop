const { scrapeProduct, scrapeSheinCategory, bulkScrapeSheinCategory } = require('../utils/scraper');
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

// @desc    Scrape and save multiple products from a category URL
// @route   POST /api/scraper/category
// @access  Private/Admin
const scrapeCategory = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Scrape the products
    const products = await scrapeSheinCategory(url);

    // Save all products to database
    const savedProducts = await Product.insertMany(products);

    res.status(201).json({
      message: `Successfully scraped and saved ${savedProducts.length} products`,
      products: savedProducts
    });
  } catch (error) {
    console.error('Category scraper error:', error);
    res.status(500).json({ 
      message: 'Failed to scrape category',
      error: error.message 
    });
  }
};

// @desc    Preview products from a category without saving
// @route   POST /api/scraper/category/preview
// @access  Private/Admin
const previewCategory = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Scrape the products
    const products = await scrapeSheinCategory(url);

    res.status(200).json({
      message: `Successfully scraped ${products.length} products`,
      products
    });
  } catch (error) {
    console.error('Category preview error:', error);
    res.status(500).json({ 
      message: 'Failed to scrape category',
      error: error.message 
    });
  }
};

// @desc    Bulk scrape products from Shein category using API
// @route   POST /api/scraper/bulk
// @access  Private/Admin
const bulkScrapeCategory = async (req, res) => {
  try {
    const { categoryId, maxPages = 100, startPage = 1 } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    // Start the scraping process
    const products = await bulkScrapeSheinCategory(categoryId, {
      maxPages: parseInt(maxPages),
      startPage: parseInt(startPage)
    });

    // Save products in batches of 100
    const batchSize = 100;
    const savedProducts = [];
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const saved = await Product.insertMany(batch, { ordered: false });
      savedProducts.push(...saved);
      console.log(`Saved batch ${i/batchSize + 1} of ${Math.ceil(products.length/batchSize)}`);
    }

    res.status(201).json({
      message: `Successfully scraped and saved ${savedProducts.length} products`,
      totalScraped: products.length,
      totalSaved: savedProducts.length
    });
  } catch (error) {
    console.error('Bulk scraper error:', error);
    res.status(500).json({ 
      message: 'Failed to bulk scrape category',
      error: error.message 
    });
  }
};

// @desc    Preview bulk scrape results without saving
// @route   POST /api/scraper/bulk/preview
// @access  Private/Admin
const previewBulkScrape = async (req, res) => {
  try {
    const { categoryId, maxPages = 1 } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    // Only scrape one page for preview
    const products = await bulkScrapeSheinCategory(categoryId, {
      maxPages: parseInt(maxPages)
    });

    res.status(200).json({
      message: `Successfully scraped ${products.length} products`,
      totalProducts: products.length,
      products: products.slice(0, 5), // Only send first 5 products as preview
      categories: [...new Set(products.map(p => p.category))]
    });
  } catch (error) {
    console.error('Bulk preview error:', error);
    res.status(500).json({ 
      message: 'Failed to preview bulk scrape',
      error: error.message 
    });
  }
};

module.exports = {
  scrapeAndSaveProduct,
  previewScrapedProduct,
  scrapeCategory,
  previewCategory,
  bulkScrapeCategory,
  previewBulkScrape
};
