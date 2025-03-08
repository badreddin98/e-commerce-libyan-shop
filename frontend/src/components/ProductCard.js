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
  Fade,
  useTheme,
  styled
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  CompareArrows
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const DiscountBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  fontWeight: 'bold',
}));

const QuickActionButtons = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  opacity: 0,
  transform: 'translateX(-10px)',
  transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
  '$:hover': {
    opacity: 1,
    transform: 'translateX(0)',
  },
}));, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: theme.palette.error.main,
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  zIndex: 1,
  fontWeight: 'bold',
}));

const QuickActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  zIndex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

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

  const hasOptions = product.size?.length > 0 || product.color?.length > 0;
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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [quickBuyOpen, setQuickBuyOpen] = useState(false);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { addToCart } = useCart();
  const { user } = useAuth();

  const hasOptions = (product.size?.length > 0 || product.color?.length > 0);

  const handleDirectAddToCart = async () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to add items to cart',
        severity: 'warning'
      });
      return;
    }

    const result = await addToCart(product._id, 1, 'default', 'default');
    if (result.success) {
      setSnackbar({
        open: true,
        message: 'Added to cart successfully',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'Failed to add to cart',
        severity: 'error'
      });
    }
  };

  const handleAddToCart = async () => {
    if (!hasOptions) {
      handleDirectAddToCart();
      return;
    }

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
    if (hasOptions && (!size || !color)) {
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
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.images[0]}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
        
        {discount > 0 && (
          <DiscountBadge
            label={`-${discount}%`}
            color="error"
          />
        )}

        <Fade in={imageLoaded}>
          <QuickActionButtons>
            <Tooltip title={favorite ? 'Remove from Wishlist' : 'Add to Wishlist'}>
              <IconButton
                size="small"
                sx={{ bgcolor: 'background.paper' }}
                onClick={() => setFavorite(!favorite)}
              >
                {favorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Share">
              <IconButton
                size="small"
                sx={{ bgcolor: 'background.paper' }}
                onClick={handleShare}
              >
                <Share />
              </IconButton>
            </Tooltip>

            <Tooltip title="Compare">
              <IconButton
                size="small"
                sx={{ bgcolor: 'background.paper' }}
              >
                <CompareArrows />
              </IconButton>
            </Tooltip>
          </QuickActionButtons>
        </Fade>
      </Box>
    )}
      {product.originalPrice && product.originalPrice > product.price && (
        <DiscountBadge>
          -{calculateDiscount()}%
        </DiscountBadge>
      )}
      <CardActionArea>
        <Box sx={{ position: 'relative' }}>
          <StyledCardMedia
            image={product.images[0]}
            title={product.name}
          />
          <QuickActions sx={{ opacity: { xs: 1, sm: 0 }, '&:hover': { opacity: 1 } }}>
            <IconButton
              size="small"
              onClick={handleAddToCart}
              sx={{ bgcolor: 'background.paper' }}
            >
              <AddShoppingCartIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleFavoriteClick}
              sx={{ bgcolor: 'background.paper' }}
            >
              {favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton
              size="small"
              onClick={handleQuickBuy}
              sx={{ bgcolor: 'background.paper' }}
            >
              <PaymentIcon />
            </IconButton>
          </QuickActions>
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

    <Box sx={{ p: 2, pt: 0 }}>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<ShoppingCart />}
        onClick={handleAddToCart}
      >
        {hasOptions ? 'Select Options' : 'Add to Cart'}
      </Button>
    </Box>
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

    {hasOptions && (
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
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
              value={size}
              label="Size"
              onChange={(e) => setSize(e.target.value)}
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
              value={color}
              label="Color"
              onChange={(e) => setColor(e.target.value)}
            >
              {product.color.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirmAdd} variant="contained" color="primary">
          Add to Cart
        </Button>
        </Box>
        </Box>
      </Dialog>

    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    )}

    <PaymentModal
      open={quickBuyOpen}
      onClose={() => setQuickBuyOpen(false)}
      orderData={{
        products: [{ ...product, quantity: 1, size, color }],
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
