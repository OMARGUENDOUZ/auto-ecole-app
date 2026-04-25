// app/[locale]/layout.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';


import { routing, isRtlLocale, type Locale } from '@/src/routing';
import { ErrorBoundaryWrapper } from '@/src/components/ErrorBoundaryWrapper';
import Providers from '@/src/components/Providers';

export const metadata: Metadata = {
  title: 'Auto-Ecole - Gestion',
  description: 'Plateforme de gestion pour auto-ecoles'
};

export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'ar' }];
}

export default async function LocaleLayout({
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

  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const dir = isRtlLocale(typedLocale) ? 'rtl' : 'ltr';
  const messages = await getMessages();

  return (
    <div dir={dir} className={dir === 'rtl' ? 'font-arabic min-h-screen' : 'min-h-screen'}>
      <ErrorBoundaryWrapper>
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </ErrorBoundaryWrapper>
    </div>
  );
}
