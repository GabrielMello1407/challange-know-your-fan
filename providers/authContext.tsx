'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/verify', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (!res.ok) {
        console.log('Resposta não OK de /api/user/verify:', res.status);
        setUser(null);
        return;
      }
      const data = await res.json();
      console.log('Dados recebidos de /api/user/verify:', data);
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async () => {
    console.log('Chamando fetchUser após login');
    await fetchUser();
  };

  const logout = async () => {
    console.log('Executando logout');
    try {
      const res = await fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        console.error('Erro ao fazer logout:', res.status);
        return;
      }
      setUser(null);
      router.push('/login'); // Redireciona para login
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return ctx;
}
