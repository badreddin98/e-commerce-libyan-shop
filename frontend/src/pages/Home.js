import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroBanner = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
}));

const Home = () => {
  // Placeholder data - this would come from your API
  const featuredProducts = [
    {
      id: 1,
      name: 'Summer Floral Dress',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3',
    },
    {
      id: 2,
      name: 'Elegant Blouse',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-4.0.3',
    },
    {
      id: 3,
      name: 'Designer Jeans',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3',
    },
    {
      id: 4,
      name: 'Evening Gown',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3',
    },
  ];

  return (
    <Box sx={{ pt: 8 }}>
      <HeroBanner>
        <Box>
          <Typography variant="h2" component="h1" gutterBottom>
            Latest Fashion Trends
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Discover our new collection
          </Typography>
          <Button variant="contained" color="secondary" size="large">
            Shop Now
          </Button>
        </Box>
      </HeroBanner>

      <Container>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Featured Products
        </Typography>

        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="secondary">
                    ${product.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quality Products
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Carefully curated selection of fashion items
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Fast Shipping
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quick delivery to your doorstep
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                24/7 Support
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Always here to help you
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
