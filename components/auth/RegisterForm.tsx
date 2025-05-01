/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const initialState = {
  name: '',
  email: '',
  password: '',
  address: '',
  cpf: '',
};

export default function RegisterForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
        toast.error('Apenas arquivos JPG ou PNG são permitidos.');
        return;
      }
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    // Validação simples
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.address ||
      !form.cpf
    ) {
      toast.error('Preencha todos os campos.');
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }
    if (!/^[0-9]{11,14}$/.test(form.cpf)) {
      toast.error('CPF inválido.');
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value),
      );
      if (photo) formData.append('photo', photo);
      const res = await fetch('/api/user/register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar.');
      setSuccess(data.message || 'Cadastro realizado! Verifique seu e-mail.');
      toast.success(
        data.message || 'Cadastro realizado! Verifique seu e-mail.',
      );
      router.push('/');
      setForm(initialState);
      setPhoto(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      encType="multipart/form-data"
    >
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-600 bg-gray-800 flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full"
              width={80}
              height={80}
            />
          ) : (
            <Image
              src="/uploads/avatars/default-avatar.png"
              alt="Avatar padrão"
              className="object-cover w-full h-full"
              width={80}
              height={80}
            />
          )}
        </div>
        <Input
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          ref={fileInputRef}
          onChange={handlePhotoChange}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-purple-400 hover:text-purple-200 underline bg-[#0E1625] hover:bg-[#0E1625]"
        >
          {photo ? 'Trocar foto' : 'Adicionar foto (opcional)'}
        </Button>
      </div>
      <Input
        type="text"
        name="name"
        placeholder="Nome completo"
        className="bg-black/60 border border-purple-800/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
        value={form.name}
        onChange={handleChange}
        autoComplete="name"
      />
      <Input
        type="email"
        name="email"
        placeholder="E-mail"
        className="bg-black/60 border border-purple-800/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
      />
      <Input
        type="password"
        name="password"
        placeholder="Senha"
        className="bg-black/60 border border-purple-800/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
      />
      <Input
        type="text"
        name="address"
        placeholder="Endereço"
        className="bg-black/60 border border-purple-800/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
        value={form.address}
        onChange={handleChange}
        autoComplete="street-address"
      />
      <Input
        type="text"
        name="cpf"
        placeholder="CPF (somente números)"
        className="bg-black/60 border border-purple-800/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
        value={form.cpf}
        onChange={handleChange}
        autoComplete="off"
        maxLength={14}
      />
      <Button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all text-lg mt-2 focus-visible:ring-2 focus-visible:ring-purple-600 disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Cadastrando...' : 'Criar conta'}
      </Button>
      {error && <div className="hidden">{error}</div>}
      {success && <div className="hidden">{success}</div>}
    </form>
  );
}
