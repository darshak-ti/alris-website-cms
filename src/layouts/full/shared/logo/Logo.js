import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material';
import image from 'src/assets/images/logos/favicon.svg';
const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'block',
  }));

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled
        
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {customizer.activeMode === 'dark' ? (
          <img
            src={image}
            alt="Logo"
            style={{ height: '100%', width: 'auto' }}
          />
        ) : (
          <img
            src={image}
            alt="Logo"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </LinkStyled>
    );
  }
  return (
    <LinkStyled
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {customizer.activeMode === 'dark' ? (
        <img
          src={image}
          alt="Logo"
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <img
          src={image}
          alt="Logo"
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
