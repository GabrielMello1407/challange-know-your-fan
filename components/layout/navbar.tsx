'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-black h-20 flex items-center">
      <div className="container mx-auto flex justify-between items-center px-4 h-full">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <h1 className="text-2xl font-bold font-display tracking-tight text-purple-600 group-hover:scale-105 transition-transform">
              <span className="text-purple-600">FURIA</span>{' '}
              <span className="text-gray-100">KYF</span>
            </h1>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-base text-gray-100 font-medium px-2 py-1 rounded-md transition-colors hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
          >
            Recursos
          </Link>
          <Link
            href="#how-it-works"
            className="text-base text-gray-100 font-medium px-2 py-1 rounded-md transition-colors hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
          >
            Como Funciona
          </Link>
          <Link
            href="#testimonials"
            className="text-base text-gray-100 font-medium px-2 py-1 rounded-md transition-colors hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
          >
            Redes Sociais
          </Link>
          <Link
            href="#testimonials"
            className="text-base text-gray-100 font-medium px-2 py-1 rounded-md transition-colors hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
          >
            Interesses
          </Link>
          <Link
            href="#testimonials"
            className="text-base text-gray-100 font-medium px-2 py-1 rounded-md transition-colors hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
          >
            Documentos
          </Link>
          <Link
            href="#testimonials"
            className="text-base text-gray-100 font-medium px-2 py-1 rounded-md transition-colors hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
          >
            Depoimentos
          </Link>
          <Link href="/cadastro">
            <Button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-600 cursor-pointer">
              Cadastro
            </Button>
          </Link>
        </nav>
        <div className="md:hidden flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`border-purple-700 text-purple-400 hover:bg-purple-900/30 focus-visible:ring-2 focus-visible:ring-purple-600 transition-transform duration-200 ${
              mobileMenuOpen ? 'rotate-90 scale-110' : ''
            }`}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? (
              <X size={28} strokeWidth={2.5} />
            ) : (
              <Menu size={28} strokeWidth={2.5} />
            )}
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-24 bg-black/95 backdrop-blur-xl p-4">
          <div className="w-full max-w-xs rounded-2xl shadow-2xl border border-purple-800/30 bg-gray-900/95 flex flex-col items-center py-8 px-6 relative animate-fade-in-down">
            <button
              className="absolute top-4 right-4 text-purple-400 hover:text-purple-300 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
            <nav className="flex flex-col items-center space-y-6 w-full">
              <Link
                href="#features"
                className="text-lg text-gray-100 font-medium px-4 py-2 rounded-md transition-colors hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-lg text-gray-100 font-medium px-4 py-2 rounded-md transition-colors hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="text-lg text-gray-100 font-medium px-4 py-2 rounded-md transition-colors hover:text-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-md shadow-md mt-4 w-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-600">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
