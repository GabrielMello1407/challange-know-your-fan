'use client';

import { useState, useEffect } from 'react';

interface User {
  name: string;
  photo?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const res = await fetch('/api/user/verify', { credentials: 'include' }); // Verifica o token no cookie
      if (!res.ok) throw new Error('Não autenticado');
      const data = await res.json();
      if (data.authenticated) {
        setUser({ name: data.user.name, photo: data.user.photo });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function logout() {
    await fetch('/api/user/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  }

  return { user, loading, logout };
};
