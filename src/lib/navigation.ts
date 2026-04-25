import { routing } from '@/src/routing';

export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && routing.locales.includes(firstSegment as (typeof routing.locales)[number])) {
    return firstSegment;
  }
  return routing.defaultLocale;
}

export function getLocalizedLoginPath(pathname?: string): string {
  const locale = getLocaleFromPathname(pathname || '');
  return `/${locale}/auth/login`;
}
