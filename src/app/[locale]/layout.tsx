// app/[locale]/layout.tsx
import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { routing, isRtlLocale, type Locale } from '@/src/routing';
import { ErrorBoundaryWrapper } from '@/src/components/ErrorBoundaryWrapper';
import Providers from '@/src/components/Providers';

import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic'
});

export const metadata: Metadata = {
  title: 'Auto-École - Gestion',
  description: 'Plateforme de gestion pour auto-écoles'
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Active le rendu statique par locale (Next.js App Router + next-intl)
  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const dir = isRtlLocale(typedLocale) ? 'rtl' : 'ltr';

  const messages = (await import(`../../messages/${typedLocale}.json`)).default;

  return (
    <html
      lang={typedLocale}
      dir={dir}
      className={`${inter.variable} ${notoSansArabic.variable}`}
      suppressHydrationWarning
    >
      <body className={dir === 'rtl' ? 'font-arabic' : inter.className}>
        <ErrorBoundaryWrapper>
          <NextIntlClientProvider locale={typedLocale} messages={messages}>
            <Providers>
              {children}
            </Providers>
          </NextIntlClientProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
