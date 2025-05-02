import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET() {
  const users = await prismadb.user.findMany({
    select: {
      id: true,
      name: true,
      photo: true,
      socialItems: true,
      favoriteTeams: {
        include: { team: true },
      },
    },
  });
  const result = users.map((user) => ({
    id: user.id,
    name: user.name,
    photo: user.photo,
    social: user.socialItems,
    teams: user.favoriteTeams.map((ft) => ft.team),
  }));
  return NextResponse.json(result);
}
