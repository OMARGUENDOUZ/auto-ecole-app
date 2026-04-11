import Link from 'next/link';
import { FileSearch } from 'lucide-react';

/**
 * Page 404 pour le layout [locale].
 * Affichée automatiquement par Next.js quand notFound() est appelé
 * ou quand aucune route ne correspond dans ce segment.
 *
 * Note : ce composant est un Server Component (pas de 'use client').
 */
export default function LocaleNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-6 max-w-md">
        {/* Icône */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <FileSearch className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>

        {/* Titre et message */}
        <div className="space-y-2">
          <p className="text-6xl font-extrabold text-muted-foreground/40">404</p>
          <h1 className="text-2xl font-bold text-foreground">Page introuvable</h1>
          <p className="text-muted-foreground">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/fr/dashboard"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-border text-foreground rounded-md font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
