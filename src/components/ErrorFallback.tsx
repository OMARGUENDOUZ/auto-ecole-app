'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Une erreur s'est produite</CardTitle>
          </div>
          <CardDescription>
            Désolé, quelque chose s'est mal passé. Veuillez réessayer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-mono text-destructive">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={resetErrorBoundary} variant="default">
              Réessayer
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
              variant="outline"
            >
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

