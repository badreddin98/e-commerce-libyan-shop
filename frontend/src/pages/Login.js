import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      <AuthForm
        formType="login"
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        loading={loading}
      />
      <Container maxWidth="xs" sx={{ mt: 2, textAlign: 'center' }}>
        <Link component={RouterLink} to="/register" variant="body2">
          Don't have an account? Sign Up
        </Link>
      </Container>
    </>
  );
};

export default Login;
