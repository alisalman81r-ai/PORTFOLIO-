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

---

## Architecture

```
src/
├── animations/     Motion vocabulary — variants, easings, GSAP factories
├── assets/         fonts · icons · images · videos
├── components/
│   ├── ui/         Design-system primitives (Button, Tag, Marquee…)
│   ├── animations/ Motion wrappers (Reveal, Stagger, Parallax)
│   └── shared/     App infrastructure (ErrorBoundary, ScrollToTop)
├── context/        Providers and context objects
├── data/           All content as data — copy, projects, nav, experience
├── hooks/          Stateful, lifecycle-bound logic
├── layouts/        Structural primitives (MainLayout, Section, Container)
├── pages/          Routed pages — composition roots only
├── sections/       Composed page blocks (Hero, Work, About…)
├── styles/         Tokens, base layer, utilities, component classes
└── utils/          Pure functions
```

### The three-way component split

Components are organised by **role**, never by page — so anything is findable
from what it *does*, not from where it happened to be used first.

| Folder | Knows about the app? | Example |
| --- | --- | --- |
| `components/ui` | No. Pure props in, markup out. | `Button`, `Tag`, `Marquee` |
| `components/animations` | No. Wraps children, renders nothing itself. | `Reveal`, `Stagger` |
| `components/shared` | Yes. Singletons and cross-cutting concerns. | `ErrorBoundary` |
| `sections` | Yes. Imports `@/data`, owns its place in the page. | `Hero`, `Work` |

A **component** is reusable and context-free. A **section** is a specific block
of a specific page and is the only place allowed to read from `@/data`. That
asymmetry is what keeps components pure and pages thin.

### Path alias

`@` resolves to `src/`, configured in both `vite.config.js` (bundler) and
`jsconfig.json` (editor).

```js
import { cn } from '@/utils'
import { Section } from '@/layouts'
import { Reveal } from '@/components/animations'
```

Prefer the specific sub-barrel (`@/components/ui`) over the root one — it keeps
the dependency obvious at the import site.

---

## Design system

Tailwind v4 is **CSS-first**: no `tailwind.config.js`, no `postcss.config.js`.
Everything lives in `src/styles/`, imported in cascade order by `index.css`.

| File | Role |
| --- | --- |
| `index.css` | Entry point + import order |
| `fonts.css` | Self-hosted `@font-face` |
| `theme.css` | **All design tokens** |
| `base.css` | Element defaults beyond preflight |
| `utilities.css` | Single-purpose classes |
| `components.css` | Buttons, cards, headings |

### Token layers

```
PRIMITIVES   --neutral-900, --brand-500     named for what they ARE
     ↓
SEMANTICS    --canvas, --ink, --accent      named for what they're FOR
     ↓
TAILWIND     bg-canvas, text-ink            what components actually use
```

Components ask for `bg-surface`, never `bg-neutral-900`. Re-skinning the site
means editing the semantic layer only. **Never write a raw colour in a
component** — if a value is missing, add it to `theme.css`.

Colours are declared in `oklch` (perceptually uniform, wide gamut) and exposed
through `@theme inline`, which compiles utilities to `var()` references. That
indirection is what makes the runtime theme switch work.

### What's tokenised

Colour · typography scale · spacing · containers · radius · shadows ·
z-index layers · easing curves · durations · keyframe animations · blur ·
breakpoints.

### Key utility classes

```
Layout      container-page  container-wide  container-prose  full-bleed
Rhythm      section-y  section-y-sm  section-t  section-b
Stacking    z-header  z-drawer  z-modal  z-toast  z-cursor  z-max
Type        heading-2xl … heading-xs   eyebrow   lead   accent-serif
Buttons     btn + btn-primary|secondary|outline|ghost + btn-sm|lg|icon
Cards       card + card-glass|interactive|flush|panel
Effects     glass  glass-strong  text-gradient  hover-lift  link-underline
Timing      duration-instant|fast|base|slow|slower
```

### The variable pattern

Component classes compose through CSS variables rather than property overrides:

```css
.btn          { --btn-bg: transparent; background: var(--btn-bg); /* … */ }
.btn-primary  { --btn-bg: var(--accent); }   /* sets variables ONLY */
.btn-lg       { --btn-px: 2rem; }            /* sets variables ONLY */
```

`btn btn-primary btn-lg` composes cleanly because only the base class writes
real properties. The naive alternative — each variant re-declaring
`background-color` — makes correctness depend on stylesheet source order, which
is how codebases end up with `!important`.

### Z-index

Every stacking level is declared once in `theme.css` with gaps of 10. Use the
named utility (`z-header`), never a number. If two things collide, reorder the
scale in one place rather than inventing another value.

---

## Typography

Four self-hosted families, no CDN request:

| Token | Family | Use |
| --- | --- | --- |
| `font-display` | Bricolage Grotesque | Headlines |
| `font-sans` | Inter | Body and UI |
| `font-serif` | Instrument Serif | Editorial italic accents |
| `font-mono` | JetBrains Mono | Eyebrows, indices, metadata |

Three are variable fonts — one file spans every weight. Each stylesheet is split
by `unicode-range`, so a Latin reader never downloads Cyrillic.

Display sizes use `clamp()` and scale continuously with the viewport. **Body
sizes are fixed** — the user's browser font size is an accessibility contract.

Heading *appearance* is decoupled from heading *level*: an `<h2>` can use
`.heading-2xl` without breaking the document outline that screen-reader users
navigate by.

To swap in a licensed font (Satoshi, Söhne…), see the instructions at the bottom
of `styles/fonts.css`.

---

## Animation

One shared vocabulary across CSS, Motion, and GSAP — the `--ease-*` and
`--duration-*` tokens in `theme.css` are mirrored as arrays in
`animations/transitions.js`. Change a curve in both.

**Motion** handles discrete state: enter/exit, layout, gestures.
**GSAP** handles continuous scroll-scrubbed timelines, and its ScrollTrigger is
already frame-synced to Lenis.

```jsx
import { Reveal, Stagger, StaggerItem } from '@/components/animations'

<Stagger as="ul" className="grid gap-6 md:grid-cols-3">
  {items.map((item) => (
    <StaggerItem as="li" key={item.id}>…</StaggerItem>
  ))}
</Stagger>
```

Always import GSAP from `@/animations`, never from `gsap` — that module owns
plugin registration and must run exactly once.

```jsx
import { gsap, useGSAP, createParallax } from '@/animations'

useGSAP(() => {
  createParallax(imageRef.current, { speed: 0.25 })
}, { scope: sectionRef })
```

`useGSAP()` scopes selectors to a ref and reverts every tween on unmount, which
is what stops StrictMode's double-mount from leaving orphaned ScrollTriggers.

### Smooth scrolling

`SmoothScroll` steps Lenis from `gsap.ticker` instead of letting it run its own
rAF loop. Two competing loops produce a one-frame lag that shows up as pinned
sections drifting.

---

## Content

All copy lives in `src/data/` as plain objects with JSDoc typedefs — never
inline in JSX. Copy edits never touch rendering logic, and this directory is the
seam where a CMS drops in: replace the modules with fetched JSON of the same
shape and no component changes.

Icons are stored as **string keys**, not imported components, so data stays
serialisable and the bundle stays honest.

Placeholder content is written to look obviously unfinished (`PROJECT ONE`,
`YOUR NAME`) rather than plausible, so nothing can quietly ship.
`testimonials.js` is deliberately empty — see the note in that file.

---

## Accessibility

- `prefers-reduced-motion` honoured in four places: CSS, `<MotionConfig>`,
  Lenis, and the GSAP scroll factories.
- Skip link and `#main` landmark in `MainLayout`.
- `<Section labelledBy>` names the landmark so it appears in the landmark list.
- `:focus-visible` rings — keyboard only, never suppressed.
- Hover effects gated behind `@media (hover: hover)`.
- Icon-only buttons meet the 44px WCAG target minimum.

---

## Adding a section

1. Create `src/sections/Work.jsx`.
2. Build it from primitives — no `max-w-*`, `py-*`, `mx-auto`, or raw colour:

```jsx
import { Section } from '@/layouts'
import { Reveal } from '@/components/animations'
import { FEATURED_PROJECTS } from '@/data'

export function Work() {
  return (
    <Section id="work" labelledBy="work-title">
      <Reveal>
        <p className="eyebrow">Selected Work</p>
        <h2 id="work-title" className="heading-lg">Recent projects</h2>
      </Reveal>
      {/* … */}
    </Section>
  )
}
```

3. Export it from `src/sections/index.js`.
4. Add it to `src/pages/Home.jsx`.
5. Add its anchor to `NAV_LINKS` and `SECTION_IDS` in `src/data/navigation.js`.

If a section needs a magic number, the token is missing — add it to
`styles/theme.css` rather than hardcoding it.
