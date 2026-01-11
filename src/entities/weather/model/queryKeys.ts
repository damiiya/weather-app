import type { Coords } from '@/shared/lib/coords';
import { coordsKey } from '@/shared/lib/coords';

export const WEATHER_COORDS_PRECISION = 3;

export const weatherKeys = {
  all: ['weather'] as const,

  summary: (coords: Coords) => {
    return [
      ...weatherKeys.all,
      'summary',
      coordsKey(coords, WEATHER_COORDS_PRECISION),
    ] as const;
  },

  detail: (coords: Coords) => {
    return [
      ...weatherKeys.all,
      'detail',
      coordsKey(coords, WEATHER_COORDS_PRECISION),
    ] as const;
  },
};
