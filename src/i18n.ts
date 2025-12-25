import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  const loc = locale ?? routing.defaultLocale;

  // load messages for resolved locale (fallback to default)
  const messages = (await import(`../messages/${loc}.json`)).default;

  return { messages, locale: loc };
});
