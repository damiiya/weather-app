import type { Coords } from "@/shared/lib/coords";

export type GeoErrorCode =
  | "UNSUPPORTED"
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "UNKNOWN";

export type GeoResult =
  | { ok: true; coords: Coords }
  | { ok: false; code: GeoErrorCode; message: string };

export function getCurrentCoords(
  options?: PositionOptions
): Promise<GeoResult> {
  if (!("geolocation" in navigator)) {
    return Promise.resolve({
      ok: false,
      code: "UNSUPPORTED",
      message: "이 브라우저에서는 위치 기능을 지원하지 않습니다.",
    });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          ok: true,
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        });
      },
      (err) => {
        const code: GeoErrorCode =
          err.code === err.PERMISSION_DENIED
            ? "PERMISSION_DENIED"
            : err.code === err.POSITION_UNAVAILABLE
            ? "POSITION_UNAVAILABLE"
            : err.code === err.TIMEOUT
            ? "TIMEOUT"
            : "UNKNOWN";

        resolve({
          ok: false,
          code,
          message:
            code === "PERMISSION_DENIED"
              ? "위치 권한이 거부되었습니다."
              : code === "TIMEOUT"
              ? "위치 정보를 가져오는 데 시간이 초과되었습니다."
              : "위치 정보를 가져올 수 없습니다.",
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60_000,
        ...options,
      }
    );
  });
}
