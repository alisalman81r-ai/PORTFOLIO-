import { memo } from 'react'
import { motion } from 'motion/react'

import { ProjectMedia } from './ProjectMedia'
import { Icon, Tag } from '@/components/ui'
import { TechIcon } from '@/components/ui/TechIcon'
import { DURATION, EASE, VIEWPORT } from '@/animations'
import { cn } from '@/utils'

/**
 * Entrance variants.
 *
 * Media and copy arrive from opposite sides and converge — a factory rather
 * than two constants, because the direction flips with the row.
 */
const slideFrom = (direction) => ({
  hidden: { opacity: 0, x: direction === 'left' ? -48 : 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slower, ease: EASE.outExpo },
  },
})

const copyStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}

const copyItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.outExpo } },
}

/**
 * Technology badges arrive one at a time rather than as a single block.
 *
 * A row of six chips appearing together reads as one rectangle; sequenced, it
 * reads as a list being filled in — and the tail of the stagger lands just as
 * the eye finishes the description above it. The interval is deliberately
 * shorter than the section stagger (40ms against 80ms): these are small,
 * adjacent items, and the same spacing that feels considered on cards feels slow
 * on chips.
 *
 * The container holds no visual state; it only schedules its children.
 */
const badgeGroup = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
}

const badge = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.fast, ease: EASE.outExpo },
  },
}

/**
 * A link button that degrades to a disabled control when no URL exists.
 *
 * The alternative — hiding the button — leaves an inconsistent row of actions
 * that changes shape per project, and quietly hides the fact that a link is
 * missing. A disabled `<button>` keeps the composition intact and is honest:
 * `disabled` removes it from the tab order and announces its state, and there
 * is no `href` to follow.
 */
function ProjectLink({ href, label, icon, brandIcon, className }) {
  const content = (
    <>
      {brandIcon ? (
        <TechIcon name={brandIcon} className="size-4" />
      ) : (
        <Icon name={icon} className="size-4" />
      )}
      {label}
    </>
  )

  if (!href) {
    return (
      <button
        type="button"
        disabled
        title={`${label} link not available yet`}
        className={cn('btn btn-outline btn-sm', className)}
      >
        {content}
      </button>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      // `noreferrer` implies `noopener`, but both are stated: some older
      // engines honour only one, and the cost of the extra token is nothing.
      rel="noreferrer noopener"
      className={cn('btn btn-outline btn-sm', className)}
    >
      {content}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

/**
 * One alternating showcase row.
 *
 * LAYOUT
 * A 12-column grid: media on 7, copy on 5, sides swapped by `order` on odd
 * rows. `order` rather than reversing the DOM, so the reading order stays
 * title-then-detail for screen readers and keyboard users regardless of which
 * side the image lands on.
 *
 * Below `lg` the grid collapses and media always comes first — on a phone the
 * image is the hook, and a wall of text above it would bury the work.
 *
 * `memo` because the list re-renders on every filter change and each row
 * carries an image plus a dozen child components. The `project` prop is a
 * stable module constant, so the shallow compare is a reference check.
 *
 * @param {object} props
 * @param {import('@/data/projects').Project} props.project
 * @param {number} props.index Position in the *filtered* list — drives which
 *   side the media sits on and the vertical rhythm.
 * @param {(project: object) => void} props.onOpenDetails
 */
export const ProjectShowcase = memo(function ProjectShowcase({
  project,
  index,
  onOpenDetails,
}) {
  const isReversed = index % 2 === 1
  const headingId = `project-${project.id}-title`

  return (
    // `layout` animates the row into its new position when filtering removes a
    // sibling, instead of snapping. Rows are full width, so only the vertical
    // axis changes — which animates cleanly without distorting the image.
    <motion.li
      layout
      className={cn(
        'group relative',
        // Varied rhythm: every third row gets extra breathing room, so the
        // sequence reads as composed rather than as a uniform loop.
        index > 0 && (index % 3 === 0 ? 'mt-section-sm' : 'mt-24 lg:mt-32'),
      )}
    >
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <motion.div
          variants={slideFrom(isReversed ? 'right' : 'left')}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className={cn('lg:col-span-7', isReversed ? 'lg:order-2' : 'lg:order-1')}
        >
          <ProjectMedia project={project} ratio={index % 3 === 1 ? 'square' : 'video'} />
        </motion.div>

        <motion.div
          variants={copyStagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className={cn('lg:col-span-5', isReversed ? 'lg:order-1' : 'lg:order-2')}
        >
          <motion.p variants={copyItem} className="eyebrow flex">
            {project.category}
          </motion.p>

          {/* h3: the section heading is h2, so the outline stays continuous. */}
          <motion.h3
            variants={copyItem}
            id={headingId}
            className="heading-xs mt-4 text-ink"
          >
            {project.title}
          </motion.h3>

          <motion.p variants={copyItem} className="mt-4 text-body-sm text-muted">
            {project.shortDescription}
          </motion.p>

          {/* Feature highlights — the first three. More than that stops being a
              highlight and starts being the full list, which the modal covers. */}
          <motion.ul variants={copyItem} className="mt-6 flex flex-col gap-2.5">
            {project.features.slice(0, 3).map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                  <Icon name="check" className="size-3 text-accent" />
                </span>
                <span className="text-body-sm text-muted">{feature.title}</span>
              </li>
            ))}
          </motion.ul>

          <motion.ul variants={badgeGroup} className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              // `as={motion.li}` rather than a wrapper element — Tag spreads
              // `...rest`, so the variant reaches the motion component without
              // adding a node whose only job is to animate.
              <Tag as={motion.li} variants={badge} key={tech}>
                {tech}
              </Tag>
            ))}
          </motion.ul>

          <motion.div variants={copyItem} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenDetails(project)}
              // Names the specific project, so a screen-reader user hearing a
              // list of buttons is not given five identical "View details".
              aria-label={`View details for ${project.title}`}
              className="btn btn-primary btn-sm group/cta"
            >
              View details
              <Icon
                name="arrow"
                className="size-4 transition-transform duration-base ease-out-expo group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
              />
            </button>

            <ProjectLink href={project.liveUrl} label="Live demo" icon="external" />
            <ProjectLink href={project.githubUrl} label="Code" brandIcon="github" />
          </motion.div>
        </motion.div>
      </div>
    </motion.li>
  )
})
