import { createBrowserRouter } from 'react-router-dom';

import { FavoriteDetailPage } from '@/pages/favorite-detail';
import { FavoritesPage } from '@/pages/favorites';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage />, errorElement: <NotFoundPage /> },
  {
    path: '/favorites',
    element: <FavoritesPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/favorites/:id',
    element: <FavoriteDetailPage />,
    errorElement: <NotFoundPage />,
  },
]);
