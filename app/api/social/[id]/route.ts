import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = Number(id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  const user = await prismadb.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      photo: true,
      socialItems: true,
      favoriteTeams: { include: { team: true } },
    },
  });
  if (!user) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 },
    );
  }
  return NextResponse.json({
    id: user.id,
    name: user.name,
    photo: user.photo,
    social: user.socialItems,
    teams: user.favoriteTeams.map((ft) => ft.team),
  });
}
