/**
 * PDF export via whatever Chromium-based browser is already installed.
 *
 * WHY NOT A PDF LIBRARY
 * Puppeteer or Playwright would each pull a ~150 MB browser download into a
 * repository that otherwise has none, to do a job the machine can already do.
 * Every Windows install ships Edge; every developer machine has Chrome or
 * Edge. Headless Chromium renders the same engine the HTML was designed
 * against, so the PDF is identical to the browser preview rather than a
 * second implementation's approximation of it.
 *
 * The trade is that this depends on a browser existing at a known path. If none
 * is found the script says so and points at the manual route, which is two
 * clicks and produces the same file.
 *
 * USAGE
 *   node resume/pdf.mjs                 Export the built HTML to PDF
 *   node resume/pdf.mjs --open          Export, then open the result
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const EXPORTS = path.join(HERE, 'exports')
const SOURCE = path.join(EXPORTS, 'Premium-Resume.html')
const TARGET = path.join(EXPORTS, 'Premium-Resume.pdf')

/**
 * Candidate browsers, most-preferred first.
 *
 * Chrome before Edge only because its headless print pipeline has had fewer
 * surprises with `print-color-adjust`; either produces a correct file.
 */
const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

if (!fs.existsSync(SOURCE)) {
  console.error('No built HTML found. Run `npm run resume` first.')
  process.exit(1)
}

const browser = CANDIDATES.find((candidate) => fs.existsSync(candidate))

if (!browser) {
  console.error(
    'No Chrome or Edge found at the usual paths.\n\n' +
      'Set CHROME_PATH to your browser, or export manually:\n' +
      `  1. Open ${path.relative(process.cwd(), SOURCE)}\n` +
      '  2. Print (Ctrl+P) → Destination: Save as PDF\n' +
      '  3. Paper: A4 · Margins: None · Background graphics: ON\n',
  )
  process.exit(1)
}

// Clear any previous export before rendering, so the wait below cannot mistake
// a stale file for a fresh one and report success on a run that failed.
fs.rmSync(TARGET, { force: true })

// A throwaway profile keeps the export from touching the real browser session —
// no history entry, no interference from an extension, no lock conflict if the
// browser is already open.
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-pdf-'))

try {
  execFileSync(
    browser,
    [
      '--headless',
      '--disable-gpu',
      `--user-data-dir=${profile}`,
      // Chromium adds a URL and timestamp to every printed page unless told
      // otherwise. On a resume that footer is the first thing a reader sees
      // that you did not choose to put there.
      '--no-pdf-header-footer',
      `--print-to-pdf=${TARGET}`,
      // The page CSS sets @page size and margins, so nothing is passed here —
      // command-line paper flags would override the layout's own decisions.
      new URL(`file:///${SOURCE.replace(/\\/g, '/')}`).href,
    ],
    { stdio: 'pipe', timeout: 90_000 },
  )
} catch (error) {
  console.error(`Export failed: ${error.message}`)
  process.exit(1)
} finally {
  fs.rmSync(profile, { recursive: true, force: true })
}

/**
 * Wait for the file rather than checking once.
 *
 * On Windows the process that is launched is a thin launcher: it hands the work
 * to an existing or newly-spawned browser process and exits immediately, so
 * `execFileSync` returns before a single byte of PDF has been written. Checking
 * for the file at that moment reports failure on a run that is about to
 * succeed. Polling until the size stops changing is what makes the difference
 * between "no file" and "not yet".
 */
function waitForPdf(file, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs
  let lastSize = -1
  let stableFor = 0

  while (Date.now() < deadline) {
    const size = fs.existsSync(file) ? fs.statSync(file).size : 0
    // Two consecutive identical non-zero readings mean the write has finished.
    if (size > 0 && size === lastSize) {
      stableFor += 1
      if (stableFor >= 2) return true
    } else {
      stableFor = 0
    }
    lastSize = size
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250)
  }
  return false
}

if (!waitForPdf(TARGET)) {
  console.error('The browser ran but produced no file. Try the manual route above.')
  process.exit(1)
}

const kb = (fs.statSync(TARGET).size / 1024).toFixed(0)
console.log(`  ${path.relative(path.resolve(HERE, '..'), TARGET)}  ${kb} kB`)
console.log(`  rendered with ${path.basename(browser)}`)

if (process.argv.includes('--open')) {
  const opener = process.platform === 'win32' ? 'explorer' : process.platform === 'darwin' ? 'open' : 'xdg-open'
  try {
    execFileSync(opener, [TARGET], { stdio: 'ignore' })
  } catch {
    // `explorer` exits non-zero even on success; the file is open regardless.
  }
}
