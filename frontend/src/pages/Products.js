import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import {
  Container,
  Grid,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  Checkbox,
  Slider,
  FormGroup,
  FormControlLabel,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import ProductCard from '../components/ProductCard';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: '#ffffff',
    borderRight: 'none',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
}));

const FilterButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '24px',
  padding: '8px 16px',
  gap: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    transform: 'translateY(-2px)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
  },
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: '#666',
  '&.Mui-checked': {
    color: '#FF4E4E',
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: '#FF4E4E',
  '& .MuiSlider-thumb': {
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(255, 78, 78, 0.16)',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.32,
  },
}));

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from:', `${API_BASE_URL}/products`);
        const response = await fetch(`${API_BASE_URL}/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products data:', data);
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch products');
        }
        
        if (!Array.isArray(data.products)) {
          throw new Error('Invalid products data received');
        }
        
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    'Dresses',
    'Tops',
    'Bottoms',
    'Outerwear',
    'Accessories',
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    applyFilters(products, selectedCategories, selectedSizes, newValue);
  };

  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    applyFilters(products, newCategories, selectedSizes, priceRange);
  };

  const handleSizeChange = (size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    applyFilters(products, selectedCategories, newSizes, priceRange);
  };

  const applyFilters = (products, categories, sizes, priceRange) => {
    let filtered = [...products];

    // Apply category filter
    if (categories.length > 0) {
      filtered = filtered.filter(product => categories.includes(product.category));
    }

    // Apply size filter
    if (sizes.length > 0) {
      filtered = filtered.filter(product => 
        product.size.some(s => sizes.includes(s))
      );
    }

    // Apply price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    if (products.length > 0) {
      applyFilters(products, selectedCategories, selectedSizes, priceRange);
    }
  }, [products, selectedCategories, selectedSizes, priceRange]);

  const FilterDrawer = () => (
    <Box sx={{ width: 280, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Filters
        </Typography>
        {isMobile && (
          <IconButton 
            onClick={() => setDrawerOpen(false)}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: '50%',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <Close sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        )}
      </Box>

      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600,
          mb: 2,
          color: '#333',
        }}
      >
        Categories
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category} dense>
            <FormControlLabel
              sx={{
                '& .MuiTypography-root': {
                  fontSize: '0.95rem',
                  color: '#666',
                  transition: 'color 0.3s ease',
                },
                '&:hover .MuiTypography-root': {
                  color: '#FF4E4E',
                },
              }}
              control={
                <StyledCheckbox 
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
              }
              label={category}
            />
          </ListItem>
        ))}
      </List>

      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600,
          mb: 2,
          mt: 4,
          color: '#333',
        }}
      >
        Size
      </Typography>
      <FormGroup>
        {sizes.map((size) => (
          <FormControlLabel
            key={size}
            sx={{
              '& .MuiTypography-root': {
                fontSize: '0.95rem',
                color: '#666',
                transition: 'color 0.3s ease',
              },
              '&:hover .MuiTypography-root': {
                color: '#FF4E4E',
              },
            }}
            control={
              <StyledCheckbox 
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeChange(size)}
              />
            }
            label={size}
          />
        ))}
      </FormGroup>

      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600,
          mb: 2,
          mt: 4,
          color: '#333',
        }}
      >
        Price Range
      </Typography>
      <Box sx={{ px: 2 }}>
        <StyledSlider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={200}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography sx={{ color: '#666', fontWeight: 500 }}>
            ${priceRange[0]}
          </Typography>
          <Typography sx={{ color: '#666', fontWeight: 500 }}>
            ${priceRange[1]}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ pt: 8, bgcolor: '#f8f8f8', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            my: 4,
            pb: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Products
          </Typography>
          {isMobile && (
            <FilterButton onClick={() => setDrawerOpen(true)}>
              <FilterList />
              <Typography 
                variant="button" 
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 600,
                  letterSpacing: '1px',
                }}
              >
                Filter
              </Typography>
            </FilterButton>
          )}
        </Box>

        <Grid container spacing={2}>
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <FilterDrawer />
            </Grid>
          )}
          
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {loading ? (
                <Box display="flex" justifyContent="center" width="100%" p={3}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ width: '100%', m: 2 }}>
                  {error}
                </Alert>
              ) : (
                (filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={4}>
                    <ProductCard product={product} />
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <FilterDrawer />
      </Drawer>
    </Box>
  );
};

export default Products;
