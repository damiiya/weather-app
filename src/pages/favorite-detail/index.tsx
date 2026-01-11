import { Link, useParams } from 'react-router-dom';

import { useFavoriteStore } from '@/entities/favorite';
import {
  useWeatherDetailByCoordsQuery,
  WeatherSummaryContent,
} from '@/entities/weather';
import { formatHourMinute } from '@/shared/lib/formatTime';
import ErrorView from '@/shared/ui/ErrorView';
import LoadingView from '@/shared/ui/LoadingView';
import { PageLayout } from '@/widgets/layout';

export function FavoriteDetailPage() {
  const { id } = useParams();

  const favorites = useFavoriteStore((s) => s.favorites);
  const favorite = favorites.find((f) => f.id === (id ?? ''));

  const weatherQuery = useWeatherDetailByCoordsQuery(
    favorite?.coords ?? { lat: 0, lon: 0 },
    { enabled: !!favorite },
  );

  const data = weatherQuery.data;
  const hourly = data?.hourly ?? [];

  const isHourlyLoading =
    !!favorite && weatherQuery.isFetching && hourly.length === 0;

  const showHourlyEmpty =
    !!favorite &&
    !weatherQuery.isFetching &&
    !weatherQuery.error &&
    hourly.length === 0;

  const showTopLoading =
    !!favorite && weatherQuery.isLoading && weatherQuery.data == null;

  return (
    <PageLayout
      title={favorite ? favorite.alias : '상세'}
      subtitle={favorite ? favorite.label : undefined}
      right={
        <Link
          to="/favorites"
          title="즐겨찾기 목록으로"
          className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-100"
        >
          뒤로
        </Link>
      }
    >
      {!favorite ? (
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">존재하지 않는 즐겨찾기입니다.</p>
        </div>
      ) : weatherQuery.error ? (
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <ErrorView
            title="날씨 조회에 실패했습니다."
            onRetry={() => weatherQuery.refetch()}
          />
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            {showTopLoading ? (
              <LoadingView message="날씨를 불러오는 중..." />
            ) : (
              <>
                <WeatherSummaryContent
                  data={data}
                  emptyText="해당 장소의 정보가 제공되지 않습니다."
                />
                {weatherQuery.isFetching ? (
                  <p className="mt-2 text-xs text-gray-400">업데이트 중...</p>
                ) : null}
              </>
            )}
          </div>

          <section className="mt-6">
            <div className="flex items-end justify-between">
              <h2 className="text-lg font-bold">시간대별 기온</h2>
              <p className="text-xs text-gray-500">최대 24시간</p>
            </div>

            {isHourlyLoading ? (
              <div className="mt-3 rounded-xl bg-white p-4 shadow-sm">
                <LoadingView message="시간대별 기온을 불러오는 중..." />
              </div>
            ) : showHourlyEmpty ? (
              <div className="mt-3 rounded-xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  시간대별 기온 정보가 없습니다.
                </p>
              </div>
            ) : (
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <ul className="divide-y divide-gray-100">
                  {hourly.slice(0, 24).map((h) => (
                    <li
                      key={h.time}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="text-sm text-gray-700">
                        {formatHourMinute(h.time)}
                      </div>
                      <div className="text-sm font-semibold">
                        {h.temperature ?? '-'}°
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </>
      )}
    </PageLayout>
  );
}
