import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    include: {
      interests: true,
      activities: true,
      events: true,
      purchases: true,
      documents: true,
      socialAccounts: true,
      esportsLinks: true,
    },
  });
  return NextResponse.json(users);
}
