/**
 * Root component barrel.
 *
 * `components/` is split three ways by *role*, not by page — a component should
 * be findable from what it does, never from where it happens to be used first:
 *
 *   ui/          Design-system primitives. Presentational, reusable,
 *                context-free. Knows nothing about the app.
 *   animations/  Motion wrappers. Add behaviour to children, render no markup.
 *   shared/      App infrastructure. Singletons and cross-cutting concerns.
 *
 * Prefer importing from the specific sub-barrel (`@/components/ui`) — it keeps
 * the dependency obvious at the import site and avoids pulling the whole tree
 * into a module graph that only needed one thing.
 */

export * from './ui'
export * from './animations'
export * from './shared'
