import { useEffect, useState } from 'react';

import type { Coords } from '@/shared/lib/coords';
import { getCurrentCoords } from '@/shared/lib/geolocation';

export function useCurrentCoordsOnEnter() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setGeoLoading(true);
      const result = await getCurrentCoords();
      if (!mounted) return;
      if (result.ok) {
        setCoords(result.coords);
        setGeoError(null);
      } else {
        setCoords(null);
        setGeoError(result.message);
      }
      setGeoLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { coords, geoError, geoLoading };
}
