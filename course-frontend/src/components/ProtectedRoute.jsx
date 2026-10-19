
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({
  user,
  loading,
  requiredRole,
  children,
}) {
  if (loading) {
    return <p>Loading your account...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role || '').toUpperCase();
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';

  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <Navigate to="/user-dashboard" replace />;
  }

  if (requiredRole === 'USER' && isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
}
