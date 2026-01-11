export type Coords = { lat: number; lon: number };

export function normalizeCoords(coords: Coords, precision = 3): Coords {
  const p = Math.pow(10, precision);
  return {
    lat: Math.round(coords.lat * p) / p,
    lon: Math.round(coords.lon * p) / p,
  };
}

export function coordsKey(coords: Coords, precision = 3): string {
  return `${coords.lat.toFixed(precision)},${coords.lon.toFixed(precision)}`;
}
