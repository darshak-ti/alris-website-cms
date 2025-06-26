/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, Divider } from '@mui/material';
import { useSelector } from 'react-redux';

const DownloadCard = ({ title, children, Action }) => {
  const customizer = useSelector((state) => state.customizer);

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{ padding: 0, border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none' }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      <CardHeader
        sx={{
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        title={title}
        action={Action}
      />
      {/* <Divider /> */}
      {children}
    </Card>
  );
};
DownloadCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  onDownload: PropTypes.func,
  Action: PropTypes.node,
};
export default DownloadCard;
