import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ReactQueryDevtoolsLazy } from '@/app/providers/reactQueryDevtools';

import type { PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtoolsLazy />
    </QueryClientProvider>
  );
}
