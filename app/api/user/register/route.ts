/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendMail } from '@/lib/mailer';
import prismadb from '@/lib/prismadb';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  address: z.string(),
  cpf: z.string().min(11).max(14),
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }
  const { name, email, password, address, cpf } = parsed.data;
  const existing = await prismadb.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: 'E-mail já cadastrado.' },
      { status: 400 },
    );
  }
  const hashed = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString('hex');

  let photoPath = '/uploads/avatars/avatar-default.png';
  // Next.js API routes do not parse multipart/form-data by default.
  // If you expect file uploads, you need to parse FormData manually or use a library.
  // For now, safely check for req.body and file property.
  const file = (req as any).body?.file;
  if (file && file.size > 0) {
    const ext = path.extname(file.name).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return NextResponse.json(
        { error: 'Formato de imagem não suportado. Envie JPG ou PNG.' },
        { status: 400 },
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    photoPath = `/uploads/avatars/${fileName}`;
  }

  const createdUser = await prismadb.user.create({
    data: {
      name,
      email,
      password: hashed,
      address,
      cpf,
      isActive: false,
      emailConfirmed: false,
      emailToken: token,
      photo: photoPath,
    },
  });
  const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/confirm?token=${token}`;
  await sendMail({
    to: email,
    subject: 'Confirme seu e-mail - FURIA KYF',
    html: `
      <!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirme seu e-mail - FURIA KYF</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000; color: #e5e7eb; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111827; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; padding: 20px 0; }
    .header h1 { font-size: 24px; font-weight: bold; color: #9333ea; }
    .content { padding: 20px; text-align: center; }
    .content p { font-size: 16px; line-height: 1.5; color: #d1d5db; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
    .footer a { color: #9333ea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>FURIA KYF</h1>
    </div>
    <div class="content">
      <p>Olá, ${name}!</p>
      <p>Obrigado por se cadastrar na plataforma FURIA Know Your Fan. Para ativar sua conta e começar a explorar todos os recursos, por favor, confirme seu e-mail clicando no botão abaixo:</p>
      <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background-color: #9333ea; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">Confirmar E-mail</a>
      <p>Se você não se cadastrou, ignore este e-mail ou entre em contato conosco.</p>
    </div>
    <div class="footer">
      <p>© 2023 FURIA KYF. Todos os direitos reservados.</p>
      <p><a href="#">Política de Privacidade</a> | <a href="#">Termos de Uso</a></p>
    </div>
  </div>
</body>
</html>
    `,
  });
  return NextResponse.json({
    success: true,
    message: 'Cadastro realizado! Verifique seu e-mail para confirmar.',
    userId: createdUser.id,
  });
}
