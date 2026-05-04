/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import Home from './pages/Home';
import CaseNew from './pages/CaseNew';
import CaseConfirm from './pages/CaseConfirm';
import AnalysisResult from './pages/AnalysisResult';
import HistoryArchive from './pages/HistoryArchive';

const basename =
  import.meta.env.BASE_URL === '/'
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const router = createBrowserRouter(
[
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/case/new',
        element: <CaseNew />
      },
      {
        path: '/case/confirm',
        element: <CaseConfirm />
      },
      {
        path: '/case/result',
        element: <AnalysisResult />
      },
      {
        path: '/history',
        element: <HistoryArchive />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
],
  basename ? { basename } : undefined,
);

export default function App() {
  return <RouterProvider router={router} />;
}

