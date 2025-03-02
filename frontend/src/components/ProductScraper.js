import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

const ProductScraper = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      setError('Failed to paste from clipboard');
    }
  };

  const handlePreview = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setPreview(null);

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/scraper/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to preview product');
      }

      setPreview(data);
      setSuccess('Preview loaded successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/api/scraper/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save product');
      }

      setSuccess('Product saved successfully');
      setUrl('');
      setPreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Product Scraper
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Product URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter product URL to scrape"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handlePaste}
                startIcon={<ContentPasteIcon />}
              >
                Paste
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePreview}
                startIcon={<PreviewIcon />}
                disabled={loading}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Paper>

      {preview && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {preview.name}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" color="primary" gutterBottom>
              ${preview.price}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {preview.description}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Available Sizes:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {preview.sizes.map((size) => (
                  <Chip key={size} label={size} variant="outlined" />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Available Colors:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {preview.colors.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    variant="outlined"
                    sx={{
                      backgroundColor: color.toLowerCase(),
                      color: ['white', 'yellow', 'lime'].includes(color.toLowerCase()) ? 'black' : 'white'
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Product Images:
            </Typography>
            <ImageList sx={{ maxHeight: 400 }} cols={3} rowHeight={200}>
              {preview.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    loading="lazy"
                    style={{ objectFit: 'contain' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProductScraper;
