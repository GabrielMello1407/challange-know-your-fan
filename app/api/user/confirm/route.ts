import prismadb from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json(
      { error: 'Token não informado.' },
      { status: 400 },
    );
  }
  const user = await prismadb.user.findFirst({ where: { emailToken: token } });
  if (!user) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 400 });
  }
  await prismadb.user.update({
    where: { id: user.id },
    data: { emailConfirmed: true, emailToken: null, isActive: true },
  });

  // Retornar HTML básico
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-mail Confirmado</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(to bottom, #000000, #1a1a1a);
          color: #e5e7eb;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          background: rgba(31, 41, 55, 0.8);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(147, 51, 234, 0.3);
        }
        h1 {
          color: #9333ea;
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.125rem;
          color: #d1d5db;
        }
        a {
          color: #d8b4fe;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>E-mail Confirmado!</h1>
        <p>Seu e-mail foi confirmado com sucesso. Agora você pode aproveitar todos os recursos da plataforma!</p>
        <p><a href="/">Voltar para a página inicial</a></p>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
