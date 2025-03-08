import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Skeleton,
  useTheme,
  styled,
  Paper,
  Divider,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  LocalShipping,
  Security,
  CreditCard,
  Support,
  ArrowForward,
  TrendingUp,
  Star,
  NewReleases
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion'; from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Favorite, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';



const BannerSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '600px',
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
}));

const BannerImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const BannerContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  color: 'white',
  zIndex: 1,
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(15, 0),
  marginBottom: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: '50%',
    background: 'url(/hero-pattern.svg) repeat',
    opacity: 0.1,
  }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  }
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = [
    { title: 'Women', image: 'https://img.ltwebstatic.com/images3_pi/2023/11/20/1700468611d61c0cafcd50b0ec7602961cab46d468_thumbnail_900x.webp' },
    { title: 'Men', image: 'https://img.ltwebstatic.com/images3_pi/2023/11/21/17005511432f2d6f4b8f0def6ce0b9c6f2dd658f6d_thumbnail_900x.webp' },
    { title: 'Kids', image: 'https://img.ltwebstatic.com/images3_pi/2023/11/21/1700551143e5a6c5fd7e5926dd0978c6fe3026019f_thumbnail_900x.webp' },
    { title: 'Beauty', image: 'https://img.ltwebstatic.com/images3_pi/2023/11/21/17005511432f2d6f4b8f0def6ce0b9c6f2dd658f6d_thumbnail_900x.webp' },
  ];

  const featuredProducts = [
    {
      id: 1,
      title: 'Floral Summer Dress',
      price: 29.99,
      image: 'https://img.ltwebstatic.com/images3_pi/2023/11/20/1700468611d61c0cafcd50b0ec7602961cab46d468_thumbnail_900x.webp',
      discount: 20,
    },
    {
      id: 2,
      title: 'Denim Jacket',
      price: 49.99,
      image: 'https://img.ltwebstatic.com/images3_pi/2023/11/21/17005511432f2d6f4b8f0def6ce0b9c6f2dd658f6d_thumbnail_900x.webp',
      discount: 15,
    },
    // Add more products as needed
  ];


    const features = [
    { icon: <LocalShipping fontSize="large" />, title: 'Free Shipping', description: 'On orders over $50' },
    { icon: <Security fontSize="large" />, title: 'Secure Payments', description: 'Protected by SSL' },
    { icon: <CreditCard fontSize="large" />, title: 'Easy Returns', description: '30-day return policy' },
    { icon: <Support fontSize="large" />, title: '24/7 Support', description: 'Live chat support' },
  ];

  const categories = [
    { name: 'Women\'s Fashion', image: '/categories/women.jpg', link: '/category/women' },
    { name: 'Men\'s Fashion', image: '/categories/men.jpg', link: '/category/men' },
    { name: 'Accessories', image: '/categories/accessories.jpg', link: '/category/accessories' },
    { name: 'Shoes', image: '/categories/shoes.jpg', link: '/category/shoes' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products
        const featuredResponse = await fetch('/api/products/featured');
        const featuredData = await featuredResponse.json();
        setFeaturedProducts(featuredData);

        // Fetch trending products
        const trendingResponse = await fetch('/api/products/trending');
        const trendingData = await trendingResponse.json();
        setTrendingProducts(trendingData);

        // Fetch new arrivals
        const newArrivalsResponse = await fetch('/api/products/new-arrivals');
        const newArrivalsData = await newArrivalsResponse.json();
        setNewArrivals(newArrivalsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
  };

  return (
    <Box>
      {/* Hero Banner */}
      <BannerSection>
        <BannerImage
          src="https://img.ltwebstatic.com/images3_pi/2023/11/20/1700468611d61c0cafcd50b0ec7602961cab46d468_thumbnail_900x.webp"
          alt="Hero Banner"
        />
        <BannerContent>
          <Typography variant="h2" component="h1" gutterBottom>
            Spring Collection 2024
          </Typography>
          <Typography variant="h5" gutterBottom>
            Up to 70% Off
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2, bgcolor: 'white', color: 'black' }}
            onClick={() => navigate('/products')}
          >
            Shop Now
          </Button>
        </BannerContent>
      </BannerSection>

      {/* Categories Section */}
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Shop by Category
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.title}>
              <CategoryCard>
                <CardMedia
                  component="img"
                  height="300"
                  image={category.image}
                  alt={category.title}
                />
                <CardContent>
                  <Typography variant="h6" align="center">
                    {category.title}
                  </Typography>
                </CardContent>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        {/* Featured Products Section */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard>
                <CardMedia
                  component="img"
                  height="400"
                  image={product.image}
                  alt={product.title}
                />
                {product.discount && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      bgcolor: 'error.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    -{product.discount}%
                  </Box>
                )}
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {product.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                    <Box>
                      <IconButton size="small">
                        <Favorite />
                      </IconButton>
                      <IconButton size="small">
                        <ShoppingCart />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
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
