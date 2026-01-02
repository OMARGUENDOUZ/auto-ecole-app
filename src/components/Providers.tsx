'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ToasterProvider } from './ToasterProvider';
import { queryClient } from '@/src/lib/queryClient';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToasterProvider />
    </QueryClientProvider>
  );
}
