import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  CardActionArea,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '133.33%', // 4:3 aspect ratio
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
  backgroundSize: 'cover',
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
}));

const ProductCard = ({ product }) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to add items to cart',
        severity: 'warning'
      });
      return;
    }
    setOpen(true);
  };

  const handleConfirmAdd = async () => {
    if (!size || !color) {
      setSnackbar({
        open: true,
        message: 'Please select both size and color',
        severity: 'error'
      });
      return;
    }

    const result = await addToCart(product._id, 1, size, color);
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Added to cart successfully',
        severity: 'success'
      });
      setOpen(false);
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'Failed to add to cart',
        severity: 'error'
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSize('');
    setColor('');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  return (
    <>
    <StyledCard>
      <CardActionArea>
        <StyledCardMedia
          image={product.images[0]}
          title={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {product.name}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Rating value={product.rating || 0} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({product.numReviews || 0})
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <PriceTypography variant="h6">
              ${(product.price || 0).toFixed(2)}
            </PriceTypography>
            {product.originalPrice && product.originalPrice > product.price && (
              <OriginalPrice variant="body1">
                ${(product.originalPrice || 0).toFixed(2)}
              </OriginalPrice>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
          fullWidth
        >
          Add to Cart
        </Button>
      </Box>
    </StyledCard>

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select Options</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Size</InputLabel>
          <Select
            value={size}
            label="Size"
            onChange={(e) => setSize(e.target.value)}
          >
            {(product.size || []).map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Color</InputLabel>
          <Select
            value={color}
            label="Color"
            onChange={(e) => setColor(e.target.value)}
          >
            {(product.color || []).map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirmAdd} variant="contained" color="primary">
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>
  );
};

export default ProductCard;
