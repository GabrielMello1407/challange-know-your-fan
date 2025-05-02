/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Youtube,
  Linkedin,
  Twitch,
  Twitter,
  Instagram,
  Users,
  ArrowLeft,
} from 'lucide-react';
import Loading from '@/components/Loading'; // Ajuste o caminho conforme a estrutura do seu projeto

export default function ComunidadePerfilPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.comunidadeId;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const res = await fetch(`/api/social/${userId}`);
      if (res.ok) {
        setUser(await res.json());
      }
      setLoading(false);
    }
    if (userId) fetchUser();
  }, [userId]);

  if (loading) {
    return <Loading message="Carregando perfil..." />;
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Usuário não encontrado.
      </div>
    );
  }

  const social = user.social || {};
  const redes = [
    { icon: Youtube, label: 'YouTube', value: social.youtube },
    { icon: Linkedin, label: 'LinkedIn', value: social.linkedin },
    { icon: Twitch, label: 'Twitch', value: social.twitch },
    { icon: Twitter, label: 'Twitter', value: social.twitter },
    { icon: Instagram, label: 'Instagram', value: social.instagram },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-gray-900/80 rounded-2xl shadow-2xl border border-purple-800/30 p-8 flex flex-col items-center gap-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-200 mb-2 self-start"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>
        <Image
          src={user.photo || '/avatar-default.png'}
          alt={user.name}
          width={120}
          height={120}
          className="rounded-full border-4 border-purple-600 shadow-lg object-cover w-32 h-32"
        />
        <h1 className="text-2xl md:text-3xl font-bold font-display text-purple-600 text-center">
          {user.name}
        </h1>
        {social.bio && (
          <p className="text-gray-300 text-center text-base md:text-lg max-w-xl">
            {social.bio}
          </p>
        )}
        <div className="flex flex-col gap-2 w-full">
          <span className="text-purple-300 font-semibold flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-purple-400" /> Redes Sociais
          </span>
          <div className="flex flex-wrap gap-3">
            {redes.filter((r) => r.value).length === 0 && (
              <span className="text-gray-400 text-sm">
                Nenhuma rede social informada.
              </span>
            )}
            {redes
              .filter((r) => r.value)
              .map(({ icon: Icon, label, value }) => (
                <a
                  key={label}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-800 border border-purple-700 rounded-lg px-4 py-2 text-gray-100 hover:bg-purple-900/40 transition-all text-sm"
                >
                  <Icon className="w-5 h-5" /> {label}
                </a>
              ))}
          </div>
        </div>
        <div className="w-full">
          <span className="text-purple-300 font-semibold flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-400" /> Times do coração
          </span>
          <div className="flex flex-wrap gap-3">
            {user.teams && user.teams.length > 0 ? (
              user.teams.map((team: any) => (
                <span
                  key={team.id}
                  className="flex items-center gap-2 bg-purple-800/80 text-white px-3 py-1 rounded-full text-xs"
                >
                  {team.logo && (
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={22}
                      height={22}
                      className="rounded-full"
                    />
                  )}
                  {team.name}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">
                Nenhum time do coração informado.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
