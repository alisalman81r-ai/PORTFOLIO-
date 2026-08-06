import { Link } from 'react-router-dom'

import { Section } from '@/layouts'
import { Reveal } from '@/components/animations'
import { Icon, ImageFrame } from '@/components/ui'
import { cn } from '@/utils'

/**
 * End-of-page navigation.
 *
 * A case study is the longest page on the site, and the reader who finishes one
 * is the most engaged visitor it will ever have. Ending with nothing sends them
 * to the browser back button, which is the one place the portfolio cannot
 * follow them — so the page ends with the two most obvious next moves: the
 * adjacent project, or a conversation.
 *
 * The list wraps at both ends (see `getCaseStudyNeighbours`), so there is no
 * dead end at the first or last project.
 */
function NavCard({ study, direction }) {
  if (!study) return null

  const { project } = study
  const isPrevious = direction === 'previous'

  return (
    <Link
      to={'/work/' + project.slug}
      className={cn(
        'card card-glass group flex items-center gap-5 rounded-card',
        'transition-[background-color,border-color,box-shadow] duration-base ease-out-quart',
        'hover:border-accent/30 hover:bg-elevated hover:shadow-glow',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent',
        isPrevious ? 'text-left' : 'flex-row-reverse text-right',
      )}
    >
      <ImageFrame
        src={project.thumbnail}
        alt=""
        ratio="square"
        loading="lazy"
        placeholderLabel=""
        className="size-16 shrink-0 rounded-input border border-line"
      />

      <div className="min-w-0">
        <p
          className={cn(
            'eyebrow flex items-center gap-1.5 text-faint',
            !isPrevious && 'justify-end',
          )}
        >
          <Icon name={isPrevious ? 'prev' : 'next'} className="size-3" />
          {isPrevious ? 'Previous' : 'Next'}
        </p>
        <p className="mt-1.5 truncate text-body-sm font-medium text-ink">{project.title}</p>
        <p className="truncate text-body-sm text-muted">{project.category}</p>
      </div>
    </Link>
  )
}

export function CaseNav({ previous, next }) {
  return (
    <Section id="case-nav" spacing="sm" className="border-t border-line">
      <Reveal>
        <nav aria-label="Case studies">
          <div className="grid gap-4 sm:grid-cols-2">
            <NavCard study={previous} direction="previous" />
            <NavCard study={next} direction="next" />
          </div>
        </nav>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="heading-xs text-ink">Have a project like this one?</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/#contact" className="btn btn-primary hover-glow group">
              Start a conversation
              <Icon
                name="arrow"
                className="size-4 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link to="/#projects" className="btn btn-outline">
              All projects
            </Link>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
