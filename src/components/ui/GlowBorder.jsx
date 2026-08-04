import { cn } from '@/utils'

/**
 * Wraps content in a border with light travelling around it.
 *
 * HOW IT WORKS
 * A large square painted with a conic gradient spins inside an
 * `overflow-hidden` rounded box. The box has 1px of padding and the inner
 * surface is opaque, so the gradient is only ever visible in that 1px ring —
 * the frame stays still while the light moves around it.
 *
 * The indirection is necessary: a conic gradient's angle cannot be animated
 * without registering a custom property via `@property`, and rotating the
 * element itself would spin the rounded rectangle rather than the light. This
 * animates `transform` only, so it runs entirely on the compositor.
 *
 * `prefers-reduced-motion` freezes the rotation globally via `base.css`,
 * leaving a static gradient border — which still looks deliberate.
 *
 * @param {object} props
 * @param {'panel'|'card'|'full'} [props.radius='panel'] Corner rounding. Must
 *   match what the child expects, since the child is clipped by this box.
 * @param {'slow'|'slower'} [props.speed='slower']
 * @param {string} [props.surface='bg-canvas'] Inner fill. Must be opaque or the
 *   gradient shows through the whole panel instead of just the edge.
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function GlowBorder({
  radius = 'panel',
  speed = 'slower',
  surface = 'bg-canvas',
  className,
  children,
  ...rest
}) {
  const RADII = {
    panel: 'rounded-panel',
    card: 'rounded-card',
    full: 'rounded-full',
  }

  const SPEEDS = {
    slow: 'animate-spin-slow',
    slower: 'animate-spin-slower',
  }

  const shape = RADII[radius] ?? RADII.panel

  return (
    <div
      className={cn(
        // `bg-line` is the resting border. Without it only the gradient's two
        // lit arcs are visible and the frame reads as half-drawn rather than
        // lit — the sweep should be a highlight travelling over a complete
        // border, not the border itself.
        'relative overflow-hidden bg-line p-px',
        shape,
        className,
      )}
      {...rest}
    >
      {/* Square and oversized so its corners never enter the frame as it turns —
          a non-square sweep would visibly pulse at 90° intervals. */}
      <span
        aria-hidden="true"
        className={cn(
          'conic-sweep absolute top-1/2 left-1/2 aspect-square w-[150%]',
          '-translate-x-1/2 -translate-y-1/2',
          SPEEDS[speed] ?? SPEEDS.slower,
        )}
      />

      <div className={cn('relative h-full', shape, surface)}>{children}</div>
    </div>
  )
}
