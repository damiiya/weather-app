import { lazy, Suspense } from 'react';

const Devtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({
    default: m.ReactQueryDevtools,
  })),
);

export function ReactQueryDevtoolsLazy() {
  if (!import.meta.env.DEV) return null;

  return (
    <Suspense fallback={null}>
      <Devtools initialIsOpen={false} />
    </Suspense>
  );
}
