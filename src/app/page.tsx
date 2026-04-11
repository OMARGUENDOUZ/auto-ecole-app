import { redirect } from 'next/navigation';

import { routing } from '@/src/routing';

export default function HomeRedirectPage() {
  redirect(`/${routing.defaultLocale}`);
}
