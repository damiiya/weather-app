type QueryValue = string | string[] | undefined;

export type VercelRequestLike = {
  query?: Record<string, QueryValue>;
};

export type VercelResponseLike = {
  status: (code: number) => VercelResponseLike;
  json: (body: unknown) => void;
  send: (body: unknown) => void;
};

type KakaoXYDocument = {
  x?: string;
  y?: string;
};

type KakaoSearchResponse = {
  documents?: KakaoXYDocument[];
};

type KakaoFetchResult =
  | { ok: true; doc: KakaoXYDocument | null }
  | { ok: false; status: number; body: string };

async function fetchKakaoFirstDocument(
  url: URL,
  key: string,
): Promise<KakaoFetchResult> {
  const res = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${key}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return { ok: false, status: res.status, body };
  }

  const data = (await res.json()) as KakaoSearchResponse;
  return { ok: true, doc: data?.documents?.[0] ?? null };
}

function toLatLon(doc: KakaoXYDocument | null) {
  const lon = doc?.x ? Number(doc.x) : null;
  const lat = doc?.y ? Number(doc.y) : null;

  if (lat === null || lon === null || Number.isNaN(lat) || Number.isNaN(lon)) {
    return null;
  }
  return { lat, lon };
}

export default async function handler(
  req: VercelRequestLike,
  res: VercelResponseLike,
) {
  try {
    const qRaw = req.query?.q;
    const q = Array.isArray(qRaw) ? qRaw[0] : qRaw;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Missing query param: q' });
    }

    const key = process.env.KAKAO_REST_API_KEY;
    if (!key) {
      return res
        .status(500)
        .json({ error: 'Missing server env: KAKAO_REST_API_KEY' });
    }

    const addressUrl = new URL(
      'https://dapi.kakao.com/v2/local/search/address.json',
    );
    addressUrl.searchParams.set('query', q);
    addressUrl.searchParams.set('size', '1');

    const addressResult = await fetchKakaoFirstDocument(addressUrl, key);

    if (addressResult.ok) {
      const coords = toLatLon(addressResult.doc);
      if (coords) return res.status(200).json(coords);
    }

    const keywordUrl = new URL(
      'https://dapi.kakao.com/v2/local/search/keyword.json',
    );
    keywordUrl.searchParams.set('query', q);
    keywordUrl.searchParams.set('size', '1');

    const keywordResult = await fetchKakaoFirstDocument(keywordUrl, key);

    if (keywordResult.ok) {
      const coords = toLatLon(keywordResult.doc);
      if (coords) return res.status(200).json(coords);

      if (addressResult.ok) return res.status(200).json(null);
    }

    const failed = !keywordResult.ok
      ? keywordResult
      : !addressResult.ok
        ? addressResult
        : null;

    if (failed && !failed.ok) {
      return res.status(502).json({
        error: 'Kakao geocode failed',
        kakaoStatus: failed.status,
        body: failed.body,
      });
    }

    return res.status(200).json(null);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
