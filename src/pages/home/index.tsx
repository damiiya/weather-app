import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useGeocodeQuery } from '@/entities/location';
import { useWeatherSummaryByCoordsQuery } from '@/entities/weather';
import AddFavoriteButton from '@/features/favorite/ui/AddFavoriteButton';
import { useCurrentCoordsOnEnter } from '@/features/get-current-location-weather/model/useCurrentLocationWeather';
import { DistrictSearchBox } from '@/features/search-district/ui/DistrictSearchBox';
import type { DistrictCandidate } from '@/shared/lib/districtSearch';
import { PageLayout } from '@/widgets/layout';
import { WeatherSummaryCard } from '@/widgets/weather-summary/ui/WeatherSummaryCard';

const EMPTY = { lat: 0, lon: 0 } as const;

export function HomePage() {
  const [favError, setFavError] = useState<string | null>(null);

  const { coords, geoError, geoLoading } = useCurrentCoordsOnEnter();

  const currentWeatherQuery = useWeatherSummaryByCoordsQuery(coords ?? EMPTY, {
    enabled: !!coords,
  });

  const [selected, setSelected] = useState<DistrictCandidate | null>(null);
  const geocodeQuery = useGeocodeQuery(selected?.queryText ?? null);

  const selectedCoords = useMemo(() => {
    if (!geocodeQuery.data) return null;
    return { lat: geocodeQuery.data.lat, lon: geocodeQuery.data.lon };
  }, [geocodeQuery.data]);

  const selectedWeatherQuery = useWeatherSummaryByCoordsQuery(
    selectedCoords ?? EMPTY,
    { enabled: !!selectedCoords },
  );

  return (
    <PageLayout
      title="Weather app"
      right={
        <Link
          to="/favorites"
          className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-100"
        >
          즐겨찾기
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <section className="space-y-4">
          <WeatherSummaryCard
            title="현재 위치"
            isLoading={geoLoading || currentWeatherQuery.isLoading}
            error={geoError ?? currentWeatherQuery.error}
            data={currentWeatherQuery.data}
            onRetry={coords ? () => currentWeatherQuery.refetch() : undefined}
            hasRequested={!!coords}
          />

          <DistrictSearchBox
            onSelect={(candidate) => {
              setFavError(null);
              setSelected(candidate);
            }}
            selectedLabel={selected?.label}
          />
        </section>

        <section className="space-y-4">
          {!selected ? (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">선택한 장소</p>
              <p className="mt-2 text-sm text-gray-600">
                검색으로 장소를 선택하면 여기에서 날씨를 확인할 수 있어요.
              </p>
            </div>
          ) : geocodeQuery.isLoading ? (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">선택한 장소</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {selected.label}
              </p>
              <p className="mt-3 text-sm text-gray-500">좌표를 찾는 중...</p>
            </div>
          ) : geocodeQuery.error ? (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">선택한 장소</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {selected.label}
              </p>
              <p className="mt-3 text-sm text-gray-600">
                장소 좌표를 가져오지 못했습니다. 다시 시도해 주세요.
              </p>
            </div>
          ) : geocodeQuery.isSuccess && !geocodeQuery.data ? (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">선택한 장소</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {selected.label}
              </p>
              <p className="mt-3 text-sm text-gray-600">
                해당 장소의 좌표를 찾지 못했습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <WeatherSummaryCard
                title="선택한 장소"
                subtitle={selected.label}
                isLoading={selectedWeatherQuery.isLoading}
                error={selectedWeatherQuery.error}
                onRetry={() => selectedWeatherQuery.refetch()}
                data={selectedWeatherQuery.data}
                actions={
                  selected && selectedCoords ? (
                    <AddFavoriteButton
                      input={{
                        id: selected.id,
                        label: selected.label,
                        queryText: selected.queryText,
                        coords: selectedCoords,
                        alias: selected.label,
                      }}
                      className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200"
                      onLimit={() =>
                        setFavError('즐겨찾기는 최대 6개까지 저장할 수 있어요.')
                      }
                      onAdded={() => setFavError(null)}
                    />
                  ) : null
                }
              />

              {favError ? (
                <div className="rounded-xl bg-white p-3 text-sm text-red-600 shadow-sm">
                  {favError}
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
