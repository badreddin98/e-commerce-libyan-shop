import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Home,
  Category,
  ShoppingCart,
  Person,
} from '@mui/icons-material';

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, link: '/' },
    { text: 'Products', icon: <Category />, link: '/products' },
    ...(user
      ? [
          { text: 'Cart', icon: <ShoppingCart />, link: '/cart' },
          { text: 'Logout', icon: <Person />, onClick: handleLogout },
        ]
      : [
          { text: 'Login', icon: <Person />, link: '/login' },
          { text: 'Register', icon: <Person />, link: '/register' },
        ])
  ];

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: 240 },
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <ListItem
              button
              {...(item.link
                ? { component: Link, to: item.link, onClick: onClose }
                : { onClick: item.onClick }
              )}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
            {index < menuItems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default MobileMenu;
