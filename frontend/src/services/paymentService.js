import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const paymentService = {
  // Initialize payment with bank transfer
  initiateBankTransfer: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/bank-transfer`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Initialize mobile money payment
  initiateMobileMoney: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/mobile-money`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Initialize cash on delivery
  initiateCashOnDelivery: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/cash-on-delivery`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify payment status
  verifyPayment: async (paymentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/verify/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default paymentService;
