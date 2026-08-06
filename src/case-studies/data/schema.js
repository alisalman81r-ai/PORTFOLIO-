import { getProjectBySlug } from '@/data'

/**
 * Case study data model.
 *
 * WHY THIS EXTENDS `projects.js` RATHER THAN RESTATING IT
 * -------------------------------------------------------
 * A project already has a title, a category, a year, a role, a stack and a
 * thumbnail — all in `src/data/projects.js`, which drives the cards and filters
 * on the home page. Copying those into a second file would mean a project could
 * be called one thing on the grid and another on its own page, and the two would
 * drift the first time either was edited.
 *
 * So a case study file carries only what the deep-dive adds: the business goal,
 * the design process, the development detail, the results. Everything else is
 * inherited. `defineCaseStudy` merges the two and fails loudly if the slug does
 * not resolve, which turns a typo into an error at import time rather than a
 * blank page in production.
 *
 * NULL IS A MEANINGFUL VALUE HERE
 * -------------------------------
 * Not every section applies to every project. A storyboard has no database; a
 * marketing site has no API. Those sections are set to `null` and the renderer
 * skips them entirely — which is different from leaving them as an empty
 * placeholder, and reads differently too. An absent Backend section says "this
 * was a frontend project". A Backend section full of "PLACEHOLDER" says "this
 * was written carelessly".
 *
 * Use `null` when a section genuinely does not apply. Use a `PLACEHOLDER` string
 * when it applies and you have not written it yet.
 */

/**
 * @typedef {object} CaseHero
 * @property {string} [statement] One line above the title. The thesis of the
 *   project, not a description of it.
 * @property {string} [image] Overrides the project thumbnail for the hero.
 * @property {{label: string, href: string, icon?: string, variant?: 'primary'|'outline'}[]} [ctas]
 */

/**
 * @typedef {object} CaseOverview
 * @property {string} summary       Two or three sentences. The elevator version.
 * @property {string} detail        The long form. Newline-separated paragraphs.
 * @property {string} businessGoal  What the work was supposed to achieve for
 *   whoever paid for it — not what it was built with.
 * @property {{label: string, value: string}[]} [facts] Small key/value pairs for
 *   the sidebar: team size, budget band, platform, anything scannable.
 */

/**
 * @typedef {object} CaseProblem
 * @property {string} what   The problem itself.
 * @property {string} who    Who experienced it. Be specific — "users" is not an
 *   audience, it is a way of avoiding naming one.
 * @property {string} why    Why it mattered. The cost of leaving it alone.
 * @property {string[]} [evidence] What told you this was real. Observations,
 *   not statistics, unless you measured them.
 */

/**
 * @typedef {object} CaseSolution
 * @property {string} approach       How the solution works, in plain terms.
 * @property {string} designThinking The reasoning behind the design decisions.
 * @property {string} strategy       The development strategy, and why that order.
 * @property {{title: string, description: string, icon?: string}[]} [principles]
 */

/**
 * @typedef {object} CaseDesignPhase
 * @property {string} id
 * @property {string} label       Planning, Research, Wireframes, UI Design, UX.
 * @property {string} icon        Registry key for `<Icon />`.
 * @property {string} description
 * @property {string[]} [points]
 * @property {string|null} [image] A wireframe or artefact. `null` renders an
 *   empty frame naming what belongs there.
 * @property {string} [imageHint] What the empty frame should ask for.
 */

/**
 * @typedef {object} CaseDevelopment
 * @property {string|null} architecture
 * @property {string|null} frontend
 * @property {string|null} backend
 * @property {string|null} database
 * @property {string|null} api
 * @property {string|null} deployment
 * @property {string[]} [decisions] Notable calls and their trade-offs.
 */

/**
 * @typedef {object} CaseChallengeGroup
 * @property {'technical'|'design'|'performance'} kind
 * @property {{challenge: string, solution: string}[]} items
 */

/**
 * @typedef {object} CaseResults
 * @property {string[]} impact          Qualitative outcomes. No invented numbers.
 * @property {string[]} [performance]   Measured improvements only.
 * @property {string[]} lessons         What you would do differently.
 * @property {{label: string, value: string, note?: string}[]} [metrics] Only for
 *   figures you actually measured. Leave empty rather than estimating.
 */

/**
 * @typedef {object} CaseStudy
 * @property {import('@/data/projects').Project} project The inherited record.
 * @property {CaseHero} hero
 * @property {CaseOverview} overview
 * @property {CaseProblem} problem
 * @property {CaseSolution} solution
 * @property {CaseDesignPhase[]} design
 * @property {CaseDevelopment|null} development
 * @property {CaseChallengeGroup[]} challenges
 * @property {CaseResults} results
 * @property {{caption: string, image: string|null, hint?: string}[]} gallery
 * @property {string[]} future
 * @property {boolean} [draft] Marks a case study whose content is still
 *   placeholder. Rendered with a visible banner rather than hidden, so an
 *   unfinished page can never be mistaken for a finished one.
 */

/**
 * Build a case study from a project slug and its deep-dive content.
 *
 * @param {string} slug Must match a `slug` in `projects.js`.
 * @param {Omit<CaseStudy, 'project'>} extension
 * @returns {CaseStudy}
 */
export function defineCaseStudy(slug, extension) {
  const project = getProjectBySlug(slug)

  if (!project) {
    // Thrown at module evaluation, so a mistyped slug breaks the build rather
    // than rendering an empty page that nobody notices until a client opens it.
    throw new Error(
      `defineCaseStudy("${slug}"): no project with that slug in src/data/projects.js. ` +
        'Add the project there first — the case study inherits its title, category, ' +
        'year, role, stack and thumbnail from that record.',
    )
  }

  return { project, ...extension }
}

/**
 * The gallery, resolved against whatever images `media.js` actually holds.
 *
 * Captions are authored per project and images come from the media registry, so
 * the two lists are almost never the same length. Rather than truncating to the
 * shorter one — which silently drops a caption you wrote — every caption is kept
 * and any without an image renders an empty frame asking for it.
 *
 * @param {import('@/data/projects').Project} project
 * @param {{caption: string, hint?: string}[]} captions
 * @returns {{caption: string, image: string|null, hint?: string}[]}
 */
export function resolveGallery(project, captions) {
  return captions.map((entry, index) => ({
    ...entry,
    image: project.gallery?.[index] ?? null,
  }))
}
