'use client';
import { useEffect, useState } from 'react';
import CardUsers from '@/components/cardUsers';
import Loading from '@/components/Loading';

export default function SocialPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const res = await fetch('/api/social/getAll');
      if (res.ok) {
        setUsers(await res.json());
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-purple-600 mb-8 text-center">
          Conheça a comunidade
        </h1>
        {loading ? (
          <Loading message="Carregando usuários..." />
        ) : users.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            Nenhum usuário encontrado.
          </div>
        ) : (
          <CardUsers users={users} />
        )}
      </div>
    </div>
  );
}
