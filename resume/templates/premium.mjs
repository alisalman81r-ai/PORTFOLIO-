/**
 * Premium resume template — print-first HTML, styled from the portfolio's own
 * design tokens.
 *
 * WHY THE LIGHT PALETTE, WHEN THE SITE IS DARK
 * The portfolio ships two themes and both are the brand. A resume is printed,
 * attached to emails, and opened in PDF viewers that ignore background graphics
 * by default — a dark page either arrives as black text on white anyway, or
 * arrives correctly and costs the reader a full ink cartridge. So this uses the
 * *light* half of the same token set: identical hues, identical type, identical
 * spacing rhythm, calibrated for paper. Values are copied from
 * `src/styles/theme.css` and noted where they differ.
 *
 * THE FOUR TYPEFACES ARE THE PORTFOLIO'S, IN THEIR PORTFOLIO ROLES
 *   Bricolage Grotesque  display — the name, and nothing else
 *   Instrument Serif     italic accent — the tagline, matching `.accent-serif`
 *   Inter                body copy
 *   JetBrains Mono       eyebrows, dates, tech lists — matching `.eyebrow`
 *
 * They are embedded as base64 by `build.mjs` rather than linked. A resume gets
 * forwarded, re-saved and opened on machines that have none of these installed;
 * a linked font silently becomes Times New Roman on someone else's screen, and
 * the first impression is gone. ~200 KB is a fair price for a document that
 * looks the same everywhere.
 *
 * TWO COLUMNS ARE FINE HERE — AND ONLY HERE
 * Multi-column layout is the most common reason a resume parses badly, which is
 * why the ATS template is single-column plain text. This version is for human
 * eyes: the recruiter who has already shortlisted you, the client comparing
 * proposals, the interviewer with it open on a second screen. Send the ATS
 * version to the portal and this one to the person.
 */

/**
 * @param {object} data Parsed resume-data.json.
 * @param {object} options
 * @param {string} options.variant
 * @param {Record<string, string>} options.fonts Base64 woff2 by family key.
 * @param {boolean} [options.caseStudies] Append the case-study page.
 * @returns {string} A complete, self-contained HTML document.
 */
export function renderPremium(data, { variant, fonts, caseStudies = true }) {
  const { header, contact, skills, softSkills, experience, projects } = data
  const title = data.titleVariants[variant] ?? header.title
  const summary = data.summaryVariants[variant] ?? data.summaryVariants.frontend

  const esc = (value) =>
    String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const publicEntries = (object) =>
    Object.entries(object).filter(([key]) => !key.startsWith('_'))

  // A placeholder should look unfinished on the page, not blend in. Anything in
  // [square brackets] renders dotted and greyed, so a draft can never be mistaken
  // for a finished document at a glance — including by you.
  const fill = (value) => {
    const text = esc(value ?? '')
    return text.replace(/\[([^\]]+)\]/g, '<span class="slot">$1</span>')
  }

  const fontFace = (family, key, weightRange, style = 'normal') =>
    fonts[key]
      ? `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${fonts[key]}) format('woff2${weightRange.includes(' ') ? '-variations' : ''}');font-weight:${weightRange};font-style:${style};font-display:swap}`
      : ''

  // Grouped per `skillsDisplay.premium` rather than one row per category. See
  // the note on that field: exhaustive keyword coverage is the ATS resume's job,
  // and repeating it here costs a third of the page for no reader benefit.
  // Falls back to the raw categories if the map is absent, so the template still
  // renders against an older data file.
  const groups = data.skillsDisplay?.premium ?? publicEntries(skills).map(([label]) => ({ label, from: [label] }))

  const skillRows = groups
    .map((group) => {
      const items = group.from.flatMap((key) => skills[key] ?? [])
      const shown = group.limit ? items.slice(0, group.limit) : items
      if (!shown.length) return ''
      return `
        <div class="skill-group">
          <p class="skill-label">${esc(group.label)}</p>
          <p class="skill-items">${shown.map(esc).join(' · ')}</p>
        </div>`
    })
    .join('')

  const experienceEntries = experience.entries
    .map(
      (entry) => `
      <article class="entry">
        <header class="entry-head">
          <h3 class="entry-role">${fill(entry.role)}</h3>
          <p class="entry-period">${fill(entry.period)}</p>
        </header>
        <p class="entry-org">${fill(entry.organisation)} <span class="dot">·</span> ${fill(entry.type)} <span class="dot">·</span> ${fill(entry.location)}</p>
        ${/* No summary paragraph here, deliberately: it restates the bullets
              directly beneath it. On screen that reads as thorough; on a page a
              recruiter scans in forty seconds it reads as the same thing said
              twice. The ATS version keeps it, because a parser extracting a
              role description benefits from the prose. */ ''}
        <ul class="bullets">
          ${entry.bullets.map((b) => `<li>${fill(b)}</li>`).join('')}
        </ul>
        <p class="tech">${entry.technologies.map(esc).join(' · ')}</p>
      </article>`,
    )
    .join('')

  const caseStudyPages = !caseStudies
    ? ''
    : `
    <section class="page case-studies">
      <header class="cs-head">
        <p class="eyebrow">Selected Work</p>
        <h2 class="cs-title">Projects &amp; Case Studies</h2>
        <p class="cs-intro">The reasoning behind the work — the problem, the decision, and what it changed.</p>
        <ul class="bullets cs-highlights">
          ${data.highlights.items.map((item) => `<li>${fill(item)}</li>`).join('')}
        </ul>
      </header>
      ${projects.items
        .map(
          (project) => `
        <article class="case">
          <header class="case-head">
            <h3 class="case-name">${fill(project.name)}</h3>
            <p class="case-meta">${fill(project.category)} <span class="dot">·</span> ${fill(project.role)} <span class="dot">·</span> ${fill(project.year)} <span class="dot">·</span> ${fill(project.status)}</p>
          </header>
          <p class="case-overview">${fill(project.overview)}</p>
          <div class="case-grid">
            <div class="case-block">
              <p class="case-label">Problem</p>
              <p>${fill(project.problem)}</p>
            </div>
            <div class="case-block">
              <p class="case-label">Solution</p>
              <p>${fill(project.solution)}</p>
            </div>
          </div>
          <div class="case-block">
            <p class="case-label">Key features</p>
            <ul class="bullets">${project.features.map((f) => `<li>${fill(f)}</li>`).join('')}</ul>
          </div>
          ${
            (project.challenges ?? []).length
              ? `<div class="case-block">
                   <p class="case-label">Challenges</p>
                   <ul class="bullets challenges">
                     ${project.challenges
                       .map(
                         (c) =>
                           `<li><span class="challenge">${fill(c.challenge)}</span> <span class="resolution">${fill(c.solution)}</span></li>`,
                       )
                       .join('')}
                   </ul>
                 </div>`
              : ''
          }
          <div class="case-block">
            <p class="case-label">Outcome</p>
            <ul class="bullets">${(project.outcome ?? []).map((o) => `<li>${fill(o)}</li>`).join('')}</ul>
          </div>
          <p class="tech">${project.technologies.map(esc).join(' · ')}</p>
        </article>`,
        )
        .join('')}
    </section>`

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(header.name)} — ${esc(title)}</title>
<style>
${fontFace('Bricolage', 'bricolage', '200 800')}
${fontFace('InterVar', 'inter', '100 900')}
${fontFace('InstrumentSerif', 'serif400', '400', 'italic')}
${fontFace('JetBrainsVar', 'mono', '100 800')}

/* ── TOKENS ────────────────────────────────────────────────────────────────
   Copied from src/styles/theme.css, light theme. The two deliberate deviations
   are noted inline — both exist because paper is not a screen. */
:root {
  --ink: oklch(0.16 0.006 285);
  --muted: oklch(0.5 0.011 285);
  --faint: oklch(0.52 0.011 285);
  /* Light-theme accent. Already solved for 4.5:1 against white during the
     portfolio's accessibility pass, so it carries to print unchanged. */
  --accent: oklch(0.52 0.15 78);
  --line: oklch(0 0 0 / 0.12);
  --line-soft: oklch(0 0 0 / 0.07);
  /* DEVIATION 1: the page is pure white, not --canvas. Printers do not lay ink
     for a near-white background; they leave paper. Matching the token would
     only affect on-screen viewing, at the cost of a faint band where the
     sidebar tint meets the page edge. */
  --paper: #fff;
  /* DEVIATION 2: the sidebar tint is lighter than --sunken. Large flat areas
     print heavier than they appear on a backlit screen. */
  --tint: oklch(0.975 0.002 285);

  --font-display: 'Bricolage', 'Inter', system-ui, sans-serif;
  --font-sans: 'InterVar', system-ui, -apple-system, sans-serif;
  --font-serif: 'InstrumentSerif', Georgia, serif;
  --font-mono: 'JetBrainsVar', ui-monospace, 'SFMono-Regular', monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

@page {
  size: A4;
  /* The layout owns its own margins so the sidebar tint can bleed to the page
     edge. A printer margin here would leave a white gutter beside it. */
  margin: 0;
}

html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

body {
  font-family: var(--font-sans);
  font-size: 9.1pt;
  line-height: 1.44;
  color: var(--ink);
  background: var(--paper);
  font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
  text-rendering: optimizeLegibility;
}

.page {
  width: 210mm;
  min-height: 297mm;
  padding: 12mm 14mm 11mm;
  background: var(--paper);
  page-break-after: always;
  position: relative;
}
.page:last-child { page-break-after: auto; }

/* ── HEADER ───────────────────────────────────────────────────────────────
   The name is the only display-type on the page. A resume with three competing
   typographic voices reads as a template; one voice, used once, reads as a
   decision. */
.masthead {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 8mm;
  padding-bottom: 5mm;
  border-bottom: 1.5px solid var(--ink);
}
.name {
  font-family: var(--font-display);
  font-size: 27pt;
  font-weight: 600;
  letter-spacing: -0.024em;
  line-height: 1.02;
}
.role-line {
  margin-top: 2.4mm;
  font-family: var(--font-mono);
  font-size: 8pt;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}
/* The serif italic is the portfolio's one flourish — the accent line in every
   section heading on the site. It appears exactly once here, for the same
   reason it appears once there. */
.tagline {
  margin-top: 2.6mm;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 12.5pt;
  line-height: 1.25;
  color: var(--muted);
}
.availability {
  margin-top: 2.4mm;
  font-family: var(--font-mono);
  font-size: 7.2pt;
  letter-spacing: 0.07em;
  color: var(--faint);
}
.contact-block {
  text-align: right;
  font-size: 8.4pt;
  line-height: 1.75;
  color: var(--muted);
  white-space: nowrap;
}
.contact-block a { color: var(--ink); text-decoration: none; }
.contact-block .label {
  font-family: var(--font-mono);
  font-size: 6.8pt;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--faint);
  margin-right: 1.6mm;
}

/* ── BODY GRID ────────────────────────────────────────────────────────────
   Main column carries narrative (summary, experience, projects); the rail
   carries scannable facts. A recruiter reads the rail in four seconds and the
   main column only if the rail earned it. */
.body {
  display: grid;
  grid-template-columns: 1fr 68mm;
  gap: 9mm;
  margin-top: 6mm;
}

.section + .section { margin-top: 5.2mm; }

.eyebrow {
  font-family: var(--font-mono);
  font-size: 7pt;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--faint);
  margin-bottom: 2.6mm;
  padding-bottom: 1.4mm;
  border-bottom: 1px solid var(--line);
}

.summary { font-size: 9.35pt; line-height: 1.5; }

/* ── ENTRIES ──────────────────────────────────────────────────────────────
   "break-inside: avoid" matters more than it looks: an experience entry split
   across a page break puts your bullets on page two under no heading, and the
   reader has to reconstruct which job they belong to. */
.entry { break-inside: avoid; page-break-inside: avoid; }
.entry + .entry { margin-top: 3.6mm; }
.entry-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 4mm;
}
.entry-role { font-size: 10pt; font-weight: 600; letter-spacing: -0.008em; }
.entry-period {
  font-family: var(--font-mono);
  font-size: 7.6pt;
  color: var(--faint);
  white-space: nowrap;
}
.entry-org {
  font-size: 8.5pt;
  color: var(--accent);
  margin-top: 0.6mm;
  font-weight: 500;
}
.entry-summary { margin-top: 1.2mm; color: var(--muted); }
.dot { color: var(--line); padding: 0 0.4mm; }

.bullets { list-style: none; margin-top: 1.6mm; }
.bullets li {
  position: relative;
  padding-left: 3.6mm;
  margin-top: 0.7mm;
  line-height: 1.42;
}
/* An en dash rather than a bullet glyph: it sits on the baseline, matches the
   hairline rules elsewhere on the page, and does not punch a dark dot into an
   otherwise quiet left margin. */
.bullets li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.tech {
  margin-top: 1.8mm;
  font-family: var(--font-mono);
  font-size: 7.4pt;
  letter-spacing: 0.015em;
  color: var(--faint);
}

/* ── RAIL ─────────────────────────────────────────────────────────────────── */
.rail {
  background: var(--tint);
  border: 1px solid var(--line-soft);
  border-radius: 2.5mm;
  padding: 5mm 4.5mm;
  align-self: start;
}
.rail .eyebrow { border-bottom-color: var(--line-soft); }
.rail .section + .section { margin-top: 4mm; }

.skill-group + .skill-group { margin-top: 2.3mm; }
.skill-label {
  font-size: 8.2pt;
  font-weight: 600;
  margin-bottom: 0.5mm;
}
.skill-items {
  font-size: 8pt;
  line-height: 1.48;
  color: var(--muted);
}

.rail-list { list-style: none; font-size: 8.2pt; line-height: 1.42; }
.rail-list li + li { margin-top: 1.1mm; }
.rail-list .k {
  font-family: var(--font-mono);
  font-size: 7pt;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--faint);
  display: block;
}

/* ── PLACEHOLDERS ────────────────────────────────────────────────────────── */
.slot {
  color: var(--faint);
  border-bottom: 1px dotted var(--accent);
  padding-bottom: 0.2mm;
}

/* ── CASE STUDIES ────────────────────────────────────────────────────────── */
.case-studies { padding-top: 13mm; }
.cs-head { padding-bottom: 4mm; border-bottom: 1.5px solid var(--ink); }
.cs-title {
  font-family: var(--font-display);
  font-size: 19pt;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-top: 1mm;
}
.cs-head .eyebrow { border: 0; padding: 0; margin: 0; }
.cs-intro { margin-top: 1.6mm; color: var(--muted); font-size: 9pt; }

.cs-highlights { margin-top: 3mm; }
.case { margin-top: 6mm; break-inside: avoid; page-break-inside: avoid; }
.case-head { padding-bottom: 1.8mm; border-bottom: 1px solid var(--line); }
.case-name { font-size: 12pt; font-weight: 600; letter-spacing: -0.012em; }
.case-overview { margin-top: 2.2mm; font-size: 9.2pt; line-height: 1.5; }
.case-meta {
  font-family: var(--font-mono);
  font-size: 7.4pt;
  color: var(--faint);
  margin-top: 0.8mm;
}
.case-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5mm;
  margin-top: 2.8mm;
}
.case-block + .case-block { margin-top: 2.8mm; }
.case-grid .case-block + .case-block { margin-top: 0; }
.case-grid + .case-block { margin-top: 2.8mm; }
.case-label {
  font-family: var(--font-mono);
  font-size: 6.8pt;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1mm;
}
.case-block p { color: var(--muted); line-height: 1.46; }
.challenges .challenge { color: var(--ink); }
.challenges .challenge::after {
  content: ' — ';
  color: var(--accent);
  white-space: pre;
}
.challenges .resolution { color: var(--muted); }
.challenges li + li { margin-top: 1.6mm; }

/* ── SCREEN PREVIEW ──────────────────────────────────────────────────────── */
@media screen {
  body { background: oklch(0.93 0.003 285); padding: 8mm 0; }
  .page {
    margin: 0 auto 8mm;
    box-shadow: 0 1mm 6mm oklch(0 0 0 / 0.12);
  }
}
</style>
</head>
<body>

<section class="page">
  <header class="masthead">
    <div>
      <h1 class="name">${fill(header.name)}</h1>
      <p class="role-line">${esc(title)}</p>
      <p class="tagline">${fill(header.tagline)}</p>
      <p class="availability">${fill(header.availability)} <span class="dot">·</span> ${fill(header.openTo)}</p>
    </div>
    <div class="contact-block">
      ${contact.email ? `<div><span class="label">Email</span><a href="mailto:${esc(contact.email)}">${fill(contact.email)}</a></div>` : ''}
      ${contact.phone ? `<div><span class="label">Phone</span>${fill(contact.phone)}</div>` : ''}
      ${header.location ? `<div><span class="label">Based</span>${fill(header.location)}</div>` : ''}
      ${contact.website ? `<div><span class="label">Web</span>${fill(contact.website)}</div>` : ''}
      ${contact.github ? `<div><span class="label">Git</span><a href="${esc(contact.githubUrl)}">${esc(contact.github)}</a></div>` : ''}
      ${contact.linkedin ? `<div><span class="label">In</span>${fill(contact.linkedin)}</div>` : ''}
    </div>
  </header>

  <div class="body">
    <main>
      <section class="section">
        <p class="eyebrow">Profile</p>
        <p class="summary">${fill(summary)}</p>
      </section>

      <section class="section">
        <p class="eyebrow">Experience</p>
        ${experienceEntries}
      </section>


    </main>

    <aside class="rail">
      <section class="section">
        <p class="eyebrow">Skills</p>
        ${skillRows}
      </section>

      <section class="section">
        <p class="eyebrow">Strengths</p>
        <p class="skill-items">${softSkills.items.map(esc).join(' · ')}</p>
      </section>

      <section class="section">
        <p class="eyebrow">Education</p>
        <ul class="rail-list">
          ${data.education.entries
            .map(
              (e) =>
                `<li><span class="k">${fill(e.period)}</span>${fill(e.qualification)}<br>${fill(e.institution)}</li>`,
            )
            .join('')}
        </ul>
      </section>

      <section class="section">
        <p class="eyebrow">Certifications</p>
        <ul class="rail-list">
          ${data.certificates.entries
            .map((e) => `<li><span class="k">${fill(e.date)}</span>${fill(e.name)}<br>${fill(e.issuer)}</li>`)
            .join('')}
        </ul>
      </section>

      <section class="section">
        <p class="eyebrow">Languages</p>
        <ul class="rail-list">
          ${data.languages.entries.map((e) => `<li>${fill(e.language)} <span class="dot">·</span> ${fill(e.level)}</li>`).join('')}
        </ul>
      </section>

    </aside>
  </div>
</section>

${caseStudyPages}

</body>
</html>
`
}
