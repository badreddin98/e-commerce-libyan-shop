import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  ShoppingCart,
  Favorite,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#eeeeee',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '400px',
  },
  transition: 'all 0.3s ease',
  border: '1px solid transparent',
  '&:focus-within': {
    border: '1px solid #FF4E4E',
    boxShadow: '0 0 0 4px rgba(255, 78, 78, 0.1)',
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const categories = [
  { title: 'NEW IN', url: '/category/new' },
  { title: 'WOMEN', url: '/category/women' },
  { title: 'CURVE + PLUS', url: '/category/plus' },
  { title: 'MEN', url: '/category/men' },
  { title: 'KIDS', url: '/category/kids' },
  { title: 'BEAUTY', url: '/category/beauty' },
  { title: 'HOME', url: '/category/home' },
  { title: 'SALE', url: '/category/sale' }
];

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        SHEIN
      </Typography>
      <Divider />
      <List>
        {categories.map((category) => (
          <ListItem 
            key={category.title} 
            button 
            onClick={() => navigate(category.url)}
          >
            <ListItemText primary={category.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{
      backgroundColor: 'white',
      color: 'black',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Futura, sans-serif',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: '#FF4E4E',
              textDecoration: 'none',
              fontSize: '1.8rem',
            }}
          >
            LIBYANSHOP
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {categories.map((category) => (
              <Button
                key={category.title}
                onClick={() => navigate(category.url)}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  letterSpacing: '1px',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#FF4E4E',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover:after': {
                    width: '80%',
                  },
                }}
              >
                {category.title}
              </Button>
            ))}
          </Box>

          {/* Search Bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {/* User Actions */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <IconButton
              sx={{
                color: 'black',
                '&:hover': { color: '#FF4E4E' },
                transition: 'color 0.3s ease',
              }}
            >
              <Favorite />
            </IconButton>
            
            <IconButton 
              onClick={() => navigate('/cart')}
              sx={{
                mr: 2,
                color: 'black',
                '&:hover': { color: '#FF4E4E' },
                transition: 'color 0.3s ease',
              }}
            >
              <Badge 
                badgeContent={cartItems.length} 
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#FF4E4E',
                    color: 'white',
                  },
                }}
              >
                <ShoppingCart />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.name} src={user.avatar} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => navigate('/profile')}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/orders')}>
                    <Typography textAlign="center">Orders</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
