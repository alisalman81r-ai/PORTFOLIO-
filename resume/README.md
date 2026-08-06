# Resume

Two resumes, one source of truth.

```
resume/
├── resume-data.json          ← the only file you edit
├── build.mjs                 generates every output below
├── pdf.mjs                   renders the premium HTML to PDF
├── ATS-Resume.md             generated · plain, one page, machine-readable
├── Premium-Resume.md         generated · full content as markdown
├── templates/
│   ├── ats.mjs               ATS markdown renderer
│   ├── premium.mjs           print-ready HTML renderer
│   └── docx-structure.md     how to produce and style the .docx
├── assets/                   headshot, signature — see assets/README.md
└── exports/                  generated · send these
    ├── Premium-Resume.html   self-contained, fonts embedded
    ├── Premium-Resume.pdf    A4, print-calibrated
    ├── ATS-Resume.doc.html   open in Word → Save As .docx
    └── resume-data.yaml      YAML mirror of the data file
```

## Quick start

```bash
npm run resume            # build everything
npm run resume:check      # list every field still unfilled
npm run resume:pdf        # build, then render the PDF
```

Tailor the opening paragraph and job title per application:

```bash
node resume/build.mjs --variant=react       # or nextjs, fullstack, freelance
node resume/build.mjs --no-case-studies     # one-page premium, no appendix
node resume/build.mjs --final               # refuses to build with placeholders left
```

## Which file to send where

| Situation | Send |
| --- | --- |
| Online application form, job board, any portal | `ATS-Resume.md` content pasted, or the `.docx` |
| Applicant tracking system upload | `.docx` from `ATS-Resume.doc.html` |
| Direct email to a hiring manager or recruiter | `Premium-Resume.pdf` |
| Freelance client comparing proposals | `Premium-Resume.pdf` (with case studies) |
| Your own site, `/resume.pdf` | published automatically by `npm run resume:pdf` |
| GitHub profile README, Notion | `Premium-Resume.md` |

The two are different documents on purpose. The ATS version is single-column
plain text with every keyword spelled out, because a parser reads it. The
premium version is two-column, typeset in the portfolio's typefaces, and shows
five merged skill groups instead of nine exhaustive ones, because a person reads
it — in about forty seconds.

**Never send only the premium PDF to a portal.** Multi-column layout is the most
common reason a good resume scores badly on extraction.

## The site's Résumé button

Four components link to `PERSONAL.resumeUrl` (`/resume.pdf`): the header, the
mobile menu, the About section and the contact block. `npm run resume:pdf`
copies the built PDF to `public/resume.pdf`, which is what those links resolve
to.

Before that copy existed every one of them 404'd, and the SPA history fallback
made it quiet: the request fell through to `index.html` and React Router
rendered the 404 page, so it looked like a broken route rather than a missing
file. Never add the PDF to `public/` by hand — it will drift behind the data.

The export currently carries placeholders, including the name, and it is
downloadable from the site. The build warns about this on every run until
`npm run resume:check` comes back clean.

## Editing

Everything lives in `resume-data.json`. The generated files carry a
`GENERATED FILE` banner and are overwritten on every build.

Anything in `[square brackets]` is a slot. `npm run resume:check` lists them all;
`--final` refuses to build while any remain, so an unfinished resume cannot be
attached to an application by accident. On the premium page, unfilled slots print
grey with a dotted underline — a draft never looks finished at a glance.

## What was taken from the portfolio, and what was not

Content was extracted from `src/data/*.js`: the summary from `personal.js` and
`about.js`, skills from `skills.js`, experience from `experience.js`, projects
from `projects.js`, and the four-year arc from `timeline.js`.

Nothing was invented. Where the portfolio had no answer the field is an empty
slot:

- **Name, email, phone, location, LinkedIn** — all still placeholders in
  `personal.js`. The GitHub URL is the one verified entry.
- **Education** — `experience.js` keeps `EDUCATION` deliberately empty, with the
  note that a qualification is a verifiable claim.
- **Certificates** — nothing recorded anywhere. None were invented.
- **Languages** — not recorded. Not guessed.
- **EV Charger Finder** — no description, stack, or repository exists for this
  project anywhere in the codebase. Every field is a slot.
- **EXMO** — carries `PLACEHOLDER` in `projects.js` too, for the same reason.

Two things need checking rather than filling:

- **Experience dates are inferred**, not recorded. `experience.js` flags them the
  same way. Check each period against what actually happened.
- **Skill levels** in the portfolio were an opening estimate. The resume lists
  technologies without proficiency claims, which sidesteps the problem — but
  every technology named is one you may be asked to demonstrate.

## Keeping it in step with the portfolio

The resume does not import from `src/data/` — it is a snapshot, because a resume
should not silently change when you refactor a data file the night before an
interview. The cost is that the two can drift.

When you change `skills.js`, `experience.js` or `projects.js`, update
`resume-data.json` in the same commit. `meta.lastReviewed` is there to record
when you last checked the whole thing end to end.
