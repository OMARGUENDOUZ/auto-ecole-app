'use client';

import { ErrorHandler, type ErrorMessage } from '@/src/lib/errorHandler';

export interface ApiErrorState {
  title: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Hook utilitaire pour transformer une erreur inconnue en état d'affichage structuré.
 *
 * Usage :
 *   const { error } = useMutation(...);
 *   const apiError = useApiError(error);
 *   if (apiError) return <Alert title={apiError.title}>{apiError.message}</Alert>;
 */
export function useApiError(error: unknown): ApiErrorState | null {
  if (!error) return null;

  const handled: ErrorMessage = ErrorHandler.handle(error);

  return {
    title: handled.title,
    message: handled.message,
    fieldErrors: handled.fieldErrors,
  };
}
