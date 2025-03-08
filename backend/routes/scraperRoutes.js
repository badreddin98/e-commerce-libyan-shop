const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  scrapeAndSaveProduct,
  previewScrapedProduct,
  scrapeCategory,
  previewCategory,
  bulkScrapeCategory,
  previewBulkScrape
} = require('../controllers/scraperController');

router.post('/product', protect, admin, scrapeAndSaveProduct);
router.post('/preview', protect, admin, previewScrapedProduct);
router.post('/category', protect, admin, scrapeCategory);
router.post('/category/preview', protect, admin, previewCategory);
router.post('/bulk', protect, admin, bulkScrapeCategory);
router.post('/bulk/preview', protect, admin, previewBulkScrape);

module.exports = router;
