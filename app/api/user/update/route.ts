/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prismadb from '@/lib/prismadb';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import Busboy from 'busboy';
import { jwtVerify, SignJWT } from 'jose';

const updateSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  cpf: z.string().min(11).max(14).optional(),
});

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserIdFromToken(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.id as string;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const user = await prismadb.user.findUnique({
    where: { id: Number(userId) },
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
    address: user.address,
    cpf: user.cpf,
    photo: user.photo,
    email: user.email,
  });
}

export async function PUT(req: NextRequest) {
  try {
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
    const busboy = Busboy({ headers: { 'content-type': contentType } });
    const fields: Record<string, string> = {};
    let photoPath: string | undefined;
    let fileProcessed = false;
    let filePromise: Promise<void> | null = null;

    await new Promise<void>((resolve, reject) => {
      busboy.on('field', (name, value) => {
        fields[name] = value;
      });
      busboy.on('file', (name, file, info) => {
        if (name !== 'photo') return;
        if (fileProcessed) return;
        fileProcessed = true;
        filePromise = new Promise<void>((fileResolve, fileReject) => {
          const ext = path.extname(info.filename || '').toLowerCase();
          if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            file.resume();
            fileReject(
              new Error('Formato de imagem não suportado. Envie JPG ou PNG.'),
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
                'avatars',
              );
              await mkdir(uploadDir, { recursive: true });
              const fileName = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 8)}${ext}`;
              const filePath = path.join(uploadDir, fileName);
              await writeFile(filePath, buffer);
              photoPath = `/uploads/avatars/${fileName}`;
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

    const parsed = updateSchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    const data: any = { ...parsed.data };
    if (photoPath) data.photo = photoPath;
    else {
      // Se não foi enviada nova foto, mantém a foto atual
      const currentUser = await prismadb.user.findUnique({
        where: { id: Number(userId) },
      });
      if (currentUser && currentUser.photo) {
        data.photo = currentUser.photo;
      }
    }
    const updatedUser = await prismadb.user.update({
      where: { id: Number(userId) },
      data,
    });

    // Gera novo token JWT com dados atualizados
    const newToken = await new SignJWT({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET_KEY);

    const response = NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      address: updatedUser.address,
      cpf: updatedUser.cpf,
      photo: updatedUser.photo,
      email: updatedUser.email,
    });
    response.cookies.set({
      name: 'token',
      value: newToken,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false, // Em dev, false; em prod, true
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
