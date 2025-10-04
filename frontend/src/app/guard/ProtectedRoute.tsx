// frontend/src/app/guard/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

export default function ProtectedRoute() {
  const { accessToken } = useAuth();
  const loc = useLocation();
  if (!accessToken) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}
