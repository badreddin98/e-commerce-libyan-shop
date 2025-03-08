const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  initiateBankTransfer,
  initiateMobileMoney,
  initiateCashOnDelivery,
  verifyPayment,
  handlePaymentWebhook
} = require('../controllers/paymentController');

// Protected routes (require authentication)
router.post('/bank-transfer', protect, initiateBankTransfer);
router.post('/mobile-money', protect, initiateMobileMoney);
router.post('/cash-on-delivery', protect, initiateCashOnDelivery);
router.get('/verify/:paymentId', protect, verifyPayment);

// Webhook endpoint for payment providers (no authentication required)
router.post('/webhook', handlePaymentWebhook);

module.exports = router;
