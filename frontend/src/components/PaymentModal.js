import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { paymentService } from '../services/paymentService';

const PaymentModal = ({ open, onClose, orderData, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    accountName: '',
    bankName: '',
  });
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState({
    phoneNumber: '',
    provider: '',
  });

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setError(null);
  };

  const handleBankDetailsChange = (field) => (event) => {
    setBankDetails({ ...bankDetails, [field]: event.target.value });
  };

  const handleMobileMoneyDetailsChange = (field) => (event) => {
    setMobileMoneyDetails({ ...mobileMoneyDetails, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const paymentData = {
        ...orderData,
        paymentMethod,
      };

      switch (paymentMethod) {
        case 'bank':
          response = await paymentService.initiateBankTransfer({
            ...paymentData,
            bankDetails,
          });
          break;
        case 'mobile':
          response = await paymentService.initiateMobileMoney({
            ...paymentData,
            mobileMoneyDetails,
          });
          break;
        case 'cash':
          response = await paymentService.initiateCashOnDelivery(paymentData);
          break;
        default:
          throw new Error('Invalid payment method');
      }

      onPaymentComplete(response);
      onClose();
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          Select Payment Method
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              value="bank"
              control={<Radio />}
              label="Bank Transfer"
            />
            {paymentMethod === 'bank' && (
              <Box sx={{ ml: 4, mt: 1 }}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  variant="outlined"
                  size="small"
                  value={bankDetails.bankName}
                  onChange={handleBankDetailsChange('bankName')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Account Number"
                  variant="outlined"
                  size="small"
                  value={bankDetails.accountNumber}
                  onChange={handleBankDetailsChange('accountNumber')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Account Name"
                  variant="outlined"
                  size="small"
                  value={bankDetails.accountName}
                  onChange={handleBankDetailsChange('accountName')}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              value="mobile"
              control={<Radio />}
              label="Mobile Money"
            />
            {paymentMethod === 'mobile' && (
              <Box sx={{ ml: 4, mt: 1 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  size="small"
                  value={mobileMoneyDetails.phoneNumber}
                  onChange={handleMobileMoneyDetailsChange('phoneNumber')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Provider"
                  variant="outlined"
                  size="small"
                  value={mobileMoneyDetails.provider}
                  onChange={handleMobileMoneyDetailsChange('provider')}
                />
              </Box>
            )}
          </Box>

          <FormControlLabel
            value="cash"
            control={<Radio />}
            label="Cash on Delivery"
          />
        </RadioGroup>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {paymentMethod === 'bank' && (
            'Please complete the bank transfer within 24 hours to confirm your order.'
          )}
          {paymentMethod === 'mobile' && (
            'You will receive a prompt on your phone to complete the payment.'
          )}
          {paymentMethod === 'cash' && (
            'Pay in cash when your order is delivered.'
          )}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Proceed to Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
