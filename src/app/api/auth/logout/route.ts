import { NextResponse } from 'next/server';

/**
 * Route Handler POST /api/auth/logout
 * - Invalide le cookie HttpOnly auth_token en le réécrivant vide avec maxAge=0
 * - Côté client, appeler ce endpoint puis rediriger vers /login
 */
export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Expiration immédiate → suppression du cookie
    path: '/',
  });

  return response;
}
