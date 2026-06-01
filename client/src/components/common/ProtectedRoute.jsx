import { Navigate, Outlet } from 'react-router-dom';
import Loader from './Loader';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ roles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Loader height="100vh" />;
  if (!isAuthenticated) return <Navigate to="/select-role" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to={`/${user?.role}`} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
