import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserIdFromToken(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.id as number;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const social = await prismadb.socialItems.findUnique({
    where: { userId },
  });
  // Busca times do coração
  const favoriteTeams = await prismadb.userFavoriteTeam.findMany({
    where: { userId },
    include: { team: true },
  });
  // Busca todos os times disponíveis
  const allTeams = await prismadb.team.findMany();
  return NextResponse.json({
    ...social,
    teams: favoriteTeams.map((ft) => ft.team),
    allTeams,
  });
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const body = await req.json();
  const { bio, youtube, linkedin, twitch, twitter, instagram, teamIds } = body;
  // Upsert: cria ou atualiza SocialItems do usuário
  const social = await prismadb.socialItems.upsert({
    where: { userId },
    update: { bio, youtube, linkedin, twitch, twitter, instagram },
    create: { bio, youtube, linkedin, twitch, twitter, instagram, userId },
  });
  // Atualiza times do coração
  if (Array.isArray(teamIds)) {
    // Remove todos os times antigos
    await prismadb.userFavoriteTeam.deleteMany({ where: { userId } });
    // Adiciona os novos
    for (const teamId of teamIds) {
      await prismadb.userFavoriteTeam.create({ data: { userId, teamId } });
    }
  }
  // Busca times atualizados
  const favoriteTeams = await prismadb.userFavoriteTeam.findMany({
    where: { userId },
    include: { team: true },
  });
  return NextResponse.json({
    ...social,
    teams: favoriteTeams.map((ft) => ft.team),
  });
}
