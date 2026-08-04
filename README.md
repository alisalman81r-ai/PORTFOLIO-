# Portfolio

Personal portfolio built with React 19, Vite 8, Tailwind CSS v4, Motion, GSAP, and Lenis.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |
| `npm run lint:fix` | Lint and auto-fix |

## Architecture

```
src/
├── animations/   Motion variants, easing tokens, GSAP registration
├── assets/       fonts · icons · images · videos
├── components/   Reusable, context-free building blocks
├── context/      Providers and context objects
├── data/         Content as data — copy, nav, project records
├── hooks/        Custom hooks
├── layouts/      Route-level shells and app-wide structure
├── pages/        Routed pages — composition roots, no visuals of their own
├── sections/     Large composed page blocks (Hero, Work, About…)
├── styles/       Tailwind entry, design tokens, base layer, utilities
└── utils/        Pure helpers
```

**`components/` vs `sections/`** — a component is reusable and knows nothing
about where it sits (`Button`, `Marquee`, `Reveal`). A section is a specific
composed block of one page (`Hero`, `FeaturedWork`). Pages compose sections;
sections compose components.

### Path alias

`@` resolves to `src/`, configured in both `vite.config.js` (bundler) and
`jsconfig.json` (editor).

```js
import { cn } from '@/utils'
import { fadeInUp } from '@/animations'
```

### Styling

Tailwind v4 is **CSS-first** — there is no `tailwind.config.js` and no PostCSS
config. Configuration lives in `src/styles/`:

| File | Role |
| --- | --- |
| `index.css` | Entry point and import order |
| `theme.css` | Design tokens — colours, type scale, easings, spacing |
| `fonts.css` | `@font-face` declarations |
| `base.css` | Element defaults beyond Tailwind's preflight |
| `utilities.css` | Custom `@utility` definitions |

Colours are semantic (`bg-canvas`, `text-ink`, `text-muted`, `border-line`,
`text-accent`) rather than literal. They are wired through `@theme inline`, so a
single `data-theme` swap on `<html>` re-themes the whole app — never hardcode a
colour in a component.

### Theming

`data-theme` on `<html>` drives everything. A small inline script in
`index.html` resolves it *before first paint* so there is no flash of the wrong
theme; `ThemeProvider` then reads that value rather than re-deriving it.

```jsx
const { theme, isDark, toggleTheme } = useTheme()
```

### Animation

One shared vocabulary of easings and durations across CSS, Motion, and GSAP —
defined in `styles/theme.css` and mirrored in `animations/transitions.js`.

```jsx
import { motion } from 'motion/react'
import { fadeInUp, staggerContainer, VIEWPORT } from '@/animations'

<motion.ul variants={staggerContainer()} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
  <motion.li variants={fadeInUp} />
</motion.ul>
```

> **Framer Motion is now `motion`.** The package was renamed at v12; import from
> `motion/react`. The API is unchanged.

Always import GSAP from `@/animations`, never from `gsap` directly — that module
owns plugin registration and house defaults, and it must run exactly once.

```jsx
import { gsap, useGSAP } from '@/animations'

useGSAP(() => {
  gsap.from('.card', { y: 40, stagger: 0.1 })
}, { scope: containerRef })
```

`useGSAP()` scopes selectors to a ref and reverts every tween on unmount, which
is what keeps React StrictMode's double-mount from leaving orphaned animations.

### Smooth scrolling

`SmoothScroll` steps Lenis from `gsap.ticker` rather than letting it run its own
`requestAnimationFrame` loop. Two competing loops produce a one-frame lag that
shows up as pinned ScrollTrigger sections drifting against the page.

### Accessibility

- `prefers-reduced-motion` is honoured in three places: CSS (`base.css`), Motion
  (`<MotionConfig reducedMotion="user">`), and Lenis (smoothing disabled).
- `usePrefersReducedMotion()` gates GSAP timelines, which CSS cannot reach.
- Skip link and `#main` landmark live in `RootLayout`.

## Adding a font

1. Put the `.woff2` in `src/assets/fonts/` — prefer a variable font.
2. Uncomment the matching `@font-face` block in `src/styles/fonts.css`.
3. Point `--font-display` / `--font-sans` at it in `src/styles/theme.css`.
