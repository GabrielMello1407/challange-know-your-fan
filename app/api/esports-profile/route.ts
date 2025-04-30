import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validateEsportsProfileAI } from '@/lib/ai';

const prisma = new PrismaClient();

const esportsProfileSchema = z.object({
  userId: z.number(),
  url: z.string().url(),
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = esportsProfileSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }
  const { userId, url } = parsed.data;
  // Validação AI (mock)
  const validated = await validateEsportsProfileAI(url);
  const profile = await prisma.esportsProfile.create({
    data: { userId, url, validated },
  });
  return NextResponse.json(profile);
}

export async function GET(req: NextRequest) {
  const userIdParam = req.nextUrl.searchParams.get('userId');
  if (!userIdParam)
    return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });
  const userId = Number(userIdParam);
  if (isNaN(userId))
    return NextResponse.json(
      { error: 'userId deve ser um número' },
      { status: 400 },
    );
  const profiles = await prisma.esportsProfile.findMany({ where: { userId } });
  return NextResponse.json(profiles);
}
