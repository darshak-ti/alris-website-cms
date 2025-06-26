import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/authContext';
import Spinner from '../views/spinner/Spinner';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <Spinner />;
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    const from = location.state?.from?.pathname || '/';
    console.log('Authenticated user accessing public route, redirecting to:', from);
    return <Navigate to={from} replace />;
  }

  // If user is not authenticated, render the public content
  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute; 