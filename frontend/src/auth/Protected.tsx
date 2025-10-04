import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type Props = {
  children: React.ReactNode;
};

export function RequireAuth({ children }: Props) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const RequirePerm: React.FC<{perm: string | string[], children: React.ReactNode}> = ({ perm, children }) => {
  const { hasPerm } = useAuth();
  if (!hasPerm(perm)) return <div>No autorizado</div>;
  return <>{children}</>;
};

export const RequireRole: React.FC<{role: string | string[], children: React.ReactNode}> = ({ role, children }) => {
  const { hasRole } = useAuth();
  if (!hasRole(role)) return <div>No autorizado</div>;
  return <>{children}</>;
};
