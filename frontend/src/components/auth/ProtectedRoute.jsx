import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !user) {

    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && user.roles) {
    const hasRequiredRole = allowedRoles.some(role => user.roles.includes(role));
    if (!hasRequiredRole) {

      return <Navigate to="/" replace />; 
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;