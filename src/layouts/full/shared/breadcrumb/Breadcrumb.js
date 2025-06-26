/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Grid, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import breadcrumbImg from 'src/assets/images/breadcrumb/ChatBc.png';
import { IconCircle } from '@tabler/icons';

const Breadcrumb = ({ subtitle, items, title, children }) => (
  <Box
    sx={{
      backgroundColor: 'primary.light',
      borderRadius: (theme) => theme.shape.borderRadius / 4,
      p: '30px 25px 20px',
      marginBottom: '30px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '120px',
    }}
  >
    <Box sx={{ flex: '1', minWidth: 0 }}>
      <Typography variant="h4">{title}</Typography>
      <Typography color="textSecondary" variant="h6" fontWeight={400} mt={0.8} mb={0}>
        {subtitle}
      </Typography>
      {items && items.length > 0 && (
        <Breadcrumbs
          separator={
            <IconCircle
              size="5"
              fill="textSecondary"
              fillOpacity={'0.6'}
              style={{ margin: '0 5px' }}
            />
          }
          sx={{ alignItems: 'center', mt: '10px' }}
          aria-label="breadcrumb"
        >
          {items.map((item) => (
            <div key={item.title}>
              {item.to ? (
                <Link underline="none" color="inherit" component={NavLink} to={item.to}>
                  {item.title}
                </Link>
              ) : (
                <Typography color="textPrimary">{item.title}</Typography>
              )}
            </div>
          ))}
        </Breadcrumbs>
      )}
    </Box>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'flex-end',
      minWidth: 'fit-content',
      ml: 2
    }}>
      {children}
    </Box>
  </Box>
);

export default Breadcrumb;
