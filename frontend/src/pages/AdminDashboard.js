import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Container,
  Paper
} from '@mui/material';
import ProductScraper from '../components/ProductScraper';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Product Scraper" />
            <Tab label="Products" />
            <Tab label="Orders" />
            <Tab label="Users" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <ProductScraper />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography>Products management coming soon...</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography>Orders management coming soon...</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography>Users management coming soon...</Typography>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
