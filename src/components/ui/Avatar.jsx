import { cn } from '@/utils'

const SIZES = {
  sm: 'size-10 text-body-sm',
  md: 'size-12 text-body-sm',
  lg: 'size-16 text-body-lg',
}

/**
 * Person avatar, with initials as the fallback.
 *
 * `ImageFrame` is the wrong tool here: its placeholder is a full gradient panel
 * with a caption, which is right for a portrait or a project cover and absurd
 * at 48px. Initials in a tinted circle read as a considered empty state at any
 * size, and are what every product surface does for a missing photo.
 *
 * @param {object} props
 * @param {string|null} [props.src] Imported image. Falsy renders initials.
 * @param {string} props.name Used for the alt text and to derive initials.
 * @param {keyof typeof SIZES} [props.size='md']
 * @param {string} [props.className]
 */
export function Avatar({ src, name = '', size = 'md', className }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-full',
        'border border-line bg-elevated font-medium text-muted',
        SIZES[size] ?? SIZES.md,
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          // The name is already rendered beside every usage, so repeating it
          // here would have a screen reader announce it twice.
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials || '—'}</span>
      )}
    </span>
  )
}
