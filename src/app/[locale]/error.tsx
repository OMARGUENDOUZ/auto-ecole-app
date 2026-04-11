'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { logger } from '@/src/lib/logger';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Page d'erreur globale pour le layout [locale].
 * Captée automatiquement par Next.js App Router en cas d'erreur non gérée.
 * Affiche un bouton "Réessayer" et un bouton "Retour à l'accueil".
 */
export default function LocaleError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Loguer l'erreur (no-op en prod pour debug/info)
    logger.error('Erreur non gérée dans le layout [locale]', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-6 max-w-md">
        {/* Icône */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
        </div>

        {/* Titre et message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Une erreur est survenue</h1>
          <p className="text-muted-foreground">
            {process.env.NODE_ENV === 'development'
              ? error.message
              : "Quelque chose s'est mal passé. Notre équipe a été notifiée."}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              Référence : {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Réessayer
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-2.5 border border-border text-foreground rounded-md font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </div>
  );
}
