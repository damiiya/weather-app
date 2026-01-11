import { fetchJson } from '@/shared/api/http';

export type GeocodeResult = {
  lat: number;
  lon: number;
};

export function normalizeQueryText(v: string) {
  return v.trim().replace(/\s+/g, ' ');
}

export async function geocodeByText(
  queryText: string,
): Promise<GeocodeResult | null> {
  const q = normalizeQueryText(queryText);
  if (!q) return null;

  const url = `/api/kakao/geocode?q=${encodeURIComponent(q)}`;

  return fetchJson<GeocodeResult | null>(url);
}
