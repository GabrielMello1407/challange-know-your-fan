import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black py-16 px-4">
      <div className="w-full max-w-md bg-gray-900/90 rounded-2xl shadow-2xl border border-purple-800/30 p-8">
        <h1 className="text-3xl font-bold font-display text-purple-600 mb-6 text-center">
          Crie sua conta
        </h1>
        <RegisterForm />
        <div className="text-center mt-4 justify-center items-center">
          <p className="text-purple-600 font-semibold">
            Já possui conta? {''}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-200 font-semibold"
            >
              Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
