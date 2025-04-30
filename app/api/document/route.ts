import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { validateDocumentAI } from '@/lib/ai';

const prisma = new PrismaClient();

const documentSchema = z.object({
  userId: z.number(),
  url: z.string().url(),
  type: z.string(),
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = documentSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }
  const { userId, url, type } = parsed.data;
  // Validação AI (mock)
  const validated = await validateDocumentAI(url, type);
  const doc = await prisma.document.create({
    data: { userId, url, type, validated },
  });
  return NextResponse.json(doc);
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId)
    return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });
  const userIdNumber = Number(userId);
  if (isNaN(userIdNumber)) {
    return NextResponse.json(
      { error: 'userId deve ser um número' },
      { status: 400 },
    );
  }
  const docs = await prisma.document.findMany({
    where: { userId: userIdNumber },
  });
  return NextResponse.json(docs);
}
