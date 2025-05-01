import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: false,
    maxAge: 0,
  });
  console.log('Cookie "token" limpo no logout');
  return response;
}
