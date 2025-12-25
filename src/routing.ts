export const routing = {
  locales: ['fr', 'ar'],
  defaultLocale: 'fr',
};

export type Locale = (typeof routing.locales)[number];
