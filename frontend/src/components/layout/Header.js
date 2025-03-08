import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Button,
  Container,
  styled,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#F5F5F5',
  '&:hover': {
    backgroundColor: '#EEEEEE',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontSize: '1.5rem',
}));

const IconsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const categories = [
  'New In',
  'Sale',
  'Women Clothing',
  'Beachwear',
  'Kids',
  'Curve',
  'Men Clothing',
  'Shoes',
  'Underwear & Sleepwear',
  'Home & Kitchen',
  'Jewelry & Accessories',
  'Beauty & Health',
  'Baby & Maternity',
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="lg">
          <StyledToolbar>
            <IconButton
              color="inherit"
              edge="start"
              sx={{ display: { sm: 'none' } }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Logo component={Link} to="/" variant="h6">
              LIBYAN SHOP
            </Logo>

            <SearchBox component="form" onSubmit={handleSearch}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputProps={{ 'aria-label': 'search' }}
              />
            </SearchBox>

            <IconsWrapper>
              <IconButton color="inherit" component={Link} to="/wishlist">
                <Badge badgeContent={0} color="secondary">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={0} color="secondary">
                  <CartIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" component={Link} to="/account">
                <PersonIcon />
              </IconButton>
            </IconsWrapper>
          </StyledToolbar>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, py: 1, overflowX: 'auto' }}>
            {categories.map((category) => (
              <Button
                key={category}
                color="inherit"
                component={Link}
                to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                sx={{ 
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                  px: 1.5,
                  '&:hover': {
                    color: 'secondary.main',
                  }
                }}
              >
                {category}
              </Button>
            ))}
          </Box>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {categories.map((category) => (
              <ListItem
                key={category}
                button
                component={Link}
                to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
