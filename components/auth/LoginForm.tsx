/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const initialState = {
  email: '',
  password: '',
};

export default function LoginForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (!form.email || !form.password) {
      toast.error('Preencha todos os campos.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao fazer login.');
      toast.success('Login realizado com sucesso!');
      // Redirecionar ou atualizar estado de autenticação aqui
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        name="email"
        placeholder="E-mail"
        className="bg-black/60 border border-purple-800/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
      />
      <input
        type="password"
        name="password"
        placeholder="Senha"
        className="bg-black/60 border border-purple-800/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all text-lg mt-2 focus-visible:ring-2 focus-visible:ring-purple-600 disabled:opacity-60"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
