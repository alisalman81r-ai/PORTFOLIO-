import { cn } from '@/utils'

/**
 * Soft atmospheric light source.
 *
 * A radial-gradient background, never a `filter: blur()`. The distinction
 * matters: a blurred element must be rasterised and re-blurred whenever it
 * moves, while a gradient is painted once and then only composited. At these
 * radii the two are visually indistinguishable, but only one animates smoothly
 * on a mid-range phone.
 *
 * Drift is a CSS keyframe animation from `theme.css`, so it runs entirely on
 * the compositor with no JavaScript scheduling it. `prefers-reduced-motion` is
 * handled globally in `base.css`, which freezes these to their first frame.
 *
 * Decorative by definition — always `aria-hidden`.
 *
 * @param {object} props
 * @param {'warm'|'cool'|'neutral'} [props.tone='warm'] Which glow token to use.
 * @param {'drift'|'drift-slow'|'none'} [props.motion='drift'] Drift keyframe.
 *   Pair adjacent orbs with different values — synchronised blobs read as one
 *   shape and the depth collapses.
 * @param {string} [props.className] Position and size. Orbs are absolutely
 *   positioned by their parent.
 */
export function GlowOrb({ tone = 'warm', motion = 'drift', className, ...rest }) {
  const TONES = {
    warm: 'glow-warm',
    cool: 'glow-cool',
    neutral: 'glow-neutral',
  }

  const MOTIONS = {
    drift: 'animate-drift',
    'drift-slow': 'animate-drift-slow',
    none: '',
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute rounded-full',
        TONES[tone] ?? TONES.warm,
        MOTIONS[motion] ?? MOTIONS.drift,
        className,
      )}
      {...rest}
    />
  )
}
