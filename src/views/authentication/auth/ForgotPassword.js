import { Grid, Box, Card, Typography } from '@mui/material';

// components
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthForgotPassword from '../authForms/AuthForgotPassword';

const ForgotPassword = () => {
  return (
    <PageContainer title="Forgot Password" description="this is Forgot Password page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={5}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <Box textAlign="center" mb={3}>
                <Typography variant="h3" fontWeight="700" mb={1}>
                  Forgot Password
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </Typography>
              </Box>
              <AuthForgotPassword />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ForgotPassword; 