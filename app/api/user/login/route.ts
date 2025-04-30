import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: 'Usuário não encontrado.' },
      { status: 400 },
    );
  }
  if (!user.isActive) {
    return NextResponse.json(
      { error: 'Conta desativada. Entre em contato com o suporte.' },
      { status: 403 },
    );
  }
  const valid = await bcrypt.compare(password, user.password!);
  if (!valid) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 400 });
  }
  if (!user.emailConfirmed) {
    return NextResponse.json(
      { error: 'Confirme seu e-mail antes de acessar.' },
      { status: 400 },
    );
  }
  // Retorne apenas dados seguros
  return NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
