/**
 * Work history and education.
 *
 * Shaped for a vertical timeline: each entry is self-contained and sorts by
 * start date.
 *
 * DATES ARE ISO STRINGS ('2024-03'), NOT DISPLAY TEXT ('Mar 2024').
 *
 * Storing formatted text means it cannot be sorted, compared, or localised, and
 * the format is duplicated across every entry. Store the machine value; format
 * at render time with `formatDateRange()` from `@/utils`.
 *
 * A null `end` means "present" — computed, so a current role never goes stale.
 */

/**
 * @typedef {object} ExperienceEntry
 * @property {string} id           Stable key.
 * @property {string} role         Job title.
 * @property {string} company      Employer or client.
 * @property {string} [companyUrl] Links the company name.
 * @property {string} location     'City, Country' or 'Remote'.
 * @property {'full-time'|'contract'|'freelance'|'internship'} type
 * @property {string} start        ISO 'YYYY-MM'.
 * @property {string|null} end     ISO 'YYYY-MM', or null for a current role.
 * @property {string} summary      One or two sentences on scope and ownership.
 * @property {string[]} highlights Bullets. Lead with impact, not responsibilities.
 * @property {string[]} [stack]    Technologies used in the role.
 */

/**
 * PLACEHOLDER — replace with real history.
 *
 * Employment history is a verifiable factual claim that gets checked in
 * interviews and reference calls, so nothing here invents a company, a title,
 * or a date. Fill it in from your actual CV.
 *
 * @type {ExperienceEntry[]}
 */
export const EXPERIENCE = [
  {
    id: 'role-1',
    role: 'YOUR ROLE',
    company: 'COMPANY NAME',
    companyUrl: '',
    location: 'LOCATION',
    type: 'full-time',
    start: '2024-01',
    end: null,
    summary: 'WHAT YOU OWN AND THE SCOPE OF THE WORK.',
    highlights: [
      'ACHIEVEMENT — lead with the outcome, then how.',
      'ACHIEVEMENT — include a real number where you have one.',
    ],
    stack: ['TECH', 'TECH'],
  },
  {
    id: 'role-2',
    role: 'PREVIOUS ROLE',
    company: 'COMPANY NAME',
    location: 'LOCATION',
    type: 'full-time',
    start: '2022-01',
    end: '2023-12',
    summary: 'WHAT YOU DID HERE.',
    highlights: ['ACHIEVEMENT'],
    stack: ['TECH'],
  },
]

/**
 * @typedef {object} EducationEntry
 * @property {string} id
 * @property {string} qualification Degree or certification.
 * @property {string} institution
 * @property {string} start         ISO 'YYYY-MM'.
 * @property {string|null} end
 * @property {string} [note]        Honours, thesis, relevant focus.
 */

/** @type {EducationEntry[]} */
export const EDUCATION = [
  {
    id: 'education-1',
    qualification: 'QUALIFICATION',
    institution: 'INSTITUTION',
    start: '2018-09',
    end: '2022-06',
    note: '',
  },
]

/**
 * Experience sorted newest first — current roles at the top.
 *
 * Sorts a *copy*: `Array.prototype.sort` mutates in place, and reordering the
 * exported array would corrupt it for every other importer.
 *
 * @type {ExperienceEntry[]}
 */
export const EXPERIENCE_SORTED = [...EXPERIENCE].sort((a, b) =>
  b.start.localeCompare(a.start),
)
