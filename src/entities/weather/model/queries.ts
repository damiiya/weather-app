import {
  QueryClient,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  fetchWeatherDetailByCoords,
  fetchWeatherSummaryByCoords,
} from '@/entities/weather/api/openMeteo';
import {
  WEATHER_COORDS_PRECISION,
  weatherKeys,
} from '@/entities/weather/model/queryKeys';
import type {
  WeatherDetail,
  WeatherSnapShot,
} from '@/entities/weather/model/types';
import { normalizeCoords, type Coords } from '@/shared/lib/coords';

const weatherQueryDefaults = {
  staleTime: 10 * 60_000,
  gcTime: 60 * 60_000,
  refetchOnWindowFocus: false,
  retry: 1,
} as const;

function normalize(coords: Coords) {
  return normalizeCoords(coords, WEATHER_COORDS_PRECISION);
}

function buildDetailPlaceholder(
  qc: QueryClient,
  coords: Coords,
): WeatherDetail | undefined {
  const snap = qc.getQueryData<WeatherSnapShot>(weatherKeys.summary(coords));
  if (!snap) return undefined;
  return { ...snap, hourly: [], timezone: 'auto' };
}

function summaryQueryOptions(coords: Coords) {
  const c = normalize(coords);
  return {
    queryKey: weatherKeys.summary(c),
    queryFn: () => fetchWeatherSummaryByCoords(c),
    ...weatherQueryDefaults,
  } as const;
}

function detailQueryOptions(qc: QueryClient, coords: Coords) {
  const c = normalize(coords);
  return {
    queryKey: weatherKeys.detail(c),
    queryFn: () => fetchWeatherDetailByCoords(c),
    placeholderData: () => buildDetailPlaceholder(qc, c),
    ...weatherQueryDefaults,
  } as const;
}

export function prefetchWeatherDetailByCoords(qc: QueryClient, coords: Coords) {
  const opts = detailQueryOptions(qc, coords);
  return qc.prefetchQuery<WeatherDetail>({
    queryKey: opts.queryKey,
    queryFn: opts.queryFn,
    staleTime: opts.staleTime,
    gcTime: opts.gcTime,
    retry: opts.retry,
  });
}

export function usePrefetchWeatherDetailByCoords() {
  const qc = useQueryClient();
  return useCallback(
    (coords: Coords) => prefetchWeatherDetailByCoords(qc, coords),
    [qc],
  );
}

export function useWeatherSummaryByCoordsQuery(
  coords: Coords,
  options?: Omit<UseQueryOptions<WeatherSnapShot>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    ...summaryQueryOptions(coords),
    ...options,
  });
}

export function useWeatherDetailByCoordsQuery(
  coords: Coords,
  options?: Omit<UseQueryOptions<WeatherDetail>, 'queryKey' | 'queryFn'>,
) {
  const qc = useQueryClient();

  return useQuery({
    ...detailQueryOptions(qc, coords),
    ...options,
  });
}
