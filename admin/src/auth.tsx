import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from './api';

type User = { id: string; email: string; name: string; role: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>(null as any);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sg_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/admin/me')
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem('sg_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post('/admin/login', { email, password });
    localStorage.setItem('sg_token', r.data.token);
    setUser(r.data.user);
  };

  const logout = () => {
    localStorage.removeItem('sg_token');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}
