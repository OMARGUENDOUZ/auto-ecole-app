'use client';

import React from 'react';
import { logger } from '@/src/lib/logger';

interface Props {
  children: React.ReactNode;
  /** Fallback personnalisé — si absent, un fallback générique est affiché */
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary spécialisé pour capturer les erreurs des composants enfants.
 *
 * Différence avec ErrorBoundary.tsx :
 * - ApiErrorBoundary est léger et utilisé pour encapsuler des sections spécifiques (ex: un widget)
 * - ErrorBoundary est l'enveloppe globale avec UI Cards/Lucide icons
 *
 * Usage :
 *   <ApiErrorBoundary>
 *     <MonComposantQuiPeutEchouer />
 *   </ApiErrorBoundary>
 *
 *   <ApiErrorBoundary fallback={<p>Impossible de charger ce bloc.</p>}>
 *     <MonComposantQuiPeutEchouer />
 *   </ApiErrorBoundary>
 */
export class ApiErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('ApiErrorBoundary a capturé une erreur', { error, componentStack: errorInfo.componentStack });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center rounded-lg border border-red-200 bg-red-50"
        >
          <h2 className="text-xl font-semibold text-red-600 mb-2">Une erreur est survenue</h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'Veuillez rafraîchir la page.'}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
