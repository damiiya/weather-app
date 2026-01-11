import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import type { FavoriteItem } from '@/entities/favorite';
import { useFavoriteStore } from '@/entities/favorite';
import {
  usePrefetchWeatherDetailByCoords,
  useWeatherSummaryByCoordsQuery,
  WeatherSummaryContent,
  type WeatherSnapShot,
} from '@/entities/weather';

type Props = {
  item: FavoriteItem;
};

export function FavoriteCard({ item }: Props) {
  const remove = useFavoriteStore((s) => s.removeFavorite);
  const rename = useFavoriteStore((s) => s.renameFavorite);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.alias);

  const startEdit = () => {
    setDraft(item.alias);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(item.alias);
    setEditing(false);
  };

  const saveEdit = () => {
    const next = draft.trim();
    if (next === '') {
      cancelEdit();
      return;
    }
    rename(item.id, next);
    setEditing(false);
  };

  const weatherQuery = useWeatherSummaryByCoordsQuery(item.coords);

  const data: WeatherSnapShot | undefined = weatherQuery.data;
  const encodedId = useMemo(() => encodeURIComponent(item.id), [item.id]);

  const prefetchDetail = usePrefetchWeatherDetailByCoords();

  const renderWeather = () => {
    if (weatherQuery.isLoading) {
      return <p className="text-sm text-gray-500">날씨를 불러오는 중...</p>;
    }
    if (weatherQuery.error) {
      return <p className="text-sm text-gray-500">날씨 조회에 실패했습니다.</p>;
    }
    return <WeatherSummaryContent data={data} />;
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm transition hover:bg-gray-50 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {editing ? (
          <div className="flex-1 rounded-lg pr-2">
            <div className="space-y-2">
              <input
                className="w-full rounded-md border border-gray-200 bg-white px-2 py-2 text-sm focus:border-gray-400 focus:outline-none"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveEdit();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEdit();
                  }
                }}
              />
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>

            <div className="mt-3">{renderWeather()}</div>
          </div>
        ) : (
          <Link
            to={`/favorites/${encodedId}`}
            onMouseEnter={() => {
              if (editing) return;
              prefetchDetail(item.coords);
            }}
            onFocus={() => {
              if (editing) return;
              prefetchDetail(item.coords);
            }}
            className={[
              'group flex-1 rounded-lg outline-none',
              'cursor-pointer',
              'focus-visible:ring-1 focus-visible:ring-gray-200',
            ].join(' ')}
            aria-label={`${item.alias} 상세 보기`}
            title="상세 보기"
          >
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-base font-semibold text-gray-900 group-hover:underline">
                  {item.alias}
                </p>

                <span className="shrink-0 text-xs font-medium text-gray-500 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  상세 보기 →
                </span>
              </div>

              <p className="mt-1 truncate text-xs text-gray-500">
                {item.label}
              </p>
            </div>

            <div className="mt-3">{renderWeather()}</div>
          </Link>
        )}

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-medium hover:bg-white"
            onClick={() => {
              if (editing) saveEdit();
              else startEdit();
            }}
          >
            {editing ? '저장' : '별칭'}
          </button>

          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            onClick={() => {
              if (confirm('이 즐겨찾기를 삭제할까요?')) remove(item.id);
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
