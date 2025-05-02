import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/providers/authContext';

export const metadata: Metadata = {
  title: 'Know Your Fan',
  description: 'Desenvolvido por Gabriel Mello, o futuro integrante FURIOSO',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true" className="bg-black">
        <AuthProvider>
          <Toaster position="top-right" />
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
