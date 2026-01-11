import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  geocodeByText,
  normalizeQueryText,
  type GeocodeResult,
} from '@/entities/location/api/geocode';
import { locationKeys } from '@/entities/location/model/queryKeys';

export function useGeocodeQuery(
  queryText: string | null,
  options?: Omit<
    UseQueryOptions<GeocodeResult | null>,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) {
  const q = queryText ? normalizeQueryText(queryText) : '';
  const enabled = q.length > 0;

  return useQuery({
    queryKey: locationKeys.geocode(q),
    queryFn: () => geocodeByText(q),
    enabled,
    staleTime: 24 * 60 * 60_000,
    gcTime: 7 * 24 * 60 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
