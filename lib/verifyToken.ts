import { JWTPayload, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
// Função para validar o token
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as JWTPayload; // Retorna o payload do token
  } catch {
    throw new Error('Token inválido ou expirado');
  }
}
