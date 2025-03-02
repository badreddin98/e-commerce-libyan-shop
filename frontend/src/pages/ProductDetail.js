import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Rating,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Tabs,
  Tab,
  Paper,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { AddShoppingCart, Favorite, Share } from '@mui/icons-material';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  // Placeholder data - this would come from your API
  const product = {
    id,
    name: 'Floral Summer Dress',
    price: 29.99,
    originalPrice: 39.99,
    description: 'A beautiful floral summer dress perfect for any occasion.',
    images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red'],
    rating: 4.5,
    numReviews: 125,
    countInStock: 50,
  };

  const handleSizeChange = (event, newSize) => {
    setSelectedSize(newSize);
  };

  const handleQuantityChange = (event) => {
    setQuantity(Math.max(1, Math.min(product.countInStock, Number(event.target.value))));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container sx={{ pt: 12, pb: 6 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <ImageList cols={2} rowHeight={400} gap={8}>
            {product.images.map((image, index) => (
              <ImageListItem key={index}>
                <img
                  src={image}
                  alt={`Product view ${index + 1}`}
                  loading="lazy"
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.numReviews} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" color="secondary" sx={{ mr: 2 }}>
                ${product.price}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${product.originalPrice}
              </Typography>
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              Size
            </Typography>
            <ToggleButtonGroup
              value={selectedSize}
              exclusive
              onChange={handleSizeChange}
              sx={{ mb: 3 }}
            >
              {product.sizes.map((size) => (
                <ToggleButton key={size} value={size}>
                  {size}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: product.countInStock }}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCart />}
                fullWidth
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Favorite />}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Share />}
              >
                Share
              </Button>
            </Box>

            <Paper sx={{ mt: 4 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Details" />
                <Tab label="Size Guide" />
                <Tab label="Reviews" />
              </Tabs>
              <Box sx={{ p: 3 }}>
                {activeTab === 0 && (
                  <Typography>
                    Product details and care instructions...
                  </Typography>
                )}
                {activeTab === 1 && (
                  <Typography>
                    Size guide and measurement information...
                  </Typography>
                )}
                {activeTab === 2 && (
                  <Typography>
                    Customer reviews and ratings...
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
