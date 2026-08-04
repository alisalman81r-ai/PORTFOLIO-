import { motion } from 'motion/react'

import { SPRING } from '@/animations'
import { PROJECT_FILTERS } from '@/data'
import { cn } from '@/utils'

/**
 * Animated filter bar.
 *
 * WHY `aria-pressed` TOGGLES AND NOT A TABLIST
 * --------------------------------------------
 * These look like the skills tabs but are a different control. Tabs *reveal*
 * one of several pre-existing panels; these *filter* a single list that stays
 * present throughout. Using `role="tab"` here would promise a panel per filter,
 * and there is only ever one list.
 *
 * So: buttons in a labelled group, each reporting its own pressed state. All
 * remain individually tabbable — a roving tabindex would be wrong for a group
 * this small where every option is an independent toggle target.
 *
 * THE LIVE REGION
 * Filtering changes content elsewhere on the page. Without an announcement, a
 * screen-reader user presses a button and gets no feedback that anything
 * happened. `aria-live="polite"` reports the new count without interrupting.
 *
 * @param {object} props
 * @param {string} props.activeId
 * @param {(id: string) => void} props.onSelect
 * @param {number} props.resultCount Announced in the live region.
 */
export function ProjectFilters({ activeId, onSelect, resultCount, className }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        role="group"
        aria-label="Filter projects by type"
        className={cn(
          // Scrolls horizontally on small screens, with the edges faded so it
          // is obvious there is more to the side.
          'no-scrollbar mask-fade-x flex gap-2 overflow-x-auto pb-1',
          'sm:mask-none sm:flex-wrap sm:overflow-visible sm:pb-0',
        )}
      >
        {PROJECT_FILTERS.map((filter) => {
          const isActive = filter.id === activeId

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onSelect(filter.id)}
              aria-pressed={isActive}
              className={cn(
                'relative shrink-0 rounded-pill px-4 py-2.5 text-body-sm',
                'transition-colors duration-fast',
                isActive ? 'text-accent-ink' : 'text-muted hover:text-ink',
              )}
            >
              {/* One element shared across buttons via layoutId, so the
                  selection travels rather than cross-fades. Painted before the
                  label and lifted by DOM order — a negative z-index would drop
                  it behind the section background and disappear. */}
              {isActive && (
                <motion.span
                  layoutId="project-filter-pill"
                  aria-hidden="true"
                  transition={SPRING.snappy}
                  className="absolute inset-0 rounded-pill bg-accent"
                />
              )}

              <span className="relative flex items-center gap-2 whitespace-nowrap">
                {filter.label}
                {/* Hidden from the accessible name so the button announces
                    "Web Apps", not "Web Apps 3". */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'font-mono text-[0.6875rem]',
                    isActive ? 'text-accent-ink/70' : 'text-faint',
                  )}
                >
                  {filter.count}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {resultCount} {resultCount === 1 ? 'project' : 'projects'}.
      </p>
    </div>
  )
}
