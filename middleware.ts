import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/verifyToken';
import { JWTPayload } from 'jose';

// Estender NextRequest para incluir user
interface AuthRequest extends NextRequest {
  user?: JWTPayload;
}

// Lista de rotas públicas (acessíveis sem autenticação)
const publicRoutes = ['/', '/login', '/cadastro'];

// Lista de rotas de autenticação (bloqueadas se logado)
const authRoutes = ['/login', '/cadastro'];

// Middleware consolidado
export async function middleware(req: AuthRequest) {
  const token = req.cookies.get('token')?.value; // Busca o token do cookie
  const { pathname } = req.nextUrl; // Obtém o caminho da URL

  // Verifica se a rota é de autenticação
  if (authRoutes.includes(pathname)) {
    if (token) {
      try {
        await verifyToken(token); // Verifica se o token é válido
        // Usuário está logado, redireciona para a página inicial
        return NextResponse.redirect(new URL('/', req.url));
      } catch {
        // Token inválido, permite acesso às rotas de autenticação
        return NextResponse.next();
      }
    }
    // Sem token, permite acesso às rotas de autenticação
    return NextResponse.next();
  }

  // Verifica se a rota é pública
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next(); // Permite acesso sem verificação adicional
  }

  // Para rotas protegidas, verifica o token
  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    // Adiciona o payload ao request para uso posterior na rota
    req.user = payload;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 },
    );
  }
}

// Configuração do matcher para aplicar o middleware às rotas desejadas
export const config = {
  matcher: [
    '/login',
    '/cadastro',
    '/dashboard/:path*',
    '/perfil/:path*',
    // Adicione outras rotas protegidas ou públicas conforme necessário
  ],
};
