import { GlowBorder, ImageFrame, Tag } from '@/components/ui'
import { PROJECT_STATUS } from '@/data'
import { cn } from '@/utils'

/**
 * Project preview image.
 *
 * THE HOVER ZOOM
 * The `<img>` scales inside a fixed, `overflow-hidden` frame — the frame itself
 * never moves. Scaling the frame would reflow everything beside it on every
 * hover; scaling the image is a compositor-only transform that cannot touch
 * layout. That is why `ImageFrame` exposes `imgClassName` at all.
 *
 * A long, slow ease (800ms) reads as a camera push rather than a hover state.
 * `group-hover` fires it from anywhere on the showcase row — title, badges,
 * buttons — so the whole row feels like one object. `motion-safe:` drops it
 * entirely for users who have asked to reduce motion.
 *
 * @param {object} props
 * @param {import('@/data/projects').Project} props.project
 * @param {'video'|'tall'|'square'} [props.ratio='video']
 */
export function ProjectMedia({ project, ratio = 'video', className }) {
  const status = PROJECT_STATUS[project.status] ?? PROJECT_STATUS.concept

  return (
    <GlowBorder radius="panel" speed="slower" className={cn('shadow-floating', className)}>
      <ImageFrame
        src={project.thumbnail}
        alt={project.thumbnail ? `${project.title} — preview` : ''}
        ratio={ratio}
        // Every project image sits below the fold, so deferring the fetch is
        // the single biggest saving available here once real imagery lands.
        loading="lazy"
        placeholderLabel="Add a preview image"
        placeholderHint="project.thumbnail"
        className="rounded-panel"
        imgClassName={cn(
          'transition-transform duration-slow ease-out-expo',
          'motion-safe:group-hover:scale-[1.06]',
        )}
      >
        {/* Grounds the badges against whatever imagery ends up behind them. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-canvas/70 to-transparent"
        />

        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <Tag tone={status.tone}>{status.label}</Tag>
          <Tag tone="outline">{project.year}</Tag>
        </div>
      </ImageFrame>
    </GlowBorder>
  )
}
