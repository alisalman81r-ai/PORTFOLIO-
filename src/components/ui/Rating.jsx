import { Icon } from './Icon'
import { cn } from '@/utils'

/**
 * Star rating.
 *
 * Presentational only — this displays a score, it does not collect one. An
 * interactive rating is a different component with radio semantics, and
 * conflating them produces stars that look clickable and are not.
 *
 * ACCESSIBILITY
 * Five repeated glyphs are noise to a screen reader, and "star star star star
 * star" conveys nothing about the score. The stars are `aria-hidden` and the
 * value is exposed once as text — "Rated 5 out of 5".
 *
 * @param {object} props
 * @param {number} props.value Score, 1–max.
 * @param {number} [props.max=5]
 * @param {string} [props.className]
 */
export function Rating({ value, max = 5, className }) {
  // Guard against data that would render a broken row rather than throwing.
  const score = Math.max(0, Math.min(Math.round(value ?? 0), max))

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="sr-only">
        Rated {score} out of {max}
      </span>

      {Array.from({ length: max }, (_, index) => (
        <Icon
          key={index}
          name="star"
          className={cn(
            'size-4',
            index < score ? 'fill-accent text-accent' : 'text-line-strong',
          )}
        />
      ))}
    </span>
  )
}
