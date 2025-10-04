import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Session = {
  accessToken: string;
  email: string;
  roles: string[];
  perms: string[];
};

type AuthCtx = {
  session: Session | null;
  login(s: Session): void;
  logout(): void;
  hasRole: (r: string | string[]) => boolean;
  hasPerm: (p: string | string[]) => boolean;
};

const AuthContext = createContext<AuthCtx>({
  session: null,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
  hasPerm: () => false,
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(() => {
    const raw = localStorage.getItem('jb_session');
    return raw ? JSON.parse(raw) : null;
  });

  const login = (s: Session) => {
    setSession(s);
    localStorage.setItem('jb_session', JSON.stringify(s));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('jb_session');
  };

  const hasRole = (r: string | string[]) => {
    if (!session) return false;
    const list = Array.isArray(r) ? r : [r];
    return list.some(x => session.roles.includes(x));
  };

  const hasPerm = (p: string | string[]) => {
    if (!session) return false;
    const list = Array.isArray(p) ? p : [p];
    return list.some(x => session.perms.includes(x));
  };

  const value = useMemo(() => ({ session, login, logout, hasRole, hasPerm }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
