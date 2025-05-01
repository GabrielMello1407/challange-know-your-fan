import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prismadb from '@/lib/prismadb';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const user = await prismadb.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: 'Usuário não encontrado.' },
      { status: 400 },
    );
  }
  if (!user.isActive) {
    return NextResponse.json({ error: 'Conta desativada.' }, { status: 403 });
  }
  const valid = await bcrypt.compare(password, user.password!);
  if (!valid) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 400 });
  }
  if (!user.emailConfirmed) {
    return NextResponse.json(
      { error: 'Confirme seu e-mail.' },
      { status: 400 },
    );
  }

  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET_KEY);

  const response = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
    },
  });
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: false, // Em dev, false; em prod, true
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
  console.log('Cookie "token" definido:', token); // Log para verificar
  return response;
}
