import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * QueryClient centralisé avec :
 * - retry uniquement pour les erreurs réseau (ERR_NETWORK) avec exponential backoff
 * - throwOnError: false → les erreurs sont gérées dans onError des mutations/queries
 * - staleTime global de 30s (surchargeable par hook)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      throwOnError: false,
      /**
       * Retry uniquement pour les erreurs réseau (coupure temporaire).
       * Les erreurs HTTP 4xx/5xx ne sont pas retentées (inutile et potentiellement dangereux).
       */
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
          return failureCount < 3;
        }
        return false;
      },
      /**
       * Backoff exponentiel plafonné à 10s :
       * tentative 0 → 1s, tentative 1 → 2s, tentative 2 → 4s, tentative 3 → 8s, etc.
       */
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
    mutations: {
      retry: false,
      throwOnError: false,
    },
  },
});
