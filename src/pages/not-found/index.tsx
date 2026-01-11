import { Link } from 'react-router-dom';

import ErrorView from '@/shared/ui/ErrorView';
import { PageLayout } from '@/widgets/layout';

export function NotFoundPage() {
  return (
    <PageLayout title="문제가 발생했어요">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <ErrorView title="페이지를 불러올 수 없습니다." />
        <div className="mt-3 flex justify-center">
          <Link
            to="/"
            className="inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            홈으로 가기
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
