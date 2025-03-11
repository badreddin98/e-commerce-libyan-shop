import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Skeleton,
  useTheme,
  Paper,
  Divider,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  LocalShipping,
  Security,
  CreditCard,
  Support,
  ArrowForward,
  TrendingUp,
  Star,
  NewReleases,
  Favorite,
  ShoppingCart
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';



const BannerSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '600px',
  overflow: 'hidden',
  marginBottom: theme.spacing(6),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

const BannerImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.6s ease-in-out',
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
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    '& img': {
      transform: 'scale(1.1)',
    },
  },
  '& img': {
    transition: 'transform 0.6s ease-in-out',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease-in-out',
  border: 'none',
  borderRadius: '16px',
  backgroundColor: '#f8f8f8',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    backgroundColor: '#ffffff',
    '& .MuiSvgIcon-root': {
      color: '#FF4E4E',
      transform: 'scale(1.1)',
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    color: '#666',
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease-in-out',
  },
}));

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { title: 'Women', image: 'https://img.ltwebstatic.com/images3_pi/2023/11/20/1700468611d61c0cafcd50b0ec7602961cab46d468_thumbnail_900x.webp' },
    { title: 'Men', image: 'https://img.ltwebstatic.com/images3_pi/2023/11/21/17005511432f2d6f4b8f0def6ce0b9c6f2dd658f6d_thumbnail_900x.webp' },
    { title: 'Kids', image: 'https://img.ltwebstatic.com/images3_pi/2023/11/21/1700551143e5a6c5fd7e5926dd0978c6fe3026019f_thumbnail_900x.webp' },
    { title: 'Beauty', image: 'https://img.ltwebstatic.com/images3_pi/2023/11/21/17005511432f2d6f4b8f0def6ce0b9c6f2dd658f6d_thumbnail_900x.webp' },
  ];

    const features = [
    { icon: <LocalShipping fontSize="large" />, title: 'Free Shipping', description: 'On orders over $50' },
    { icon: <Security fontSize="large" />, title: 'Secure Payments', description: 'Protected by SSL' },
    { icon: <CreditCard fontSize="large" />, title: 'Easy Returns', description: '30-day return policy' },
    { icon: <Support fontSize="large" />, title: '24/7 Support', description: 'Live chat support' },
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
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '1px',
            }}
          >
            Spring Collection 2024
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              fontWeight: 500,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(255, 78, 78, 0.9)',
              padding: '8px 24px',
              borderRadius: '24px',
              display: 'inline-block',
              marginBottom: '24px',
            }}
          >
            Up to 70% Off
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ 
              mt: 3,
              bgcolor: '#FF4E4E',
              color: 'white',
              borderRadius: '24px',
              padding: '12px 36px',
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#ff3333',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(255, 78, 78, 0.3)',
              },
            }}
            onClick={() => navigate('/products')}
          >
            Shop Now
          </Button>
        </BannerContent>
      </BannerSection>

      {/* Categories Section */}
      <Container maxWidth="xl">
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 4,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              left: 0,
              width: '60px',
              height: '3px',
              backgroundColor: '#FF4E4E',
              borderRadius: '2px',
            },
          }}
        >
          Shop by Category
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.title}>
              <CategoryCard onClick={() => navigate(`/products?category=${category.title.toLowerCase()}`)}>
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
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 4,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              left: 0,
              width: '60px',
              height: '3px',
              backgroundColor: '#FF4E4E',
              borderRadius: '2px',
            },
          }}
        >
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard>
                  {feature.icon}
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
