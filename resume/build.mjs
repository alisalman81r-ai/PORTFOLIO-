/**
 * Resume build — one data file in, every format out.
 *
 * WHY THIS EXISTS RATHER THAN THREE HAND-MAINTAINED DOCUMENTS
 * The usual arrangement is a .docx, a PDF and a plain-text copy, each edited
 * separately. Within two applications they disagree: the PDF says 2025, the
 * .docx still says 2024, and nobody notices until an interviewer does. This
 * repository already refuses that pattern everywhere else — achievement
 * counters are computed from the project list rather than typed — and the same
 * rule applies here. `resume-data.json` is the only file anyone edits.
 *
 * USAGE
 *   node resume/build.mjs                     Build every target, default variant
 *   node resume/build.mjs --variant=react     Tailor the summary and job title
 *   node resume/build.mjs --check             Report unfilled placeholders only
 *   node resume/build.mjs --final             Refuse to build if placeholders remain
 *
 * VARIANTS exist because a Next.js posting and a freelance client want different
 * opening paragraphs from the same career. Everything else on the page is
 * identical — only the summary and the job title change, because rewriting the
 * body per application is how resumes end up with claims their author has
 * forgotten making.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { renderAts } from './templates/ats.mjs'
import { renderPremium } from './templates/premium.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const EXPORTS = path.join(HERE, 'exports')

/** Where each embedded typeface comes from. Paths are relative to the repo root. */
const FONT_SOURCES = {
  bricolage: 'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2',
  inter: 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  serif400: 'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
  mono: 'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
}

const argv = process.argv.slice(2)
const flag = (name, fallback = null) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=')[1] : argv.includes(`--${name}`) ? true : fallback
}

const data = JSON.parse(fs.readFileSync(path.join(HERE, 'resume-data.json'), 'utf8'))
const variant = flag('variant', data.meta.defaultVariant)
const checkOnly = flag('check', false)
const isFinal = flag('final', false)

if (!data.summaryVariants[variant]) {
  console.error(
    `Unknown variant "${variant}". Available: ${Object.keys(data.summaryVariants).filter((k) => !k.startsWith('_')).join(', ')}`,
  )
  process.exit(1)
}

/**
 * Walks the data and reports every `[bracketed]` slot still unfilled.
 *
 * The point is that an unfinished resume should be impossible to send by
 * accident. `--final` turns this from a warning into a build failure, so the
 * export you attach to an application is one that could not contain
 * "[Your Full Name]".
 */
function findPlaceholders(node, trail = []) {
  const found = []
  if (typeof node === 'string') {
    const matches = node.match(/\[[^\]]+\]/g)
    if (matches) found.push({ path: trail.join('.'), values: matches })
  } else if (Array.isArray(node)) {
    node.forEach((item, i) => found.push(...findPlaceholders(item, [...trail, i])))
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      // `_note`, `_warning` and `_readme` are guidance for the author and are
      // never rendered, so bracketed examples inside them are not defects.
      if (key.startsWith('_')) continue
      found.push(...findPlaceholders(value, [...trail, key]))
    }
  }
  return found
}

const placeholders = findPlaceholders(data)

if (checkOnly) {
  if (!placeholders.length) {
    console.log('No placeholders remaining — the data file is complete.')
    process.exit(0)
  }
  console.log(`${placeholders.length} field(s) still unfilled:\n`)
  for (const item of placeholders) {
    console.log(`  ${item.path}`)
    item.values.forEach((v) => console.log(`      ${v}`))
  }
  console.log('\nFill these in resume-data.json, then rebuild.')
  process.exit(0)
}

if (isFinal && placeholders.length) {
  console.error(
    `Refusing to build --final with ${placeholders.length} unfilled field(s).\n` +
      'Run `node resume/build.mjs --check` to list them.',
  )
  process.exit(1)
}

fs.mkdirSync(EXPORTS, { recursive: true })

/** Reads the embedded typefaces, skipping any that are not installed. */
function loadFonts() {
  const fonts = {}
  for (const [key, relative] of Object.entries(FONT_SOURCES)) {
    const file = path.join(ROOT, relative)
    if (fs.existsSync(file)) {
      fonts[key] = fs.readFileSync(file).toString('base64')
    } else {
      console.warn(`  ! font missing, falling back to system: ${relative}`)
    }
  }
  return fonts
}

const written = []
const write = (file, contents) => {
  fs.writeFileSync(file, contents)
  written.push({ file: path.relative(ROOT, file), bytes: Buffer.byteLength(contents) })
}

const banner = (name) =>
  `<!-- GENERATED FILE — do not edit.\n` +
  `     Source: resume/resume-data.json · Template: resume/templates/${name}\n` +
  `     Rebuild: npm run resume -->\n`

// ── 1. ATS resume, markdown ──────────────────────────────────────────────────
const atsMarkdown = renderAts(data, { variant, showInterests: false })
write(
  path.join(HERE, 'ATS-Resume.md'),
  `<!-- GENERATED FILE — edit resume/resume-data.json, then run: npm run resume -->\n\n${atsMarkdown}`,
)

// ── 2. Premium resume, print-ready HTML ──────────────────────────────────────
const fonts = loadFonts()
// Case studies are three extra pages. Worth sending to a client weighing
// proposals or a hiring manager who asked about the work; not worth attaching
// to a first application, where one page is read and the rest is skimmed.
const withCaseStudies = !flag('no-case-studies', false)
const premiumHtml = renderPremium(data, { variant, fonts, caseStudies: withCaseStudies })
write(path.join(EXPORTS, 'Premium-Resume.html'), banner('premium.mjs') + premiumHtml)

// ── 3. Premium resume, markdown ──────────────────────────────────────────────
// The same content as the HTML, for anywhere markdown is what is wanted — a
// GitHub profile README, a Notion page, a job board that accepts text.
write(
  path.join(HERE, 'Premium-Resume.md'),
  `<!-- GENERATED FILE — edit resume/resume-data.json, then run: npm run resume -->\n\n` +
    renderPremiumMarkdown(data, variant),
)

// ── 4. Word-importable HTML ──────────────────────────────────────────────────
// Word opens HTML and saves as .docx with styles intact. This is a genuinely
// better route than generating a .docx directly: the file stays diffable in git,
// and the styles arrive as real Word styles you can edit, rather than as the
// direct formatting most .docx generators emit — which is unusable the moment
// someone wants to change the heading font.
write(path.join(EXPORTS, 'ATS-Resume.doc.html'), renderWordHtml(data, variant, atsMarkdown))

// ── 5. YAML mirror ───────────────────────────────────────────────────────────
// Generated, not authored. Some tools want YAML; keeping a second hand-edited
// copy would reintroduce exactly the drift this build exists to prevent.
write(path.join(EXPORTS, 'resume-data.yaml'), toYaml(data))

console.log(`Built resume — variant "${variant}"\n`)
for (const item of written) {
  console.log(`  ${item.file.padEnd(42)} ${(item.bytes / 1024).toFixed(1)} kB`)
}
if (placeholders.length) {
  console.log(
    `\n  ${placeholders.length} placeholder field(s) remain. Run with --check to list them.`,
  )
}
console.log('\n  PDF: open exports/Premium-Resume.html and print to PDF (A4, margins: none,')
console.log('       background graphics: on), or run `npm run resume:pdf` if Chrome is installed.')

// ── Renderers that are small enough to live here ─────────────────────────────

/**
 * Markdown twin of the premium layout.
 *
 * Markdown cannot express the two-column rail, so the rail's content becomes
 * ordinary sections in reading order. That is the correct degradation: the
 * hierarchy survives even though the composition does not.
 */
function renderPremiumMarkdown(data, variant) {
  const { header, contact, skills, softSkills, experience, projects } = data
  const title = data.titleVariants[variant] ?? header.title
  const summary = data.summaryVariants[variant] ?? data.summaryVariants.frontend
  const pub = (o) => Object.entries(o).filter(([k]) => !k.startsWith('_'))
  const out = []

  out.push(`# ${header.name}`, '', `**${title}** — *${header.tagline}*`, '')
  out.push(
    [
      contact.email && `[${contact.email}](mailto:${contact.email})`,
      contact.website,
      contact.github && `[${contact.github}](${contact.githubUrl})`,
      contact.linkedin,
      header.location,
    ]
      .filter(Boolean)
      .join(' · '),
    '',
  )
  out.push('---', '', '## Profile', '', summary, '')

  out.push('## Experience', '')
  for (const e of experience.entries) {
    out.push(`### ${e.role} · ${e.organisation}`, '')
    out.push(`*${e.period} — ${e.type}, ${e.location}*`, '')
    out.push(e.summary, '')
    e.bullets.forEach((b) => out.push(`- ${b}`))
    out.push('', `\`${e.technologies.join('` `')}\``, '')
  }

  out.push('## Selected Projects', '')
  for (const p of projects.items) {
    out.push(`### ${p.name}`, '')
    out.push(`*${p.category} · ${p.role} · ${p.year} · ${p.status}*`, '')
    out.push(p.overview, '')
    out.push(`**Problem.** ${p.problem}`, '')
    out.push(`**Solution.** ${p.solution}`, '')
    out.push('**Features**', '')
    p.features.forEach((f) => out.push(`- ${f}`))
    out.push('')
    if ((p.challenges ?? []).length) {
      out.push('**Challenges**', '')
      p.challenges.forEach((c) => out.push(`- ${c.challenge} → ${c.solution}`))
      out.push('')
    }
    out.push('**Outcome**', '')
    ;(p.outcome ?? []).forEach((o) => out.push(`- ${o}`))
    out.push('', `\`${p.technologies.join('` `')}\``, '')
  }

  out.push('## Skills', '')
  for (const [category, items] of pub(skills)) {
    out.push(`**${category}** — ${items.join(' · ')}`, '')
  }
  out.push(`**Strengths** — ${softSkills.items.join(' · ')}`, '')

  out.push('## Education', '')
  data.education.entries.forEach((e) =>
    out.push(`**${e.qualification}**, ${e.institution} — *${e.period}*`, ''),
  )

  out.push('## Certifications', '')
  data.certificates.entries.forEach((e) => out.push(`- ${e.name} — ${e.issuer}, ${e.date}`))
  out.push('')

  out.push('## Languages', '')
  data.languages.entries.forEach((e) => out.push(`- ${e.language} — ${e.level}`))
  out.push('')

  out.push('## Highlights', '')
  data.highlights.items.forEach((h) => out.push(`- ${h}`))

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

/**
 * Word-flavoured HTML.
 *
 * Named styles rather than inline formatting, and a single serif-free stack that
 * exists on every Windows and macOS install — the embedded webfonts are
 * deliberately not carried over here, because Word's HTML importer does not
 * reliably embed them and a missing font in a .docx substitutes silently.
 */
function renderWordHtml(data, variant, markdown) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const html = esc(markdown)
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/^---$/gm, '<hr>')
    .split('\n\n')
    .map((block) =>
      block.startsWith('<h') || block.startsWith('<hr') || block.startsWith('<li')
        ? block.includes('<li>')
          ? `<ul>${block}</ul>`
          : block
        : `<p>${block}</p>`,
    )
    .join('\n')

  return `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta charset="utf-8">
<title>${esc(data.header.name)} — Resume</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>
/* SPACING IS THE WHOLE FIGHT ON A ONE-PAGE RESUME.
   At 5pt below every paragraph, the forty-odd paragraphs here spent 70mm — a
   quarter of the page — on whitespace alone, and the document ran to 1.8 pages
   with nothing worth cutting. These values are tuned against a measured A4 text
   block (178mm wide, 261mm tall). Loosen them and it spills; the content is
   already as short as it can honestly be. */
@page { size: A4; margin: 13mm 16mm; }
body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 9.3pt; line-height: 1.2; color: #1a1a1e; }
h1 { font-size: 20pt; margin: 0 0 1pt; letter-spacing: -0.3pt; }
h2 { font-size: 10.5pt; margin: 5pt 0 2pt; text-transform: uppercase; letter-spacing: 1pt;
     border-bottom: 1pt solid #1a1a1e; padding-bottom: 1.5pt; }
h3 { font-size: 10pt; margin: 5pt 0 0; }
p  { margin: 0 0 1.5pt; }
ul { margin: 1.5pt 0 2pt 14pt; padding: 0; }
li { margin: 0; }
hr { border: 0; border-top: 1pt solid #1a1a1e; margin: 4pt 0; }
</style>
</head>
<body>
${html}
</body>
</html>
`
}

/**
 * Minimal YAML writer.
 *
 * Hand-rolled rather than adding a dependency for one generated artefact.
 * Quotes every scalar, which is verbose but is the only way to be certain a
 * value containing a colon, a hash or a leading dash survives the round trip.
 */
function toYaml(node, indent = 0) {
  const pad = '  '.repeat(indent)
  if (node === null) return 'null'
  if (typeof node === 'string') return JSON.stringify(node)
  if (typeof node === 'number' || typeof node === 'boolean') return String(node)

  if (Array.isArray(node)) {
    if (!node.length) return '[]'
    return (
      '\n' +
      node
        .map((item) => {
          const rendered = toYaml(item, indent + 1)
          return rendered.startsWith('\n')
            ? `${pad}-${rendered.replace(/\n {2}/g, '\n  ')}`
            : `${pad}- ${rendered}`
        })
        .join('\n')
    )
  }

  const entries = Object.entries(node)
  if (!entries.length) return '{}'
  return (
    '\n' +
    entries
      .map(([key, value]) => {
        const rendered = toYaml(value, indent + 1)
        return `${pad}${key}:${rendered.startsWith('\n') ? rendered : ` ${rendered}`}`
      })
      .join('\n')
  )
}
