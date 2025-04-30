import prismadb from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json(
      { error: 'Token não informado.' },
      { status: 400 },
    );
  }
  const user = await prismadb.user.findFirst({ where: { emailToken: token } });
  if (!user) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 400 });
  }
  await prismadb.user.update({
    where: { id: user.id },
    data: { emailConfirmed: true, emailToken: null, isActive: true },
  });
  return NextResponse.json({
    success: true,
    message: 'E-mail confirmado com sucesso!',
  });
}
