import React from 'react';
import { Box } from '@mui/material';
import TopBanner from './TopBanner';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <Box>
      <TopBanner />
      <Header />
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
