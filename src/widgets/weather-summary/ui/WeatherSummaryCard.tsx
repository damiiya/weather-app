import type { WeatherSnapShot } from '@/entities/weather';
import { WeatherSummaryContent } from '@/entities/weather';
import ErrorView from '@/shared/ui/ErrorView';
import LoadingView from '@/shared/ui/LoadingView';

import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  isLoading: boolean;
  error: unknown;
  onRetry?: () => void;
  data?: WeatherSnapShot;
  emptyText?: string;
  actions?: ReactNode;
  hasRequested?: boolean;
};

export function WeatherSummaryCard({
  title,
  subtitle,
  isLoading,
  error,
  onRetry,
  data,
  emptyText = '해당 장소의 정보가 제공되지 않습니다.',
  actions,
  hasRequested = true,
}: Props) {
  const hasError = Boolean(error);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>
          {subtitle ? (
            <p className="mt-1 text-sm font-medium text-gray-800">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      {isLoading ? (
        <LoadingView message="날씨를 불러오는 중..." />
      ) : hasError ? (
        <div className="mt-3">
          <ErrorView title="날씨 조회에 실패했습니다." onRetry={onRetry} />
        </div>
      ) : hasRequested ? (
        <div className="mt-3">
          <WeatherSummaryContent data={data} emptyText={emptyText} />
        </div>
      ) : null}
    </div>
  );
}
