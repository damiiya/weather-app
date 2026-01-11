import type {
  WeatherDetail,
  WeatherSnapShot,
} from '@/entities/weather/model/types';
import { fetchJson } from '@/shared/api/http';
import type { Coords } from '@/shared/lib/coords';

type OpenMeteoResponse = {
  timezone: string;
  current?: { time: string; interval: number; temperature_2m?: number };
  daily?: {
    time: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
  hourly?: {
    time: string[];
    temperature_2m?: Array<number | null>;
  };
};

function pickTodayMinMax(daily?: OpenMeteoResponse['daily']) {
  const min = daily?.temperature_2m_min?.[0];
  const max = daily?.temperature_2m_max?.[0];
  return {
    temperatureMin: typeof min === 'number' ? min : null,
    temperatureMax: typeof max === 'number' ? max : null,
  };
}

function buildBaseUrl({ lat, lon }: Coords) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('current', 'temperature_2m');
  url.searchParams.set('daily', 'temperature_2m_min,temperature_2m_max');
  url.searchParams.set('timezone', 'auto');
  return url;
}

export async function fetchWeatherSummaryByCoords(
  params: Coords,
): Promise<WeatherSnapShot> {
  const url = buildBaseUrl(params);
  const data = await fetchJson<OpenMeteoResponse>(url.toString());

  const now = data.current?.temperature_2m;
  const { temperatureMin, temperatureMax } = pickTodayMinMax(data.daily);

  return {
    temperatureNow: typeof now === 'number' ? now : null,
    temperatureMin,
    temperatureMax,
  };
}

export async function fetchWeatherDetailByCoords(
  params: Coords,
): Promise<WeatherDetail> {
  const url = buildBaseUrl(params);
  url.searchParams.set('hourly', 'temperature_2m');

  const data = await fetchJson<OpenMeteoResponse>(url.toString());

  const now = data.current?.temperature_2m;
  const { temperatureMin, temperatureMax } = pickTodayMinMax(data.daily);

  const hourlyTimes = data.hourly?.time ?? [];
  const hourlyTemps = data.hourly?.temperature_2m ?? [];
  const hourly = hourlyTimes.map((time, idx) => ({
    time,
    temperature: hourlyTemps[idx] ?? null,
  }));

  return {
    timezone: data.timezone ?? 'auto',
    temperatureNow: typeof now === 'number' ? now : null,
    temperatureMin,
    temperatureMax,
    hourly,
  };
}
