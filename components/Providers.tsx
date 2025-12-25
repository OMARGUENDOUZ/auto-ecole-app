'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToasterProvider } from './ToasterProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToasterProvider />
    </QueryClientProvider>
  );
}
