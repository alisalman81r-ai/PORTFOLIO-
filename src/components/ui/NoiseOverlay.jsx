import { cn } from '@/utils'

/**
 * Film-grain texture laid over the page.
 *
 * The detail that stops large dark gradients from banding into visible steps,
 * and most of why a gradient reads as photographic rather than as CSS. It also
 * quietly unifies the composition — grain sits over every layer, so glows,
 * glass, and canvas share one surface.
 *
 * `fixed` rather than `absolute` on purpose: grain that scrolls with the
 * content reads as a texture printed *on* the page, whereas grain fixed to the
 * viewport reads as the medium the page is viewed through — which is the effect
 * wanted, and it also avoids repainting a full-height tiled background on
 * every scroll frame.
 *
 * @param {object} props
 * @param {'subtle'|'medium'|'strong'} [props.intensity='subtle'] Grain you can
 *   consciously see is dirt. Stay at subtle unless the design needs texture.
 * @param {string} [props.className]
 */
export function NoiseOverlay({ intensity = 'subtle', className, ...rest }) {
  const INTENSITY = {
    subtle: 'opacity-[0.025]',
    medium: 'opacity-[0.04]',
    strong: 'opacity-[0.06]',
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'noise pointer-events-none fixed inset-0 z-below mix-blend-overlay',
        INTENSITY[intensity] ?? INTENSITY.subtle,
        className,
      )}
      {...rest}
    />
  )
}
