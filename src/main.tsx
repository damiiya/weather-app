import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/app/global.css';
import QueryProvider from '@/app/providers/queryProvider.tsx';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);
