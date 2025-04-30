import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const socialSchema = z.object({
  userId: z.number(),
  provider: z.string(),
  accountId: z.string(),
  username: z.string(),
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = socialSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }
  const { userId, provider, accountId, username } = parsed.data;
  const social = await prisma.socialAccount.create({
    data: { userId, provider, accountId, username },
  });
  return NextResponse.json(social);
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId)
    return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });
  const socials = await prisma.socialAccount.findMany({
    where: { userId: Number(userId) },
  });
  return NextResponse.json(socials);
}
