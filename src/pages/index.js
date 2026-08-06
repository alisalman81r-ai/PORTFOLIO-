/**
 * Barrel export for routed pages.
 *
 * Pages use default exports (the convention React Router's `lazy` expects) and
 * are re-exported here as named bindings for the router definition.
 */

export { default as Home } from './Home'
export { default as NotFound } from './NotFound'

/*
 * CaseStudy is deliberately NOT exported here.
 *
 * The router loads it with `lazy(() => import('@/pages/CaseStudy'))`. Adding a
 * static re-export to this barrel puts the same module in the static graph as
 * well, and a module that is reachable both ways is bundled the static way —
 * so the 63 kB case-study chunk went back to being modulepreloaded on the
 * landing page even though nothing there renders it.
 *
 * The router imports it by path. That is the only reference it should have.
 */
