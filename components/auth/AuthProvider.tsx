/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  logout: () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get('token');
      const token = tokenCookie?.value;
      if (token) {
        try {
          const decoded: any = jwt.decode(token);
          setUser({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            photo: decoded.photo,
          });
          setIsAuthenticated(true);
        } catch {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    })();
  }, []);

  function logout() {
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
