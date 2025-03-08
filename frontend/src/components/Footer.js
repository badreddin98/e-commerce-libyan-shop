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
      links: ['About SHEIN', 'Affiliate', 'Fashion Blogger', 'Careers'],
    },
    {
      title: 'HELP & SUPPORT',
      links: ['Shipping Info', 'Returns', 'How to Order', 'How to Track'],
    },
    {
      title: 'CUSTOMER CARE',
      links: ['Contact Us', 'Payment Methods', 'Bonus Point', 'Size Guide'],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'black',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* Newsletter Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" gutterBottom>
            SIGN UP FOR SHEIN STYLE NEWS
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
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: 'black',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
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
            <Typography variant="subtitle1" gutterBottom>
              FIND US ON
            </Typography>
            <Box>
              <IconButton color="inherit">
                <Facebook />
              </IconButton>
              <IconButton color="inherit">
                <Twitter />
              </IconButton>
              <IconButton color="inherit">
                <Instagram />
              </IconButton>
              <IconButton color="inherit">
                <Pinterest />
              </IconButton>
              <IconButton color="inherit">
                <YouTube />
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
            ©2024 SHEIN All Rights Reserved
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
