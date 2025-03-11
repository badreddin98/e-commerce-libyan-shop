import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
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
  useTheme,
  CardActionArea,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ShareIcon from '@mui/icons-material/Share';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import PaymentModal from './PaymentModal';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  border: 'none',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: 'transparent',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    '& .quick-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '133.33%',
  position: 'relative',
  backgroundColor: theme.palette.grey[50],
  backgroundSize: 'cover',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: '#FF4E4E',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '16px',
  zIndex: 1,
  fontWeight: '600',
  fontSize: '0.75rem',
  letterSpacing: '0.5px',
  boxShadow: '0 2px 8px rgba(255, 78, 78, 0.3)',
}));

const QuickActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%) translateY(20px)',
  display: 'flex',
  gap: theme.spacing(1),
  opacity: 0,
  transition: 'all 0.3s ease-in-out',
  zIndex: 2,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: theme.spacing(1),
  borderRadius: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(4px)',
  '& .MuiIconButton-root': {
    backgroundColor: 'white',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      transform: 'scale(1.1)',
    },
  },
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  fontWeight: '600',
  color: '#FF4E4E',
  fontSize: '1.1rem',
  letterSpacing: '0.5px',
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
  fontSize: '0.9rem',
  opacity: 0.7,
}));

const ProductCard = ({ product }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = product.images[0];
    img.onload = () => {
      setImageLoaded(true);
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
    };
  }, [product.images]);

  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = async () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to add items to cart',
        severity: 'warning'
      });
      return;
    }

    if (hasOptions && (!selectedSize || !selectedColor)) {
      setOptionsDialogOpen(true);
      return;
    }

    try {
      await addToCart(
        product._id,
        1,
        selectedSize || 'default',
        selectedColor || 'default'
      );
      setSnackbar({
        open: true,
        message: 'Added to cart successfully',
        severity: 'success'
      });
      if (optionsDialogOpen) {
        setOptionsDialogOpen(false);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add to cart',
        severity: 'error'
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({
        open: true,
        message: 'Link copied to clipboard',
        severity: 'success'
      });
    }
  };


  const hasOptions = (product.size?.length > 0 || product.color?.length > 0);

  const handleConfirmAdd = async () => {
    if (hasOptions && (!selectedSize || !selectedColor)) {
      setSnackbar({
        open: true,
        message: 'Please select both size and color',
        severity: 'error'
      });
      return;
    }

    const result = await addToCart(product._id, 1, selectedSize, selectedColor);
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Added to cart successfully',
        severity: 'success'
      });
      setOptionsDialogOpen(false);
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'Failed to add to cart',
        severity: 'error'
      });
    }
  };

  const handleClose = () => {
    setOptionsDialogOpen(false);
    setSelectedSize('');
    setSelectedColor('');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleQuickBuy = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to make a purchase',
        severity: 'warning'
      });
      return;
    }
    setQuickBuyOpen(true);
  };

  const handleFavoriteClick = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to save items',
        severity: 'warning'
      });
      return;
    }
    setFavorite(!favorite);
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <>
      <StyledCard elevation={2}>
        {loading ? (
          <Skeleton variant="rectangular" height={200} animation="wave" />
        ) : (
          <>
            <CardActionArea onClick={() => navigate(`/product/${product._id}`)}>
              <Box sx={{ position: 'relative' }}>
                <StyledCardMedia
                  image={product.images[0]}
                  title={product.name}
                />
                {discount > 0 && (
                  <DiscountBadge>
                    -{discount}%
                  </DiscountBadge>
                )}
                <Fade in={imageLoaded}>
                  <QuickActions>
                    <Tooltip title={favorite ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'background.paper' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteClick();
                        }}
                      >
                        {favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'background.paper' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare();
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Compare">
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'background.paper' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CompareArrowsIcon />
                      </IconButton>
                    </Tooltip>
                  </QuickActions>
                </Fade>
              </Box>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                {hasOptions ? 'Select Options' : 'Add to Cart'}
              </Button>
            </Box>
          </>
        )}
      </StyledCard>

      {hasOptions && (
        <Dialog open={optionsDialogOpen} onClose={() => setOptionsDialogOpen(false)} maxWidth="xs" fullWidth>
          <Box sx={{ position: 'relative', p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Select Options
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ my: 2 }}>
              {product.size?.length > 0 && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={selectedSize}
                    label="Size"
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {product.size.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {product.color?.length > 0 && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Color</InputLabel>
                  <Select
                    value={selectedColor}
                    label="Color"
                    onChange={(e) => setSelectedColor(e.target.value)}
                  >
                    {product.color.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={() => setOptionsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddToCart} variant="contained" color="primary">
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}

      <PaymentModal
        open={quickBuyOpen}
        onClose={() => setQuickBuyOpen(false)}
        orderData={{
          products: [{ ...product, quantity: 1, size: selectedSize, color: selectedColor }],
          totalAmount: product.price,
        }}
        onPaymentComplete={(response) => {
          setSnackbar({
            open: true,
            message: 'Order placed successfully!',
            severity: 'success',
          });
          setQuickBuyOpen(false);
        }}
      />

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
