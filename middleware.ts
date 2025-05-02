import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/verifyToken';
import { JWTPayload } from 'jose';

interface AuthRequest extends NextRequest {
  user?: JWTPayload;
}

const publicRoutes = ['/', '/login', '/cadastro'];

const authRoutes = ['/login', '/cadastro'];

export async function middleware(req: AuthRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  if (authRoutes.includes(pathname)) {
    if (token) {
      try {
        await verifyToken(token);
        return NextResponse.redirect(new URL('/', req.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    req.user = payload;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: [
    '/login',
    '/cadastro',
    '/network',
    '/dashboard/:path*',
    '/perfil/:path*',
  ],
};
