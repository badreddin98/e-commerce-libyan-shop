import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  IconButton,
  TextField,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const cartItems = cart.items || [];

  const handleQuantityChange = async (productId, quantity, size, color) => {
    if (quantity < 1) return;
    await updateCartItem(productId, quantity, size, color);
  };

  const handleRemoveItem = async (productId, size, color) => {
    await removeFromCart(productId, size, color);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const shipping = 4.99;
  const subtotal = calculateSubtotal();
  const total = subtotal + shipping;

  return (
    <Container sx={{ pt: 12, pb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            component={RouterLink}
            to="/products"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              cartItems.map((item) => (
                <Card key={`${item.product._id}-${item.size}-${item.color}`} sx={{ mb: 2, p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={item.product.images[0]}
                        alt={item.product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {item.product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Size: {item.size}
                          </Typography>
                          {item.color && (
                            <Typography variant="body2" color="text.secondary">
                              Color: {item.color}
                            </Typography>
                          )}
                          <Typography variant="h6" color="secondary">
                            ${item.product.price}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1, item.size, item.color)}
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.product._id, value, item.size, item.color);
                            }}
                            inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            sx={{ width: '60px', mx: 1 }}
                          />
                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1, item.size, item.color)}
                          >
                            <Add />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            sx={{ ml: 2 }}
                            onClick={() => handleRemoveItem(item.product._id, item.size, item.color)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ))
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>${shipping.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${total.toFixed(2)}</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;
