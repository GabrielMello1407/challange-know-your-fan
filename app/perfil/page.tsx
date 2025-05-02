'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';

interface User {
  id: string;
  name: string;
  address: string;
  cpf: string;
  photo: string;
  email: string;
}

interface Document {
  id: number;
  url: string;
  type: string;
  validated: boolean;
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<{
    name: string;
    address: string;
    cpf: string;
    photo: string | File;
  }>({
    name: '',
    address: '',
    cpf: '',
    photo: '',
  });
  const [preview, setPreview] = useState('/avatar-default.png');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Novo estado para controle de carregamento inicial
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docLoading, setDocLoading] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user/update', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setForm({
            name: data.name || '',
            address: data.address || '',
            cpf: data.cpf || '',
            photo: data.photo || '/avatar-default.png',
          });
          setPreview(data.photo || '/avatar-default.png');

          // Após carregar o usuário, busca os documentos
          await fetchDocuments(data.id);
        } else {
          toast.error('Erro ao carregar os dados do usuário.');
        }
      } catch {
        toast.error('Erro ao carregar os dados do usuário.');
      } finally {
        setIsLoading(false); // Finaliza o loading inicial
      }
    }

    async function fetchDocuments(userId: string) {
      try {
        const res = await fetch(`/api/document?userId=${userId}`);
        if (res.ok) {
          const docs = await res.json();
          setDocuments(docs);
        }
      } catch {
        toast.error('Erro ao carregar os documentos.');
      }
    }

    fetchUser();
  }, []); // Removido user?.id da dependência, já que só queremos carregar uma vez no mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setPreview('/avatar-default.png');
      return;
    }
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreview(reader.result);
        } else {
          setPreview('/avatar-default.png');
        }
      };
      reader.readAsDataURL(file);
      setForm({ ...form, photo: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('address', form.address);
    formData.append('cpf', form.cpf);
    if (form.photo && form.photo instanceof File) {
      formData.append('photo', form.photo);
    }
    const res = await fetch('/api/user/update', {
      method: 'PUT',
      body: formData,
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setForm({
        name: updated.name,
        address: updated.address,
        cpf: updated.cpf,
        photo: updated.photo,
      });
      setPreview(updated.photo);
      window.location.reload();
    }
    setLoading(false);
  };

  const handleDocumentUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!docInputRef.current?.files?.[0]) return;
    setDocLoading(true);
    const formData = new FormData();
    formData.append('file', docInputRef.current.files[0]);
    const res = await fetch('/api/document', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      toast.success('Documento enviado com sucesso!');
      if (user && user.id) {
        const docsRes = await fetch(`/api/document?userId=${user.id}`);
        if (docsRes.ok) setDocuments(await docsRes.json());
      }
    } else {
      toast.error('Erro ao enviar documento.');
    }
    setDocLoading(false);
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handleRemoveDocument = async (docId: number) => {
    if (!user) return;
    const res = await fetch(`/api/document?id=${docId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Documento removido com sucesso!');
      const docsRes = await fetch(`/api/document?userId=${user.id}`);
      if (docsRes.ok) setDocuments(await docsRes.json());
    } else {
      toast.error('Erro ao remover documento.');
    }
  };

  const handleValidateDocument = async (docId: number) => {
    setValidating(true);
    try {
      const res = await fetch('/api/gemini/validateDocument', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.result === 'válido') {
        await fetch(`/api/document?id=${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ validated: true }),
        });
        toast.success('Documento validado com sucesso!');
      } else {
        toast.error('Documento inválido para o CPF cadastrado.');
      }
      if (user && user.id) {
        const docsRes = await fetch(`/api/document?userId=${user.id}`);
        if (docsRes.ok) setDocuments(await docsRes.json());
      }
    } catch {
      toast.error('Erro ao validar documento.');
    }
    setValidating(false);
  };

  // Mostra o componente de loading enquanto os dados iniciais estão sendo carregados
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {(loading || docLoading || validating) && <Loading />}
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-xl bg-gray-900/80 rounded-2xl shadow-2xl border border-purple-800/30 p-8 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-purple-600 mb-8 text-center">
            Meu Perfil
          </h1>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Image
                  src={preview}
                  alt="Foto do usuário"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-purple-600 shadow-lg object-cover w-32 h-32"
                />
                <Button
                  type="button"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="absolute bottom-2 right-2 bg-purple-700 hover:bg-purple-600 text-white rounded-full p-2 shadow-md transition-all border-2 border-white/80"
                  title="Alterar foto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 01.75.75v6.5a.75.75 0 01-.75.75h-2A2.25 2.25 0 012.5 17.25v-10.5A2.25 2.25 0 014.75 4.5h14.5A2.25 2.25 0 0121.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-2a.75.75 0 01-.75-.75v-6.5a.75.75 0 01.75-.75h.75a.75.75 0 00.75-.75V7.5a.75.75 0 00-.75-.75H6.75A.75.75 0 006 7.5v3.75c0 .414.336.75.75.75h.75z"
                    />
                  </svg>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <span className="text-gray-400 text-sm">
                Clique no ícone para alterar a foto
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-purple-300 font-semibold">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="bg-gray-800 border border-purple-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address"
                className="text-purple-300 font-semibold"
              >
                Endereço
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                className="bg-gray-800 border border-purple-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="cpf" className="text-purple-300 font-semibold">
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                value={form.cpf}
                onChange={handleChange}
                className="bg-gray-800 border border-purple-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
                maxLength={14}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all text-lg focus-visible:ring-2 focus-visible:ring-purple-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (user) {
                    setForm({
                      name: user.name || '',
                      address: user.address || '',
                      cpf: user.cpf || '',
                      photo: user.photo || '/avatar-default.png',
                    });
                    setPreview(user.photo || '/avatar-default.png');
                  }
                }}
                disabled={loading}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 rounded-lg shadow-md transition-all text-lg border border-purple-800 focus-visible:ring-2 focus-visible:ring-purple-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancelar
              </Button>
            </div>
          </form>
          {/* Documentos */}
          <div className="w-full mt-10">
            <h2 className="text-xl font-bold text-purple-400 mb-4">
              Documentos
            </h2>
            <p className="text-gray-300 mb-2">
              Envie o documento do seu CPF para validação
            </p>
            <form
              onSubmit={handleDocumentUpload}
              className="flex flex-col gap-4 items-stretch mb-6"
            >
              <input
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                ref={docInputRef}
                className="bg-gray-800 border border-purple-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
                required
                disabled={documents.length > 0}
              />
              <button
                type="submit"
                disabled={docLoading || documents.length > 0}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all text-base focus-visible:ring-2 focus-visible:ring-purple-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {docLoading ? 'Enviando...' : 'Enviar Documento'}
              </button>
            </form>
            <div className="space-y-3">
              {documents.length === 0 && (
                <div className="text-gray-400">
                  Nenhum documento enviado ainda.
                </div>
              )}
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-gray-800 rounded-lg px-4 py-3 border border-purple-800/40 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-gray-200 font-medium">
                      {doc.url.split('/').pop()}
                    </span>
                    <div className="flex gap-2 items-center">
                      <Link
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 underline text-xs px-2"
                      >
                        <Button
                          type="button"
                          className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          Visualizar
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        className="bg-purple-800 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer"
                        disabled={doc.validated || validating}
                        onClick={() => handleValidateDocument(doc.id)}
                      >
                        {validating ? 'Validando...' : 'Validar'}
                      </Button>
                      <Button
                        type="button"
                        className="bg-red-700 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer"
                        onClick={() => handleRemoveDocument(doc.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-1 ${
                      doc.validated
                        ? 'bg-green-700 text-green-200'
                        : 'bg-yellow-700 text-yellow-200'
                    }`}
                  >
                    {doc.validated ? 'Validado' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
