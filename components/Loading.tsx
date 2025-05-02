import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <span
          className="relative flex h-16 w-16 mb-4"
          role="status"
          aria-label="Carregando"
        >
          <span className="animate-spin absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-purple-600 via-purple-400 to-purple-800 opacity-30"></span>
          <span className="relative inline-flex rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent animate-spin"></span>
        </span>
        <span className="text-lg text-gray-200 font-semibold drop-shadow">
          {message}
        </span>
      </div>
    </div>
  );
};

export default Loading;
