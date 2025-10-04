import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

type UserInfo = {
  id?: number;
  email?: string;
  roles: string[];
  perms: string[];
};

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfo | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  hasRole: (role: string) => boolean;
  can: (perm: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [user, setUser] = useState<UserInfo | null>(() => {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const perms = JSON.parse(localStorage.getItem('perms') || '[]');
    const email = localStorage.getItem('email') || undefined;
    if (!roles.length && !perms.length) return null;
    return { email, roles, perms };
  });

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, roles = [], perms = [] } = data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('roles', JSON.stringify(roles));
    localStorage.setItem('perms', JSON.stringify(perms));
    localStorage.setItem('email', email);

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser({ email, roles, perms });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('perms');
    localStorage.removeItem('email');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const hasRole = (role: string) => !!user?.roles?.includes(role);
  const can = (perm: string) => !!user?.perms?.includes(perm);

  const value = useMemo<AuthContextValue>(
    () => ({ accessToken, refreshToken, user, login, logout, hasRole, can }),
    [accessToken, refreshToken, user]
  );

  // refresca user desde localStorage si alguien limpió/recargó
  useEffect(() => {
    if (!user && accessToken) {
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      const perms = JSON.parse(localStorage.getItem('perms') || '[]');
      const email = localStorage.getItem('email') || undefined;
      setUser({ email, roles, perms });
    }
  }, [accessToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
