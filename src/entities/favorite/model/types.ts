import type { Coords } from '@/shared/lib/coords';

export type FavoriteItem = {
  id: string;
  label: string;
  queryText: string;
  coords: Coords;
  alias: string;
  createdAt: number;
};

export type AddFavoriteInput = {
  id: string;
  label: string;
  queryText: string;
  coords: Coords;
  alias?: string;
};

export type AddFavoriteResult =
  | { ok: true; item: FavoriteItem; reason?: never }
  | { ok: false; reason: 'LIMIT' };
