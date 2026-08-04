import { useRef } from 'react'
import { motion } from 'motion/react'

import { panelId, tabId } from './ids'
import { Icon } from '@/components/ui'
import { SPRING } from '@/animations'
import { useMediaQuery } from '@/hooks'
import { cn } from '@/utils'

/**
 * Category rail — a real ARIA tablist.
 *
 * WHY THE FULL TABS PATTERN AND NOT JUST BUTTONS
 * ----------------------------------------------
 * A row of buttons that swaps a panel *looks* like tabs, so assistive tech
 * users are told it is one and then find it behaves differently. The contract
 * has three parts and all three are required:
 *
 *   - `role="tablist"` / `"tab"` / `"tabpanel"`, wired together by
 *     `aria-controls` and `aria-labelledby`.
 *   - `aria-selected` on the active tab, so state is announced, not just drawn.
 *   - ROVING TABINDEX: exactly one tab is in the tab order at a time. Tab moves
 *     *past* the whole group to the panel; arrow keys move *within* it. Six
 *     separately-tabbable buttons would make a keyboard user press Tab six
 *     times to get past a control they may not want.
 *
 * Home/End jump to the ends, and selection wraps — both expected of this
 * pattern, and both cheap to support.
 *
 * ORIENTATION
 * Vertical on desktop, horizontal on mobile, and `aria-orientation` follows the
 * layout so a screen reader announces the arrangement the user can actually
 * see. Both axes are always handled, because a user pressing the "wrong" arrow
 * should get a sensible result rather than nothing.
 *
 * @param {object} props
 * @param {import('@/data/skills').SkillCategory[]} props.categories
 * @param {string} props.activeId
 * @param {(id: string) => void} props.onSelect
 */
export function SkillCategories({ categories, activeId, onSelect, className }) {
  const tabRefs = useRef([])
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const handleKeyDown = (event, index) => {
    const last = categories.length - 1
    let next = null

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = index === last ? 0 : index + 1
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        next = index === 0 ? last : index - 1
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = last
        break
      default:
        return
    }

    event.preventDefault()
    onSelect(categories[next].id)
    // Focus must follow selection, or the roving tabindex leaves focus on a
    // tab that is now `tabIndex={-1}` and the next keypress goes nowhere.
    tabRefs.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Skill categories"
      aria-orientation={isDesktop ? 'vertical' : 'horizontal'}
      className={cn(
        // Mobile: a horizontal rail that scrolls, with the scrollbar hidden and
        // the edges faded so it is obvious there is more to the side.
        'no-scrollbar mask-fade-x flex gap-2 overflow-x-auto pb-1',
        'lg:mask-none lg:flex-col lg:overflow-visible lg:pb-0',
        className,
      )}
    >
      {categories.map((category, index) => {
        const isActive = category.id === activeId

        return (
          <button
            key={category.id}
            ref={(node) => {
              tabRefs.current[index] = node
            }}
            type="button"
            role="tab"
            id={tabId(category.id)}
            aria-selected={isActive}
            aria-controls={panelId(category.id)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(category.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'group relative shrink-0 rounded-card px-4 py-3 text-left',
              'transition-colors duration-fast lg:w-full',
              isActive ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {/* One element shared across tabs via layoutId, so the selection
                appears to travel rather than cross-fade. Painted before the
                label and lifted by DOM order — a negative z-index would drop it
                behind the section background and vanish. */}
            {isActive && (
              <motion.span
                layoutId="skill-tab-indicator"
                aria-hidden="true"
                transition={SPRING.snappy}
                className="absolute inset-0 rounded-card border border-line-strong bg-elevated"
              />
            )}

            <span className="relative flex items-center gap-3">
              <Icon
                name={category.icon}
                className={cn(
                  'size-4 shrink-0 transition-colors duration-fast',
                  isActive ? 'text-accent' : 'text-faint group-hover:text-muted',
                )}
              />

              <span className="text-body-sm font-medium whitespace-nowrap">
                {category.label}
              </span>

              {/* Count is supplementary — hidden from the accessible name so the
                  tab announces "Frontend", not "Frontend 6". */}
              <span
                aria-hidden="true"
                className="ml-auto hidden font-mono text-xs text-faint lg:block"
              >
                {String(category.items.length).padStart(2, '0')}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
