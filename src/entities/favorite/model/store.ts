import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type {
  AddFavoriteInput,
  AddFavoriteResult,
  FavoriteItem,
} from './types';

const MAX_FAVORITES = 6;
const STORAGE_KEY = 'weather_app_favorites_v1';

type FavoriteState = {
  favorites: FavoriteItem[];

  addFavorite: (input: AddFavoriteInput) => AddFavoriteResult;
  removeFavorite: (id: string) => void;
  renameFavorite: (id: string, alias: string) => void;

  getFavoriteById: (id: string) => FavoriteItem | undefined;
  isFull: () => boolean;

  clearFavorites: () => void;
};

const normalizeAlias = (alias: string, fallback: string) => {
  const trimmed = alias.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      isFull: () => get().favorites.length >= MAX_FAVORITES,

      getFavoriteById: (id) => get().favorites.find((f) => f.id === id),

      addFavorite: (input) => {
        const { favorites } = get();

        const existsIdx = favorites.findIndex((f) => f.id === input.id);
        if (existsIdx >= 0) {
          const prev = favorites[existsIdx];
          const updated: FavoriteItem = {
            ...prev,
            label: input.label,
            queryText: input.queryText,
            coords: input.coords,
            alias: normalizeAlias(input.alias ?? prev.alias, input.label),
          };

          const next = [
            updated,
            ...favorites.slice(0, existsIdx),
            ...favorites.slice(existsIdx + 1),
          ];

          set({ favorites: next });
          return { ok: true, item: updated };
        }

        if (favorites.length >= MAX_FAVORITES) {
          return { ok: false, reason: 'LIMIT' };
        }

        const item: FavoriteItem = {
          id: input.id,
          label: input.label,
          queryText: input.queryText,
          coords: input.coords,
          alias: normalizeAlias(input.alias ?? '', input.label),
          createdAt: Date.now(),
        };

        set({ favorites: [item, ...favorites] });
        return { ok: true, item };
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },

      renameFavorite: (id, alias) => {
        set((state) => ({
          favorites: state.favorites.map((f) =>
            f.id === id ? { ...f, alias: normalizeAlias(alias, f.label) } : f,
          ),
        }));
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites }),
      version: 1,
    },
  ),
);
