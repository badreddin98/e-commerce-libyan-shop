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

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
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
  };

  const FilterDrawer = () => (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        )}
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Categories
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category} dense>
            <FormControlLabel
              control={<Checkbox />}
              label={category}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle1" gutterBottom>
        Size
      </Typography>
      <FormGroup>
        {sizes.map((size) => (
          <FormControlLabel
            key={size}
            control={<Checkbox />}
            label={size}
          />
        ))}
      </FormGroup>

      <Typography variant="subtitle1" gutterBottom>
        Price Range
      </Typography>
      <Box sx={{ px: 2 }}>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={200}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>${priceRange[0]}</Typography>
          <Typography>${priceRange[1]}</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ pt: 8 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 3 }}>
          <Typography variant="h4" component="h1">
            Products
          </Typography>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <FilterList />
            </IconButton>
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
                products.map((product) => (
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
