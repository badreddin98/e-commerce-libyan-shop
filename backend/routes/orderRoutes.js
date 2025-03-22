const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrderMetrics
} = require('../controllers/orderController');

// Public routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

// Admin routes
router.get('/', protect, admin, getOrders);
router.get('/metrics', protect, admin, getOrderMetrics);

// Order management routes
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;
