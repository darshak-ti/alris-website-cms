import { useState } from 'react';
import { Button, Stack, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { useAuth } from '../../../utils/authContext';
import Toastify from '../../../components/Toastify/Toastify';

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const AuthForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await resetPassword(values.email);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('Password reset email sent! Please check your email inbox.');
      resetForm();
      Toastify.success('Password reset email sent!');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stack mt={4} spacing={2}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <Stack spacing={3}>
                <CustomFormLabel htmlFor="reset-email">Email Address</CustomFormLabel>
                <Field
                  as={CustomTextField}
                  id="reset-email"
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

                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isLoading ? 'Sending...' : 'Reset Password'}
                </Button>

                <Button
                  color="primary"
                  size="large"
                  fullWidth
                  component={Link}
                  to="/auth/login"
                >
                  Back to Login
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </>
  );
};

export default AuthForgotPassword;
