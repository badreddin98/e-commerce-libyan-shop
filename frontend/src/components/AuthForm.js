import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  Divider,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { styled } from '@mui/material/styles';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '400px',
  margin: '0 auto',
  marginTop: theme.spacing(8),
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const AuthForm = ({
  formType,
  formData,
  handleChange,
  handleSubmit,
  error,
  loading,
}) => {
  return (
    <Container component="main" maxWidth="xs">
      <FormContainer elevation={3}>
        <Typography component="h1" variant="h5">
          {formType === 'login' ? 'Sign In' : 'Create Account'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {formType === 'register' && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
              />
            </Box>
          )}
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email || ''}
            onChange={handleChange}
          />
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete={formType === 'login' ? 'current-password' : 'new-password'}
            value={formData.password || ''}
            onChange={handleChange}
          />

          {formType === 'register' && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword || ''}
              onChange={handleChange}
            />
          )}

          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading
              ? 'Loading...'
              : formType === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </SubmitButton>

          <Box sx={{ mt: 3, position: 'relative' }}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <GoogleLogin
                onSuccess={() => {
                  window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
                }}
                onError={() => {
                  console.error('Google Login Failed');
                }}
                useOneTap
              />
            </Box>
          </Box>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default AuthForm;
