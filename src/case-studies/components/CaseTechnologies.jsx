import { motion } from 'motion/react'

import { CaseSection } from './CaseSection'
import { TechIcon } from '@/components/ui/TechIcon'
import { DURATION, EASE, VIEWPORT } from '@/animations'

/**
 * Section 11 — Technology badges.
 *
 * `TechIcon` is imported from its own path rather than the `@/components/ui`
 * barrel, and that is load-bearing. It carries ~37 kB of Simple Icons brand
 * marks, and re-exporting it from the barrel pulled that weight into every
 * chunk that touched any UI component — the projects section already learned
 * this the hard way. Importing directly keeps it inside the case-study chunk,
 * which is lazily loaded.
 *
 * THE STAGGER IS THE ANIMATION, NOT THE HOVER
 * A row of badges arriving together reads as one rectangle. Sequenced, it reads
 * as a list being filled in — and the interval is short (40ms) because these are
 * small adjacent objects, where the spacing that feels considered on cards feels
 * slow on chips.
 *
 * Brand marks fall back to the lucide registry when Simple Icons has no match,
 * so an unrecognised technology still renders a badge rather than a gap.
 */
const group = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
}

const badge = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.outExpo },
  },
}

export function CaseTechnologies({ technologies }) {
  if (!technologies?.length) return null

  return (
    <CaseSection
      id="technologies"
      step="10"
      eyebrow="Technologies"
      icon="atom"
      title="The stack"
    >
      <motion.ul
        variants={group}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="flex flex-wrap gap-3"
      >
        {technologies.map((tech) => (
          <motion.li
            key={tech}
            variants={badge}
            className="group flex items-center gap-2.5 rounded-pill border border-line bg-surface/60 px-4 py-2.5 transition-[background-color,border-color,box-shadow] duration-base ease-out-quart hover:border-accent/40 hover:bg-elevated hover:shadow-glow"
          >
            <TechIcon
              name={tech}
              className="size-4 text-muted transition-colors duration-base group-hover:text-accent"
            />
            <span className="font-mono text-xs whitespace-nowrap text-muted transition-colors duration-base group-hover:text-ink">
              {tech}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </CaseSection>
  )
}
