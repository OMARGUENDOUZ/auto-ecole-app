import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { routing } from '@/src/routing';

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'as-needed'
});

// Routes protégées qui nécessitent une authentification
const protectedRoutes = ['/candidats', '/moniteurs', '/planning-exams', '/rapports'];

export function middleware(request: NextRequest) {
  // D'abord appliquer le middleware i18n
  const response = intlMiddleware(request);
  
  const pathname = request.nextUrl.pathname;
  
  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.includes(route) && !pathname.includes('/auth')
  );
  
  if (isProtectedRoute) {
    // Vérifier le token dans les cookies ou headers
    // Note: En production, utilisez des cookies httpOnly pour plus de sécurité
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Rediriger vers la page de login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Si l'utilisateur est sur /auth/login et déjà authentifié, rediriger vers le dashboard
  if (pathname.includes('/auth/login')) {
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (token) {
      return NextResponse.redirect(new URL('/candidats', request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)']
};
