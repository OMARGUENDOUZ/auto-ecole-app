'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/src/navigation';
import { Button } from '@/src/components/ui/button';
import { LanguageSwitcher } from '@/src/components/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-8">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {"welcome"}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plateforme complète de gestion pour auto-écoles
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/candidats')}
            >
              Acc&eacute;der &agrave; l&apos;application
            </Button>
          </div>
        </div>

        {/* Reste du contenu... */}
      </div>
    </div>
  );
}
