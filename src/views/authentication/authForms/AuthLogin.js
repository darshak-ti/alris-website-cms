/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { useAuth } from '../../../utils/authContext';
import Toastify from '../../../components/Toastify/Toastify';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const AuthLogin = ({ title, subtitle, subtext }) => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the intended destination, but ensure it's not the login page itself
  const from = location.state?.from?.pathname || '/';
  const isFromLoginPage = from === '/auth/login' || from === '/login';

  // If user is already authenticated, redirect them
  React.useEffect(() => {
    if (user) {
      console.log('User already authenticated, redirecting to:', from);
      if (isFromLoginPage || from === '/') {
        navigate('/blogs', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, from, isFromLoginPage, navigate]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await login(values.email, values.password);

      if (error) {
        let errorMessage = 'An error occurred during login';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account';
        } else {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        Toastify.error(errorMessage);
        return;
      }

      if (data?.user) {
        Toastify.success('Login successful!');
        
        // Redirect to dashboard or intended page, but avoid login page
        if (isFromLoginPage || from === '/blogs') {
          navigate('/blogs', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      Toastify.error(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <Stack spacing={0}>
              <Box>
                <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
                <Field
                  as={CustomTextField}
                  id="email"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Box>

              <Box>
                <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                <Field
                  as={CustomTextField}
                  id="password"
                  name="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Box>

              <Box>
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  sx={{ mt: 5 }}
                  fullWidth
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>

      {subtitle}
    </>
  );
};

export default AuthLogin;
