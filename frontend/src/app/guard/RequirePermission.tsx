import { ReactNode } from 'react';
import { useAuth } from '../../auth/AuthProvider';

export default function RequirePermission({
  perm,
  children,
}: { perm: string; children: ReactNode }) {
  const { can } = useAuth();
  if (!can(perm)) return null;
  return <>{children}</>;
}
