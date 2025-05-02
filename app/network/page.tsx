'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import {
  Youtube,
  Linkedin,
  Twitch,
  Twitter,
  Instagram,
  Share2,
} from 'lucide-react';
import Loading from '@/components/Loading'; // Ajuste o caminho conforme a estrutura do seu projeto

interface Team {
  id: number;
  name: string;
  logo?: string;
}

export default function NetworkPage() {
  const [bio, setBio] = useState('');
  const [youtube, setYoutube] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitch, setTwitch] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSocial() {
      const res = await fetch('/api/social', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setBio(data.bio || '');
        setYoutube(data.youtube || '');
        setLinkedin(data.linkedin || '');
        setTwitch(data.twitch || '');
        setTwitter(data.twitter || '');
        setInstagram(data.instagram || '');
        setAllTeams(data.allTeams || []);
        if (data.teams && Array.isArray(data.teams)) {
          setSelectedTeams(data.teams.map((t: Team) => t.id));
        } else {
          setSelectedTeams([]);
        }
      }
    }
    fetchSocial();
  }, []);

  const handleTeamSelect = (id: number) => {
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio,
        youtube,
        linkedin,
        twitch,
        twitter,
        instagram,
        teamIds: selectedTeams,
      }),
    });
    if (res.ok) {
      toast.success('Dados salvos com sucesso!');
    } else {
      toast.error('Erro ao salvar dados');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 flex flex-col items-center py-12 px-4">
      {loading && <Loading message="Salvando dados..." />}
      <div className="w-full max-w-xl bg-gray-900/80 rounded-2xl shadow-2xl border border-purple-800/30 p-8 flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-8 w-full">
          <Share2 className="w-7 h-7 text-purple-500" />
          <h1 className="text-3xl md:text-4xl font-bold font-display text-purple-600 text-center m-0">
            Minha Network
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div>
            <label className="text-purple-300 font-semibold mb-1 block">
              Breve descrição
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-gray-800 border border-purple-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[80px]"
              maxLength={300}
              placeholder="Conte um pouco sobre você..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative flex items-center">
              <span className="absolute left-3">
                <Youtube size={20} className="text-red-600" />
              </span>
              <Input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="YouTube"
                className="bg-gray-800 border border-purple-700 text-gray-100 pl-10"
              />
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3">
                <Linkedin size={20} className="text-blue-700" />
              </span>
              <Input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="LinkedIn"
                className="bg-gray-800 border border-purple-700 text-gray-100 pl-10"
              />
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3">
                <Twitch size={20} className="text-purple-500" />
              </span>
              <Input
                type="url"
                value={twitch}
                onChange={(e) => setTwitch(e.target.value)}
                placeholder="Twitch"
                className="bg-gray-800 border border-purple-700 text-gray-100 pl-10"
              />
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3">
                <Twitter size={20} className="text-sky-400" />
              </span>
              <Input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="Twitter"
                className="bg-gray-800 border border-purple-700 text-gray-100 pl-10"
              />
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3">
                <Instagram size={20} className="text-pink-500" />
              </span>
              <Input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram"
                className="bg-gray-800 border border-purple-700 text-gray-100 pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-purple-300 font-semibold mb-2 block">
              Times do coração
            </label>
            <div className="flex flex-wrap gap-3">
              {allTeams.map((team) => (
                <Button
                  type="button"
                  key={team.id}
                  onClick={() => handleTeamSelect(team.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-semibold
                    ${
                      selectedTeams.includes(team.id)
                        ? 'bg-purple-700 border-purple-500 text-white shadow-lg'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-purple-900/40'
                    }
                  `}
                >
                  {team.logo && (
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  )}
                  {team.name}
                </Button>
              ))}
            </div>
            {selectedTeams.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {allTeams
                  .filter((t) => selectedTeams.includes(t.id))
                  .map((team) => (
                    <span
                      key={team.id}
                      className="flex items-center gap-2 bg-purple-800/80 text-white px-3 py-1 rounded-full text-xs"
                    >
                      {team.logo && (
                        <Image
                          src={team.logo}
                          alt={team.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      )}
                      {team.name}
                    </span>
                  ))}
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all text-lg focus-visible:ring-2 focus-visible:ring-purple-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar Dados'}
          </Button>
        </form>
      </div>
    </div>
  );
}
