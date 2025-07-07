import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { IconMail, IconLogout } from '@tabler/icons';
import { Stack } from '@mui/system';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import { useAuth } from '../../../../utils/authContext';
import Toastify from '../../../../components/Toastify/Toastify';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await logout();
      if (error) {
        Toastify.error('Logout failed. Please try again.');
        return;
      }
      Toastify.success('Logged out successfully!');
      navigate('/auth/login', { replace: true });
    } catch (err) {
      Toastify.error('An error occurred during logout.');
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      handleClose2();
    }
  };

  const userEmail = user?.email || 'user@example.com';
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={userName}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar src={ProfileImg} alt={userName} sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {userName}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.user_metadata?.role || 'User'}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {userEmail}
            </Typography>
          </Box>
        </Stack>
        <Divider />
       
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleLogout}
            disabled={isLoggingOut}
            startIcon={isLoggingOut ? <CircularProgress size={16} /> : <IconLogout size={16} />}
          >
            {isLoggingOut ? 'Logging Out...' : 'Logout'}
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
