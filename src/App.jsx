import { Suspense, lazy } from 'react'
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
 * Home and the 404 are imported eagerly — they are small, and the 404 has to be
 * available the instant an unknown URL resolves.
 *
 * CASE STUDIES ARE CODE-SPLIT, AND THAT MATTERS MORE THAN IT LOOKS
 * The route pulls in every case study's prose, its section components, and
 * `TechIcon` with its ~37 kB of brand marks. A visitor who never opens a case
 * study should not download any of it, and most visitors never will. Splitting
 * here keeps that weight off the landing page entirely.
 *
 * The Suspense fallback reserves a viewport of height rather than showing a
 * spinner. The chunk resolves in a few hundred milliseconds on any real
 * connection, and a spinner that flashes for 200ms reads as jank rather than as
 * progress — while a collapsed page would scroll-jump the moment it arrives.
 */
const CaseStudyPage = lazy(() => import('@/pages/CaseStudy'))
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'work/:slug',
        element: (
          <Suspense fallback={<div aria-hidden="true" className="min-h-svh" />}>
            <CaseStudyPage />
          </Suspense>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
