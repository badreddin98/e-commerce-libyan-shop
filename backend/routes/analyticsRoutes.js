const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
    getDashboardMetrics,
    getProductPerformance,
    getSalesReport
} = require('../controllers/analyticsController');

// All routes are protected and require admin access
router.use(protect, admin);

// @desc    Get dashboard metrics
// @route   GET /api/analytics/dashboard/:period
// @access  Private/Admin
router.get('/dashboard/:period', getDashboardMetrics);

// @desc    Get product performance metrics
// @route   GET /api/analytics/products/performance
// @access  Private/Admin
router.get('/products/performance', getProductPerformance);

// @desc    Get sales report
// @route   GET /api/analytics/sales/report
// @access  Private/Admin
router.get('/sales/report', getSalesReport);

module.exports = router;
