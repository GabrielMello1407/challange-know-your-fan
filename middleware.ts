import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PROTECTED_PATHS = ['/documentos', '/perfil'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      // Usuário autenticado, segue normalmente
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/documentos/:path*', '/perfil/:path*'],
};
