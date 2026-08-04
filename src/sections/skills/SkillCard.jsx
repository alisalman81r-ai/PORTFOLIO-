import { memo } from 'react'
import { motion } from 'motion/react'

import { Tag, TiltCard } from '@/components/ui'
// Direct path, not the barrel — see the note in `components/ui/index.js`.
import { TechIcon } from '@/components/ui/TechIcon'
import { DURATION, EASE } from '@/animations'
import { SKILL_LEVELS } from '@/data'
import { cn } from '@/utils'

/** Entrance variant. Consumed by the grid's `staggerChildren`. */
const card = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.outExpo } },
}

/**
 * One technology card.
 *
 * `memo` because the grid re-renders whenever the selected category changes,
 * and every card would re-render with it. The `skill` object is a stable module
 * constant from `@/data`, so the shallow compare is a reference check that
 * always short-circuits correctly — no custom comparator needed.
 *
 * WHY THE TILT AND THE HOVER STYLING ARE SPLIT
 * `TiltCard` writes `transform` inline from motion values. Any CSS hover that
 * also sets `transform` — `card-interactive`, `hover-lift` — loses silently to
 * the inline style. So tilt owns transform, and hover changes colour, border,
 * and shadow only. `group` lets the inner pieces react without touching it.
 *
 * @param {object} props
 * @param {import('@/data/skills').Skill} props.skill
 */
export const SkillCard = memo(function SkillCard({ skill }) {
  const level = SKILL_LEVELS[skill.level] ?? SKILL_LEVELS.working

  return (
    <motion.li variants={card} className="h-full">
      <TiltCard
        intensity={7}
        className={cn(
          'card card-glass group h-full rounded-card',
          'transition-[background-color,border-color,box-shadow] duration-base ease-out-quart',
          'hover:border-accent/30 hover:bg-elevated hover:shadow-glow',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-input border border-line bg-surface',
              'transition-colors duration-base ease-out-quart',
              'group-hover:border-accent/40 group-hover:bg-accent-soft',
            )}
          >
            <TechIcon
              name={skill.icon}
              className="size-5 text-muted transition-colors duration-base group-hover:text-accent"
            />
          </span>

          {/* `title` surfaces the band's meaning on hover without spending a
              line of the card on it. */}
          <Tag tone={level.tone} title={level.hint}>
            {level.label}
          </Tag>
        </div>

        {/* h4: the section heading is h2 and the panel heading is h3, so the
            outline stays continuous with no skipped levels. */}
        <h4 className="mt-5 font-display text-base font-medium text-ink">{skill.name}</h4>

        <p className="mt-1.5 text-body-sm text-muted">{skill.description}</p>
      </TiltCard>
    </motion.li>
  )
})
