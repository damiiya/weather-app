import { Link } from 'react-router-dom';

import { useFavoriteStore } from '@/entities/favorite';
import { FavoriteList } from '@/features/favorite/ui/FavoriteList';
import { PageLayout } from '@/widgets/layout';

export function FavoritesPage() {
  const favorites = useFavoriteStore((s) => s.favorites);

  return (
    <PageLayout
      title="즐겨찾기"
      right={
        <Link
          to="/"
          title="홈으로 이동"
          className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-100"
        >
          홈
        </Link>
      }
    >
      {favorites.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-900">
            아직 즐겨찾기가 없어요
          </p>
          <p className="mt-1 text-xs text-gray-500">
            홈에서 장소를 검색해 즐겨찾기를 추가해 보세요.
          </p>

          <Link
            to="/"
            className="mt-4 inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            홈으로 가기
          </Link>
        </div>
      ) : (
        <FavoriteList />
      )}
    </PageLayout>
  );
}
