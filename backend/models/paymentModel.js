const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      required: true,
      enum: ['bank_transfer', 'mobile_money', 'cash_on_delivery']
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    reference: {
      type: String,
      required: true,
      unique: true
    },
    details: {
      // Bank transfer details
      bankName: String,
      accountNumber: String,
      accountName: String,
      
      // Mobile money details
      phoneNumber: String,
      provider: String,
      
      // Transaction details from payment provider
      transactionId: String,
      providerReference: String
    },
    metadata: {
      type: Map,
      of: String
    }
  },
  {
    timestamps: true
  }
);

// Index for faster lookups
paymentSchema.index({ reference: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
