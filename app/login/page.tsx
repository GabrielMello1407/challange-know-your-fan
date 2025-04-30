import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black py-16 px-4">
      <div className="w-full max-w-md bg-gray-900/90 rounded-2xl shadow-2xl border border-purple-800/30 p-8">
        <h1 className="text-3xl font-bold font-display text-purple-600 mb-6 text-center">
          Entrar na sua conta
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
