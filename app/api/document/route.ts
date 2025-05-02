import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import Busboy from 'busboy';
import { jwtVerify } from 'jose';
import fs from 'fs/promises';

const prisma = new PrismaClient();
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

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.includes('multipart/form-data')) {
    return NextResponse.json(
      { error: 'Requisição deve ser multipart/form-data' },
      { status: 400 },
    );
  }
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  let filePath = '';
  let type = '';
  let fileProcessed = false;
  let filePromise: Promise<void> | null = null;

  await new Promise<void>((resolve, reject) => {
    const busboy = Busboy({ headers: { 'content-type': contentType } });
    busboy.on('field', (name, value) => {
      if (name === 'type') type = value;
    });
    busboy.on('file', (name, file, info) => {
      if (fileProcessed) return;
      fileProcessed = true;
      filePromise = new Promise<void>((fileResolve, fileReject) => {
        const ext = path.extname(info.filename || '').toLowerCase();
        if (
          ext !== '.pdf' &&
          ext !== '.png' &&
          ext !== '.jpg' &&
          ext !== '.jpeg'
        ) {
          file.resume();
          fileReject(
            new Error('Formato não suportado. Envie PDF, PNG ou JPG.'),
          );
          return;
        }
        const chunks: Buffer[] = [];
        file.on('data', (chunk: Buffer) => chunks.push(chunk));
        file.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            const uploadDir = path.join(
              process.cwd(),
              'public',
              'uploads',
              'documents',
            );
            await mkdir(uploadDir, { recursive: true });
            const fileName = `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 8)}${ext}`;
            const fullPath = path.join(uploadDir, fileName);
            await writeFile(fullPath, buffer);
            filePath = `/uploads/documents/${fileName}`;
            fileResolve();
          } catch (err) {
            fileReject(err);
          }
        });
      });
    });
    busboy.on('finish', async () => {
      if (filePromise) {
        try {
          await filePromise;
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        resolve();
      }
    });
    busboy.on('error', (err: Error) => reject(err));
    req.body
      ?.pipeTo(
        new WritableStream({
          write(chunk) {
            busboy.write(chunk);
          },
          close() {
            busboy.end();
          },
        }),
      )
      .catch(reject);
  });

  if (!filePath) {
    return NextResponse.json(
      { error: 'Arquivo não enviado.' },
      { status: 400 },
    );
  }

  const doc = await prisma.document.create({
    data: { userId, url: filePath, type, validated: false },
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

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { error: 'ID do documento obrigatório.' },
      { status: 400 },
    );
  }
  const doc = await prisma.document.findUnique({ where: { id: id } });
  if (!doc) {
    return NextResponse.json(
      { error: 'Documento não encontrado.' },
      { status: 404 },
    );
  }
  // Remove do banco
  await prisma.document.delete({ where: { id: id } });
  // Remove o arquivo físico
  if (doc.url) {
    const filePath = path.join(process.cwd(), 'public', doc.url);
    try {
      await fs.unlink(filePath);
    } catch {
      // Arquivo pode já ter sido removido, ignora erro
    }
  }
  return NextResponse.json({ success: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
