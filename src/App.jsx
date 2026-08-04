import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { MainLayout } from '@/layouts'
import { Home, NotFound } from '@/pages'

/**
 * Route table.
 *
 * Every route nests under `MainLayout`, so smooth scrolling, scroll reset, and
 * page transitions apply uniformly — a sibling top-level route would silently
 * opt out of all three.
 *
 * Pages are imported eagerly while the tree is small. Once routes carry real
 * weight, swap an entry to code-split it:
 *
 *   { path: 'work/:slug', lazy: () => import('@/pages/CaseStudy') }
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
