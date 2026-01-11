import { Link } from 'react-router-dom';

import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
};

export function PageLayout({ title, subtitle, right, children }: Props) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-3 sm:px-4 md:px-6 py-4">
        <header className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold">{title}</h1>
            {subtitle ? (
              <p className="mt-1 truncate text-xs text-gray-500">{subtitle}</p>
            ) : null}
          </div>

          {right ?? (
            <Link
              to="/"
              title="홈으로 이동"
              className="shrink-0 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-100"
            >
              홈
            </Link>
          )}
        </header>

        <main className="mt-4">{children}</main>
      </div>
    </div>
  );
}
