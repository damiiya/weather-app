import { createBrowserRouter } from 'react-router-dom';

import { FavoriteDetailPage } from '@/pages/favorite-detail';
import { FavoritesPage } from '@/pages/favorites';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';

const errorElement = <NotFoundPage />;

export const router = createBrowserRouter([
  { path: '/', element: <HomePage />, errorElement },
  {
    path: '/favorites',
    element: <FavoritesPage />,
    errorElement,
  },
  {
    path: '/favorites/:id',
    element: <FavoriteDetailPage />,
    errorElement,
  },

  { path: '*', element: <NotFoundPage /> },
]);
