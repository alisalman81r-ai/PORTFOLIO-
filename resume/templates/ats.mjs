/**
 * ATS resume template — one page, plain text, machine-readable.
 *
 * WHAT AN ATS ACTUALLY DOES
 * Applicant tracking systems parse a document into fields by looking for
 * conventional section headings and then reading the plain text under them.
 * They are not browsers. Anything that carries meaning visually rather than
 * textually is lost, and in the worst case shifts the text around it:
 *
 *   - TABLES        Parsed in unpredictable order. A two-column skills table can
 *                   come out interleaved, so "React" ends up next to "2022".
 *   - COLUMNS       Same failure, one layer up. Multi-column layouts are the
 *                   single most common reason a good resume scores badly.
 *   - IMAGES        Text inside an image is invisible. A logo header can take
 *                   the candidate's name with it.
 *   - HEADERS AND FOOTERS
 *                   Several parsers skip them entirely. Contact details put
 *                   there are simply not read.
 *   - ICONS AND GLYPHS
 *                   A phone icon instead of the word "Phone" removes the label
 *                   the parser was looking for.
 *
 * So this template emits nothing but headings, paragraphs and hyphen bullets.
 * It is deliberately plain, and that plainness is the feature — the premium
 * template is where the design lives.
 *
 * SECTION HEADINGS use the conventional wording parsers are trained on
 * ("Professional Summary", "Technical Skills", "Work Experience", "Education").
 * A cleverer heading is a worse heading here.
 *
 * KEYWORDS come from the skills matrix verbatim, because ATS keyword matching is
 * literal: a posting asking for "Next.js" does not match "NextJS". Where a term
 * has two common spellings the widely-used one is used and the variant appears
 * once in the skills list.
 */

/** Strips the private `_note` / `_warning` keys the data file uses for guidance. */
const publicEntries = (object) =>
  Object.entries(object).filter(([key]) => !key.startsWith('_'))

/**
 * One page is a hard constraint, so projects print compressed to three lines:
 * name with role and year, one sentence, then the stack. Outcomes and the full
 * case-study record live in the premium PDF — a recruiter who wants depth has
 * the portfolio URL, and one who does not gets a page they read to the end.
 */
function compressProject(project) {
  const lines = []
  const meta = [project.role, project.year].filter(Boolean).join(' · ')

  // First sentence only, derived rather than stored twice — a second copy of
  // every overview would be one more thing to keep in step. The lookbehind
  // splits on a full stop followed by whitespace, so decimals and "Next.js"
  // survive intact.
  const [firstSentence] = project.overview.split(/(?<=\.)\s/)

  lines.push(`**${project.name}** — ${project.category}${meta ? ` (${meta})` : ''}  `)
  lines.push(`${firstSentence}  `)
  lines.push(`Technologies: ${project.technologies.join(', ')}`)

  return lines.join('\n')
}

/**
 * @param {object} data Parsed resume-data.json.
 * @param {object} options
 * @param {string} options.variant Which summary and title to use.
 * @param {boolean} [options.showInterests]
 * @returns {string} Markdown.
 */
export function renderAts(data, { variant, showInterests = false }) {
  const { header, contact, skills, softSkills, experience, projects } = data
  // Every cut that makes this fit one page is declared in the data file, so the
  // trade-offs stay visible and adjustable rather than buried in here.
  const ats = data.atsDisplay ?? {}
  const out = []
  const push = (...lines) => out.push(...lines)

  const title = data.titleVariants[variant] ?? header.title
  const summary = data.summaryVariants[variant] ?? data.summaryVariants.frontend

  // ── Header ────────────────────────────────────────────────────────────────
  // Name as an H1 and the contact block as plain labelled text on one line.
  // Labels are spelled out ("Email:", "Phone:") because that is the token the
  // parser looks for — an icon or a bare address is guesswork for it.
  push(`# ${header.name}`, '')
  push(`## ${title}`, '')

  const contactLine = [
    contact.email && `Email: ${contact.email}`,
    contact.phone && `Phone: ${contact.phone}`,
    header.location && `Location: ${header.location}`,
  ].filter(Boolean).join(' | ')

  const linkLine = [
    contact.website && `Portfolio: ${contact.website}`,
    contact.github && `GitHub: ${contact.github}`,
    contact.linkedin && `LinkedIn: ${contact.linkedin}`,
  ].filter(Boolean).join(' | ')

  // One paragraph rather than three. The labels are what the parser matches, and
  // they survive being on the same line — the blank lines between them did not
  // earn the 12mm they cost.
  // Two trailing spaces before the newline is a markdown hard break: the lines
  // stay visually separate but become one paragraph, which is what the parser
  // reads and what saves the vertical space.
  push([contactLine, linkLine, header.openTo && `Open to: ${header.openTo}`]
    .filter(Boolean)
    .join('  \n'), '')

  // ── Summary ───────────────────────────────────────────────────────────────
  push('---', '', '## Professional Summary', '', summary, '')

  // ── Skills ────────────────────────────────────────────────────────────────
  // One line per category, comma-separated. Not a table: see the note above.
  // Merged into fewer labelled lines per `atsDisplay.skillGroups`. Every keyword
  // survives — that is what the parser matches on — and only the number of
  // headings drops, which is what was costing vertical space.
  push('## Technical Skills', '')
  const skillGroups =
    ats.skillGroups ?? publicEntries(skills).map(([label]) => ({ label, from: [label] }))
  for (const group of skillGroups) {
    const items = group.from.flatMap((key) => skills[key] ?? [])
    if (items.length) push(`**${group.label}:** ${items.join(', ')}`, '')
  }

  push(
    '**Professional Skills:** ' +
      softSkills.items.slice(0, ats.softSkillLimit ?? softSkills.items.length).join(', '),
    '',
  )

  // ── Experience ────────────────────────────────────────────────────────────
  // "Work Experience" rather than anything more inventive — parsers match the
  // conventional phrase, and the date format `Month YYYY — Month YYYY` on its
  // own line is the shape they expect to find under a role.
  push('## Work Experience', '')
  for (const entry of experience.entries) {
    push(`### ${entry.role} — ${entry.organisation}`, '')
    push(`${entry.period} | ${entry.location} | ${entry.type}`, '')
    // The role summary restates its own bullets; it is the first thing cut
    // when a page is short, and the last thing missed.
    if (ats.includeRoleSummaries) push(entry.summary, '')
    entry.bullets
      .slice(0, ats.bulletLimit ?? entry.bullets.length)
      .forEach((bullet) => push(`- ${bullet}`))
    push('')
    push(`Technologies: ${entry.technologies.join(', ')}`, '')
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  push('## Projects', '')
  for (const project of projects.items.slice(0, ats.projectLimit ?? projects.items.length)) {
    push(compressProject(project), '')
  }

  // ── Education ─────────────────────────────────────────────────────────────
  // Printed even when empty, because an ATS scoring a resume for a "degree"
  // field finds nothing if the heading is absent. If you have no qualification
  // to list, delete the section in the data file — that is a choice worth
  // making deliberately rather than by omission.
  push('## Education', '')
  for (const entry of data.education.entries) {
    const tail = [entry.period, entry.location].filter(Boolean).join(', ')
    push(`**${entry.qualification}** — ${entry.institution}${tail ? ` (${tail})` : ''}`, '')
    if (entry.note) push(entry.note, '')
  }

  // ── Certifications ────────────────────────────────────────────────────────
  push('## Certifications', '')
  for (const entry of data.certificates.entries) {
    const suffix = entry.credentialId ? ` (Credential ID: ${entry.credentialId})` : ''
    push(`- ${entry.name} — ${entry.issuer}, ${entry.date}${suffix}`)
  }
  push('')

  // ── Languages ─────────────────────────────────────────────────────────────
  push('## Languages', '')
  push(data.languages.entries.map((e) => `${e.language} (${e.level})`).join(', '), '')

  // ── Highlights ────────────────────────────────────────────────────────────
  push('## Key Achievements', '')
  data.highlights.items
    .slice(0, ats.achievementLimit ?? data.highlights.items.length)
    .forEach((item) => push(`- ${item}`))
  push('')

  if (showInterests) {
    push('## Interests', '')
    push(data.interests.items.join(', '), '')
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}
