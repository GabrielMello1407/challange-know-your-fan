'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UserAvatarDropdownProps {
  photo?: string;
  name?: string;
  onLogout?: () => void;
}

const defaultAvatar = '/Uploads/avatars/avatar-default.png';

const getPhotoUrl = (photo?: string) => {
  if (!photo) return defaultAvatar;
  if (photo.startsWith('/')) return photo;
  return '/' + photo;
};

const UserAvatarDropdown: React.FC<UserAvatarDropdownProps> = ({
  photo,
  name,
  onLogout,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menu do usuário"
        type="button"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-600 flex items-center justify-center bg-gray-800">
          <Image
            src={getPhotoUrl(photo)}
            alt={name || 'Avatar do usuário'}
            width={40}
            height={40}
            className="object-cover w-10 h-10 rounded-full"
            priority
          />
        </div>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-purple-700 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <div className="px-4 py-3 border-b border-purple-800">
            <span className="block text-sm text-gray-200 font-semibold">
              {name || 'Usuário'}
            </span>
          </div>
          <ul className="py-1">
            <li>
              <Link
                href="/perfil"
                className="block px-4 py-2 text-sm text-gray-100 hover:bg-purple-800/40 rounded transition-colors"
              >
                Perfil
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  console.log('Botão "Sair" clicado');
                  if (onLogout) onLogout();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-purple-800/40 rounded transition-colors"
              >
                Sair
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserAvatarDropdown;
