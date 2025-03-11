import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Pinterest,
  YouTube,
} from '@mui/icons-material';

const Footer = () => {
  const footerSections = [
    {
      title: 'COMPANY INFO',
      links: ['About LibyanShop', 'Affiliate Program', 'Fashion Bloggers', 'Careers', 'Student Discount'],
    },
    {
      title: 'HELP & SUPPORT',
      links: ['Shipping Information', 'Return Policy', 'How to Order', 'Track Order', 'Size Guide', 'VIP Program'],
    },
    {
      title: 'CUSTOMER CARE',
      links: ['Contact Us', 'Payment Methods', 'Bonus Points', 'FAQ', 'Terms & Conditions', 'Privacy Policy'],
    },
    {
      title: 'DOWNLOAD APP',
      links: ['Get the best experience with our mobile app', 'iOS App Store', 'Google Play Store'],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a1a1a',
        color: '#ffffff',
        pt: 8,
        pb: 4,
        mt: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        {/* Newsletter Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" gutterBottom>
            JOIN THE LIBYANSHOP FAMILY
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              gap: 1,
              maxWidth: 400,
            }}
          >
            <TextField
              fullWidth
              placeholder="Your email address"
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: '24px',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF4E4E',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF4E4E',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  '&::placeholder': {
                    color: '#666',
                    opacity: 1,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: '#FF4E4E',
                color: 'white',
                borderRadius: '24px',
                px: 4,
                '&:hover': {
                  bgcolor: '#ff3333',
                },
                fontWeight: 600,
                letterSpacing: '1px',
              }}
            >
              SUBSCRIBE
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Footer Sections */}
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography variant="subtitle1" gutterBottom>
                {section.title}
              </Typography>
              <Box>
                {section.links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    color="inherit"
                    sx={{
                      display: 'block',
                      mb: 1,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Social Media Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              CONNECT WITH US
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: '#FF4E4E' },
                  transition: 'all 0.3s ease',
                }}
              >
                <Facebook sx={{ color: 'white' }} />
              </IconButton>
              <IconButton 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: '#FF4E4E' },
                  transition: 'all 0.3s ease',
                }}
              >
                <Twitter sx={{ color: 'white' }} />
              </IconButton>
              <IconButton 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: '#FF4E4E' },
                  transition: 'all 0.3s ease',
                }}
              >
                <Instagram sx={{ color: 'white' }} />
              </IconButton>
              <IconButton 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': { bgcolor: '#FF4E4E' },
                  transition: 'all 0.3s ease',
                }}
              >
                <YouTube sx={{ color: 'white' }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.400">
            ©2024 LIBYANSHOP All Rights Reserved
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
              Privacy Center
            </Link>
            <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
              Privacy & Cookie Policy
            </Link>
            <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
              Manage Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
