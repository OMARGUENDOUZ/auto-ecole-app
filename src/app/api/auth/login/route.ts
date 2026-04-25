import { NextRequest, NextResponse } from 'next/server';

/**
 * Route Handler POST /api/auth/login
 * - Appelle le backend Java pour authentifier l'utilisateur
 * - Stocke le JWT dans un cookie HttpOnly Secure SameSite=Strict
 * - N'expose JAMAIS le token au JavaScript client
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080/api/v1';

  let response: Response;
  try {
    response = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000), // timeout 10s cohérent avec axios
    });
  } catch (err) {
    const message =
      err instanceof Error && err.name === 'TimeoutError'
        ? 'La requête vers le serveur a expiré. Veuillez réessayer.'
        : 'Impossible de joindre le serveur. Vérifiez votre connexion.';
    return NextResponse.json({ message }, { status: 503 });
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur de connexion' }));
    return NextResponse.json(error, { status: response.status });
  }

  const data = await response.json();

  // Retourne uniquement les infos utilisateur (pas le token) au client
  const nextResponse = NextResponse.json({ user: data.user });

  nextResponse.cookies.set('auth_token', data.token, {
    httpOnly: true,                                       // inaccessible via document.cookie
    secure: process.env.NODE_ENV === 'production',        // HTTPS uniquement en prod
    sameSite: 'strict',                                   // protection CSRF
    maxAge: 60 * 60 * 24 * 7,                            // 7 jours
    path: '/',
  });

  return nextResponse;
}
