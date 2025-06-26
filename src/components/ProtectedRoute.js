import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/authContext';
import Spinner from '../views/spinner/Spinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <Spinner />;
  }

  // If no user is authenticated, redirect to login page
  if (!user) {
    // Redirect to login page with the return url
     return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected content
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute; 