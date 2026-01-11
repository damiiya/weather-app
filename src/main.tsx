import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/app/styles/global.css';
import QueryProvider from '@/app/providers/QueryProvider.tsx';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);
