import { ReactNode } from 'react'
import { useAuth } from '../../auth/AuthProvider'
export default function RequirePermission({perm,children}:{perm:string;children:ReactNode}){const{can,hasRole}=useAuth();if(hasRole('SUPER_ADMIN')||can(perm))return<>{children}</>;return null}
