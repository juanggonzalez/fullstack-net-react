// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si isAuthenticated es true, pero no hay user (por si acaso el token está solo)
  if (isAuthenticated && !user) {
    // Esto podría indicar un problema, como un token sin user asociado.
    // Podrías forzar logout y redirigir. Por ahora, asumimos que 'user' debería existir.
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos, verifica si el usuario tiene alguno de esos roles
  if (allowedRoles && user && user.roles) {
    const hasRequiredRole = allowedRoles.some(role => user.roles.includes(role));
    if (!hasRequiredRole) {
      // Si el usuario no tiene el rol requerido, redirige a una página de "Acceso Denegado"
      // o a la página principal.
      return <Navigate to="/" replace />; // O a una página /unauthorized
    }
  }

  // Si está autenticado y tiene los roles correctos (si se especificaron), permite el acceso
  return <Outlet />;
};

export default ProtectedRoute;