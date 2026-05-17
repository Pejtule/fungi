import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootError } from './errors/RootError'
import { PageError } from './errors/PageError'
import { PublicLayout } from './layouts/PublicLayout'
import { LoginLayout } from './layouts/LoginLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { DetailPageLayout } from './layouts/DetailPageLayout'

const ExplorePage = lazy(() => import('./pages/ExplorePage').then(mod => ({ default: mod.ExplorePage })))
const DetailPage = lazy(() => import('./pages/DetailPage').then(mod => ({ default: mod.DetailPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then(mod => ({ default: mod.LoginPage })))
const AdminPage = lazy(() => import('./pages/AdminPage').then(mod => ({ default: mod.AdminPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(mod => ({ default: mod.NotFoundPage })))

export const router = createBrowserRouter([
  {
    errorElement: <RootError />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <Navigate to='mushrooms' replace />,
          },
          {
            path: 'mushrooms',
            element: <ExplorePage />,
            errorElement: <PageError notFound={<NotFoundPage to='/mushrooms' />} />,
            children: [
              {
                path: ':id',
                element: (
                  <DetailPageLayout>
                    <DetailPage />
                  </DetailPageLayout>
                ),
                errorElement: (
                  <DetailPageLayout>
                    <PageError notFound={<NotFoundPage to='/mushrooms' />} />
                  </DetailPageLayout>
                )
              },
            ],
          },
          {
            path: '*',
            element: <NotFoundPage to='/mushrooms' />,
          },
        ],
      },

      {
        path: 'login',
        element: <LoginLayout />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          }
        ]
      },

      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminPage />,
            errorElement: <PageError notFound={<NotFoundPage to='/admin' />} />
          },
          {
            path: '*',
            element: <NotFoundPage to='/admin' />,
          },
        ],
      },
    ],
  },
])
