# Case studies

Twelve-section project pages at `/work/:slug`, driven entirely by data.

```
src/case-studies/
├── CaseStudy.jsx        composition root — declares section order, nothing else
├── index.js             public barrel (pulls the whole bundle — see slugs.js)
├── slugs.js             dependency-free predicate for the projects grid
├── components/          one component per section, plus the shared shell
└── data/
    ├── schema.js        defineCaseStudy() + the 12-section contract
    ├── index.js         registry, ordering, neighbours, drift guard
    └── <slug>.js        one file per case study
```

## Adding a case study

1. Add the project to `src/data/projects.js`. That record owns the title,
   category, year, role, duration, stack, features and thumbnail.
2. Copy any file in `data/`, change the slug, write the content.
3. Import it into `data/index.js` and add it to `ENTRIES`.
4. Add the slug to `slugs.js`.

Step 4 is the one that is easy to forget, so it is checked: `data/index.js`
throws at import with the offending slug named if the two lists disagree.

Nothing else changes. The route, the ordering, the previous/next navigation and
the "read the case study" link on the projects grid are all derived.

## Data architecture

A case study **extends** its project record rather than restating it.
`defineCaseStudy(slug, extension)` looks the project up and merges, so a project
cannot be called one thing on the grid and another on its own page. A slug that
does not resolve throws at import rather than rendering a blank page.

`null` is meaningful. A storyboard has no database; a marketing site has no API.
Set a development layer to `null` and it is not rendered; set `development` to
`null` and the whole section disappears. That silence is a statement — an absent
Backend section reads as "frontend project", where one full of placeholder text
reads as carelessness.

Use `null` when a section does not apply. Use a `PLACEHOLDER` string when it
applies and you have not written it yet.

## Placeholder strategy

Three levels, by how unfinished the thing is:

| Level | What it looks like | Where |
| --- | --- | --- |
| Missing content | `PLACEHOLDER — <the question you need to answer>` | Any string field |
| Missing image | An empty frame naming what belongs in it | Gallery, wireframes, hero |
| Missing everything | `draft: true` → a banner at the top of the page | EXMO, EV Charger Finder |

The banner is shown, not hidden. A draft that looks finished is how a
placeholder reaches a client, and hiding it is worse, because then nobody
remembers the page exists.

**Nothing was invented.** The construction, Klyra and dashboard studies are
written from the records already in `projects.js`. No client name, contract
value, traffic figure or before/after metric appears anywhere — none were
recorded, and a case study is exactly the document where an invented number gets
questioned. `results.metrics` is an empty array on every project for that
reason: fill it only with figures you measured.

## Replacing images

Captions live in the case-study data file; images live in `src/data/media.js`.
They are separate on purpose — writing a caption is authoring and happens once,
swapping a placeholder for a real screenshot is asset management and happens
every time a screen changes.

To replace a project's gallery, edit one object:

```js
// src/data/media.js
projects: {
  'construction-website': {
    thumbnail: '/images/projects/construction/cover.jpg',
    gallery: [
      '/images/projects/construction/home.jpg',
      '/images/projects/construction/detail.jpg',
    ],
  },
}
```

Put the files in `public/images/projects/<slug>/` and reference them with a
leading slash. `resolveGallery()` pairs images to captions by index and keeps
every caption — so a slot you have written but not photographed renders as an
empty frame rather than silently disappearing.

Wireframe and UI artefacts are set per design phase, on the phase's `image`
field. A phase with no `image` key renders no frame at all; a phase with
`image: null` renders an empty one asking for the artefact.

The current placeholders are Unsplash URLs already verified elsewhere in
`media.js`. **EV Charger Finder deliberately has no media entry** — a stock
photograph of a charging station would look like evidence of work that has not
been shown.

## PDF export

Every case study is print-ready. Open one and press **Ctrl/Cmd + P** → *Save as
PDF*, A4, background graphics **on**.

`src/styles/print.css` does the work, and one rule in it is load-bearing:
every scroll reveal on this site starts at `opacity: 0`, and printing does not
scroll. Without forcing visibility, an export is a hero image followed by nine
blank sheets. Print also inverts to a light palette, drops the header, cursor,
scroll chrome and end-of-page CTA, prevents cards breaking across pages, and
appends the URL to external links.

Verified: printing without scrolling first leaves **zero** invisible text.

## Performance

The route is code-split. A visitor who never opens a case study downloads none
of it — that is ~61 kB (17 kB gzipped) including every study's prose, all
fourteen section components, and `TechIcon`'s brand marks.

Keeping it that way needs care, and this project has now paid for the lesson
three times:

- `ProjectModal` imports `hasCaseStudy` from **`@/case-studies/slugs`**, never
  from the barrel. The barrel re-exports `CaseStudy`, which reaches every
  component and every data file.
- `src/pages/index.js` deliberately does **not** re-export `CaseStudy`. A module
  reachable both statically and dynamically gets bundled the static way — adding
  it to that barrel put the whole chunk back in the landing page's preload list.

Every image below the hero is `loading="lazy"`. The hero image is `eager`,
because it is the one that must not be deferred.

## Accessibility

Verified with axe (WCAG 2.1 AA) in both themes: **zero violations**.

- One `<h1>` per page; every section heading is an `<h2>`, everything nested is
  an `<h3>`. No skipped levels.
- "All projects" is the first focusable element, so a reader who arrived by
  mistake does not tab through twelve sections to leave.
- Term/value pairs are real `<dl>` markup. Note that a `<dl>` may contain
  `<dt>`/`<dd>` directly or wrapped in a **single** `<div>` — nesting them
  deeper (inside a `<Reveal>` inside a card, say) fails `dlitem`, which is how
  the first version of `CaseSolution` was written.
- Decorative index numerals are `aria-hidden` **and** still meet contrast.
  Hiding text from assistive tech does not exempt it: sighted readers still see
  it, and axe still measures it.
