/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Box, Typography, Button, Divider, Alert, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import { useAuth } from '../../../utils/authContext';
import Toastify from '../../../components/Toastify/Toastify';

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const AuthRegister = ({ title, subtitle, subtext }) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await register(values.email, values.password, {
        name: values.name,
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists');
        } else if (error.message.includes('Password should be at least')) {
          setError('Password is too weak. Please choose a stronger password.');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data?.user) {
        setSuccess('Registration successful! Please check your email to confirm your account.');
        resetForm();
        Toastify.success('Registration successful! Please check your email.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
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

      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign up with
          </Typography>
        </Divider>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {success}
        </Alert>
      )}

      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <Stack spacing={3}>
              <Box>
                <CustomFormLabel htmlFor="name">Full Name</CustomFormLabel>
                <Field
                  as={CustomTextField}
                  id="name"
                  name="name"
                  variant="outlined"
                  fullWidth
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Box>

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
                <CustomFormLabel htmlFor="confirmPassword">Confirm Password</CustomFormLabel>
                <Field
                  as={CustomTextField}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Box>

              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                disabled={isSubmitting || isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

      {subtitle}
    </>
  );
};

AuthRegister.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.node,
  subtext: PropTypes.node,
};

export default AuthRegister;
