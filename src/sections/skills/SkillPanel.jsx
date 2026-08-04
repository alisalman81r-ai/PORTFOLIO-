import { AnimatePresence, motion } from 'motion/react'

import { SkillCard } from './SkillCard'
import { panelId, tabId } from './ids'
import { DURATION, EASE, STAGGER } from '@/animations'
import { cn } from '@/utils'

/**
 * Panel transition.
 *
 * Exits faster than it enters and moves a short distance. A category switch is
 * a *filter*, not a navigation — a long, travelled transition makes a 150ms
 * decision feel like a page load. The grid staggers its children only on entry;
 * staggering the exit as well would double the perceived wait.
 */
const panel = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.base,
      ease: EASE.outExpo,
      staggerChildren: STAGGER.tight,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.fast, ease: EASE.outQuart },
  },
}

/**
 * Details panel for the selected category.
 *
 * `mode="wait"` sequences the swap so the outgoing grid finishes before the
 * incoming one starts — without it the two overlap mid-air and the section
 * visibly jumps as the container resizes between different card counts.
 *
 * ACCESSIBILITY
 * `tabIndex={0}` on the panel is deliberate and is what the tabs pattern
 * requires *here*: the cards contain no focusable elements, so without it a
 * keyboard user would tab straight past the content the tabs just revealed,
 * with no way to scroll it. Panels containing their own controls should not
 * take focus — this one has none, so it must.
 *
 * @param {object} props
 * @param {import('@/data/skills').SkillCategory} props.category
 */
export function SkillPanel({ category, className }) {
  return (
    <div
      role="tabpanel"
      id={panelId(category.id)}
      aria-labelledby={tabId(category.id)}
      tabIndex={0}
      className={cn('rounded-panel focus-visible:outline-offset-8', className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={category.id}
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <header className="border-b border-line pb-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="heading-xs text-ink">{category.label}</h3>
              {/* Hidden from assistive tech — the <ul> below already announces
                  its item count, and repeating it is noise. */}
              <span aria-hidden="true" className="font-mono text-xs text-faint">
                {String(category.items.length).padStart(2, '0')} skills
              </span>
            </div>

            <p className="lead mt-3 max-w-prose text-body-sm">{category.summary}</p>
          </header>

          {/* A <ul> because this is a list of technologies — assistive tech
              announces the count, which is exactly the information the visual
              grid conveys at a glance. */}
          <ul className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {category.items.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
