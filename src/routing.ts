// src/routing.ts
export const routing = {
  locales: ['fr', 'ar'] as const,
  defaultLocale: 'fr' as const
};

export type Locale = (typeof routing.locales)[number];

export function isRtlLocale(locale: string): boolean {
  return locale === 'ar';
}
