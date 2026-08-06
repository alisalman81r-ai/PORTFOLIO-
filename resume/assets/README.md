# Resume assets

Empty by design. Nothing here is required to build either resume.

## What belongs here

- `headshot.jpg` — only if you are applying somewhere a photo is expected.
- `signature.png` — for cover letters, not the resume.

## On headshots

Neither template renders one, and that is a deliberate default rather than an
oversight.

- **ATS resume:** a photo is unreadable to a parser, and on some layouts it
  displaces the text around it badly enough to break name extraction.
- **International applications:** the US, UK, Canada, Australia and Ireland all
  advise against photos, because employers there actively avoid the
  discrimination exposure that comes with them. Several companies discard
  resumes with photos before review for exactly that reason.
- **Where a photo is expected** — much of continental Europe, parts of Asia,
  the Middle East and Latin America — add it to the premium template only, and
  keep the ATS version clean.

If you need one, put it here and add an `<img>` to the masthead in
`templates/premium.mjs`. Keep it under 200 kB; the PDF already carries ~200 kB
of embedded fonts.
