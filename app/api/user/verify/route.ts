import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/verifyToken';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  console.log('Token recebido em /api/user/verify:', token);

  if (!token) {
    console.log('Nenhum token encontrado nos cookies');
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    console.log('Payload decodificado:', payload);
    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        photo: payload.photo,
      },
    });
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
