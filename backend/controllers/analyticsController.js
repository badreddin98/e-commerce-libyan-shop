const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Get dashboard metrics
// @route   GET /api/analytics/dashboard/:period
// @access  Private/Admin
const getDashboardMetrics = asyncHandler(async (req, res) => {
    const { period } = req.params;
    const startDate = getPeriodStartDate(period);
    const endDate = new Date();

    // Get orders for the period
    const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate sales metrics
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get top products
    const topProducts = await getTopProducts(startDate, endDate);

    // Get user metrics
    const userMetrics = await getUserMetrics(startDate, endDate);

    // Calculate revenue by category
    const revenueByCategory = await getRevenueByCategory(startDate, endDate);

    res.json({
        period,
        metrics: {
            revenue: totalRevenue,
            orders: totalOrders,
            averageOrderValue,
            topProducts: topProducts.slice(0, 5),
            activeUsers: userMetrics.activeUsers,
            newCustomers: userMetrics.newCustomers,
            revenueByCategory
        }
    });
});

// @desc    Get product performance metrics
// @route   GET /api/analytics/products/performance
// @access  Private/Admin
const getProductPerformance = asyncHandler(async (req, res) => {
    const { period } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const startDate = getPeriodStartDate(period);
    const endDate = new Date();

    const productMetrics = await getTopProducts(startDate, endDate);
    
    res.json(productMetrics.slice(0, limit));
});

// @desc    Get sales report
// @route   GET /api/analytics/sales/report
// @access  Private/Admin
const getSalesReport = asyncHandler(async (req, res) => {
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);

    // Get orders for the period
    const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: -1 });

    // Calculate metrics
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue by category
    const revenueByCategory = await getRevenueByCategory(startDate, endDate);

    // Daily revenue trend
    const dailyRevenue = await getDailyRevenue(startDate, endDate);

    res.json({
        startDate,
        endDate,
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueByCategory,
        dailyRevenue
    });
});

// Helper Functions

const getPeriodStartDate = (period) => {
    const now = new Date();
    switch (period.toUpperCase()) {
        case 'DAILY':
            return new Date(now.setDate(now.getDate() - 1));
        case 'WEEKLY':
            return new Date(now.setDate(now.getDate() - 7));
        case 'MONTHLY':
            return new Date(now.setMonth(now.getMonth() - 1));
        default:
            return new Date(now.setDate(now.getDate() - 1)); // Default to daily
    }
};

const getTopProducts = async (startDate, endDate) => {
    const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
    });

    // Create a map to store product metrics
    const productMetrics = new Map();

    // Calculate metrics for each product
    for (const order of orders) {
        for (const item of order.items) {
            const metrics = productMetrics.get(item.productId) || {
                productId: item.productId,
                productName: item.productName,
                revenue: 0,
                purchases: 0,
                quantity: 0
            };

            metrics.revenue += item.price * item.quantity;
            metrics.purchases += 1;
            metrics.quantity += item.quantity;
            productMetrics.set(item.productId, metrics);
        }
    }

    // Convert map to array and sort by revenue
    return Array.from(productMetrics.values())
        .sort((a, b) => b.revenue - a.revenue);
};

const getUserMetrics = async (startDate, endDate) => {
    const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
    });

    // Get unique users who made orders
    const activeUsers = new Set(orders.map(order => order.userId)).size;

    // Get new customers (users who made their first order in this period)
    const allPreviousUsers = await Order.distinct('userId', {
        createdAt: { $lt: startDate }
    });
    const currentUsers = new Set(orders.map(order => order.userId));
    const newCustomers = Array.from(currentUsers)
        .filter(userId => !allPreviousUsers.includes(userId)).length;

    return { activeUsers, newCustomers };
};

const getRevenueByCategory = async (startDate, endDate) => {
    const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
    });

    const revenueByCategory = {};

    for (const order of orders) {
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                const category = product.category || 'Uncategorized';
                revenueByCategory[category] = (revenueByCategory[category] || 0) + 
                    (item.price * item.quantity);
            }
        }
    }

    return revenueByCategory;
};

const getDailyRevenue = async (startDate, endDate) => {
    const orders = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    const dailyRevenue = {};

    orders.forEach(order => {
        const date = order.createdAt.toISOString().split('T')[0];
        dailyRevenue[date] = (dailyRevenue[date] || 0) + order.totalAmount;
    });

    return dailyRevenue;
};

module.exports = {
    getDashboardMetrics,
    getProductPerformance,
    getSalesReport
};
