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
import Me from './pages/Me';
import AdminHome from './pages/admin/AdminHome';
import AdminGuidelines from './pages/admin/AdminGuidelines';
import AdminReviewFlow from './pages/admin/AdminReviewFlow';
import AdminUsers from './pages/admin/AdminUsers';

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
        path: '/me',
        element: <Me />
      },
      {
        path: '/admin',
        element: <AdminHome />
      },
      {
        path: '/admin/guidelines',
        element: <AdminGuidelines />
      },
      {
        path: '/admin/review',
        element: <AdminReviewFlow />
      },
      {
        path: '/admin/users',
        element: <AdminUsers />
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

