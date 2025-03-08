const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');

// Helper function to generate a unique payment reference
const generatePaymentRef = () => {
  return 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

exports.initiateBankTransfer = async (req, res) => {
  try {
    const { orderData, bankDetails } = req.body;
    
    // Create a new payment record
    const payment = await Payment.create({
      paymentMethod: 'bank_transfer',
      amount: orderData.totalAmount,
      status: 'pending',
      reference: generatePaymentRef(),
      details: {
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        accountName: bankDetails.accountName
      }
    });

    // Create the order with pending payment
    const order = await Order.create({
      user: req.user._id,
      products: orderData.products,
      totalAmount: orderData.totalAmount,
      paymentId: payment._id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        paymentId: payment._id,
        paymentReference: payment.reference,
        bankDetails: {
          bankName: process.env.BANK_NAME || 'Libya Bank',
          accountNumber: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
          accountName: process.env.BANK_ACCOUNT_NAME || 'Libyan Shop'
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.initiateMobileMoney = async (req, res) => {
  try {
    const { orderData, mobileMoneyDetails } = req.body;
    
    // Create a new payment record
    const payment = await Payment.create({
      paymentMethod: 'mobile_money',
      amount: orderData.totalAmount,
      status: 'pending',
      reference: generatePaymentRef(),
      details: {
        phoneNumber: mobileMoneyDetails.phoneNumber,
        provider: mobileMoneyDetails.provider
      }
    });

    // Create the order with pending payment
    const order = await Order.create({
      user: req.user._id,
      products: orderData.products,
      totalAmount: orderData.totalAmount,
      paymentId: payment._id,
      status: 'pending'
    });

    // In a real implementation, you would integrate with the mobile money provider's API here
    // For now, we'll just return the payment details
    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        paymentId: payment._id,
        paymentReference: payment.reference,
        instructions: 'You will receive a prompt on your mobile phone to complete the payment.'
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.initiateCashOnDelivery = async (req, res) => {
  try {
    const { orderData } = req.body;
    
    // Create a new payment record
    const payment = await Payment.create({
      paymentMethod: 'cash_on_delivery',
      amount: orderData.totalAmount,
      status: 'pending',
      reference: generatePaymentRef()
    });

    // Create the order with pending payment
    const order = await Order.create({
      user: req.user._id,
      products: orderData.products,
      totalAmount: orderData.totalAmount,
      paymentId: payment._id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        paymentId: payment._id,
        paymentReference: payment.reference,
        instructions: 'Please have the exact amount ready when your order is delivered.'
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // In a real implementation, you would verify the payment status with the payment provider
    // For now, we'll just return the current status
    res.status(200).json({
      success: true,
      data: {
        status: payment.status,
        reference: payment.reference,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Webhook for payment status updates (to be integrated with payment providers)
exports.handlePaymentWebhook = async (req, res) => {
  try {
    const { paymentReference, status } = req.body;

    const payment = await Payment.findOne({ reference: paymentReference });
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Update payment status
    payment.status = status;
    await payment.save();

    // If payment is successful, update order status
    if (status === 'completed') {
      await Order.findOneAndUpdate(
        { paymentId: payment._id },
        { status: 'processing' }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
