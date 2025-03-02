const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  scrapeAndSaveProduct,
  previewScrapedProduct
} = require('../controllers/scraperController');

router.post('/product', protect, admin, scrapeAndSaveProduct);
router.post('/preview', protect, admin, previewScrapedProduct);

module.exports = router;
