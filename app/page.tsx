import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-100 flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center text-center py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-700/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-900/40 rounded-full blur-2xl animate-glow" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold font-display mb-6 tracking-tight">
          <span className="text-purple-600 drop-shadow">FURIA</span>{' '}
          <span className="text-gray-100">Know Your Fan</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">
          A plataforma definitiva para conectar fãs e organizações de e-sports.
          <br />
          Cadastre-se, personalize seu perfil, valide sua identidade e mostre
          sua paixão pelo universo gamer!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/cadastro"
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all text-lg focus-visible:ring-2 focus-visible:ring-purple-600"
          >
            Comece agora
          </Link>
          <a
            href="#features"
            className="bg-gray-800 hover:bg-purple-700/80 text-purple-200 font-semibold py-3 px-8 rounded-lg shadow-md transition-all text-lg border border-purple-800 focus-visible:ring-2 focus-visible:ring-purple-600"
          >
            Ver recursos
          </a>
        </div>
        <div className="flex justify-center gap-8 mb-10">
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-purple-500 mb-2 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 20v-6m0 0V4m0 10l-4-4m4 4l4-4" />
            </svg>
            <span className="text-sm text-gray-400">Cadastro rápido</span>
          </div>
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-purple-500 mb-2 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            <span className="text-sm text-gray-400">Validação por IA</span>
          </div>
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-purple-500 mb-2 animate-spin-slow"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-sm text-gray-400">Integração social</span>
          </div>
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-purple-500 mb-2 animate-glow"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="4" />
              <path d="M8 8h8v8H8z" />
            </svg>
            <span className="text-sm text-gray-400">Perfil e-sports</span>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/furia-bg.jpg"
            alt="Mockup da Plataforma"
            width={600}
            height={600}
          />
        </div>
      </section>
      <section id="features" className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-purple-600 mb-8 text-center">
          Recursos da Plataforma
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Cadastro e Perfil
            </h3>
            <p className="text-gray-400">
              Crie seu perfil, adicione informações pessoais, interesses e
              personalize sua experiência.
            </p>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Validação de Documentos
            </h3>
            <p className="text-gray-400">
              Faça upload de documentos e valide sua identidade com tecnologia
              de IA.
            </p>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Integração com Redes Sociais
            </h3>
            <p className="text-gray-400">
              Vincule suas redes sociais e mostre sua presença no universo
              gamer.
            </p>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Perfis e-Sports
            </h3>
            <p className="text-gray-400">
              Compartilhe links de perfis em sites de e-sports e valide seu
              engajamento.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-purple-600 mb-8 text-center">
          Como Funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg">
            <svg
              className="w-10 h-10 text-purple-500 mb-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 20v-6m0 0V4m0 10l-4-4m4 4l4-4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              1. Cadastre-se
            </h3>
            <p className="text-gray-400">
              Crie sua conta e personalize seu perfil de fã.
            </p>
          </div>
          <div className="flex flex-col items-center bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg">
            <svg
              className="w-10 h-10 text-purple-500 mb-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              2. Valide sua Identidade
            </h3>
            <p className="text-gray-400">
              Faça upload de documentos e valide com IA para garantir segurança.
            </p>
          </div>
          <div className="flex flex-col items-center bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg">
            <svg
              className="w-10 h-10 text-purple-500 mb-4 animate-spin-slow"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              3. Conecte suas Redes
            </h3>
            <p className="text-gray-400">
              Vincule redes sociais e compartilhe seu perfil com a Comunidade.
            </p>
          </div>
        </div>
      </section>

      <section id="documentos" className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-purple-600 mb-8 text-center">
          Documentos
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex-1 bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg flex flex-col items-center">
            <svg
              className="w-12 h-12 text-purple-500 mb-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 8h8v8H8z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Upload Seguro
            </h3>
            <p className="text-gray-400 text-center">
              Envie seus documentos com segurança e privacidade garantidas.
            </p>
          </div>
          <div className="flex-1 bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg flex flex-col items-center">
            <svg
              className="w-12 h-12 text-purple-500 mb-4 animate-glow"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2 2 4-4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Validação por IA
            </h3>
            <p className="text-gray-400 text-center">
              Tecnologia de inteligência artificial para validar sua identidade.
            </p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-purple-600 mb-8 text-center">
          Depoimentos
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg flex flex-col items-center min-h-[300px]">
            <Image
              src="/brino.jpg"
              alt="Avatar"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full mb-4 border-2 border-purple-600 object-cover"
            />
            <p className="text-gray-300 italic mb-2 text-center">
              “A plataforma da FURIA KYF revolucionou minha experiência como fã.
              Agora me sinto parte da organização!”
            </p>
            <div className="flex-1 flex items-end">
              <span className="text-purple-400 font-semibold block mt-4">
                @brino
              </span>
            </div>
          </div>
          <div className="bg-gray-900/80 rounded-xl p-8 border border-purple-800/30 shadow-lg flex flex-col items-center min-h-[300px]">
            <Image
              width={64}
              height={64}
              src="/fallen.jpg"
              alt="Avatar"
              className="w-16 h-16 rounded-full mb-4 border-2 border-purple-600 object-cover"
            />
            <p className="text-gray-300 italic mb-2 text-center">
              “Muito fácil de usar, seguro e com recursos incríveis para quem
              ama e-sports!”
            </p>
            <div className="flex-1 flex items-end">
              <span className="text-purple-400 font-semibold block mt-4">
                @fallen
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
