import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/src/routing';

export const middleware = createMiddleware(routing);

export const config = {
  matcher: ['/', '/((?!_next|api|.*\\..*).*)'],
};
