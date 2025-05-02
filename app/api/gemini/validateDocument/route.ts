import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { jwtVerify } from 'jose';
import prismadb from '@/lib/prismadb';
import path from 'path';
import fs from 'fs/promises';
import mime from 'mime';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserIdFromToken(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.id as number;
  } catch (err) {
    console.error('[validateDocument] Erro ao decodificar token:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('[validateDocument] Iniciando validação');
    const userId = await getUserIdFromToken(req);
    console.log('[validateDocument] userId:', userId);
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    const user = await prismadb.user.findUnique({
      where: { id: Number(userId) },
    });
    console.log('[validateDocument] user:', user);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 },
      );
    }
    const doc = await prismadb.document.findFirst({
      where: { userId: Number(userId) },
      orderBy: { id: 'desc' },
    });
    console.log('[validateDocument] doc:', doc);
    if (!doc) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 },
      );
    }
    const ext = path.extname(doc.url).toLowerCase();
    console.log('[validateDocument] ext:', ext);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return NextResponse.json(
        { error: 'Apenas imagens podem ser validadas.' },
        { status: 400 },
      );
    }
    const filePath = path.join(process.cwd(), 'public', doc.url);
    console.log('[validateDocument] filePath:', filePath);
    const fileBuffer = await fs.readFile(filePath);
    const base64Image = `data:${mime.getType(
      filePath,
    )};base64,${fileBuffer.toString('base64')}`;
    const prompt = `Verifique se o CPF presente na imagem/documento corresponde ao CPF: ${user.cpf}. Responda apenas "válido" ou "inválido".`;
    console.log('[validateDocument] prompt:', prompt);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = 'gemini-2.5-pro-exp-03-25';
    const contents = [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mime.getType(filePath) || 'image/jpeg',
            },
          },
        ],
      },
    ];
    const config = { responseMimeType: 'text/plain' };
    console.log('[validateDocument] Enviando para Gemini...');
    const responseStream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let result = '';
    for await (const chunk of responseStream) {
      result += chunk.text;
    }
    result = result.trim().toLowerCase();
    console.log('[validateDocument] result:', result);

    let updatedDoc = doc;
    if (result === 'válido') {
      updatedDoc = await prismadb.document.update({
        where: { id: doc.id },
        data: { validated: true },
      });
    }
    return NextResponse.json({ result, document: updatedDoc });
  } catch (error) {
    console.error('[validateDocument] Erro geral:', error);
    return NextResponse.json(
      { error: 'Erro ao validar documento', details: String(error) },
      { status: 500 },
    );
  }
}
