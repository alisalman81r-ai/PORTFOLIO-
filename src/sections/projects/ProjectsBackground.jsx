import { GlowOrb } from '@/components/ui'

/**
 * Atmosphere behind the showcase.
 *
 * Deliberately quieter than the hero's. This section is long and image-heavy,
 * and the projects are the subject — background that competes with them is
 * clutter, however elegant it looks in isolation.
 *
 * So: two counter-drifting glows and nothing else. A centred "spine" rule was
 * tried here and removed — it ran behind the header copy, which is clutter
 * however subtle it is. Both layers sit under 12% opacity, and all motion is
 * CSS keyframes on the compositor, frozen under `prefers-reduced-motion`.
 */
export function ProjectsBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <GlowOrb
        tone="cool"
        motion="drift-slow"
        className="top-[8%] -left-[12%] size-[55vw] max-w-[700px]"
      />
      <GlowOrb
        tone="warm"
        motion="drift"
        className="right-[-10%] bottom-[12%] size-[50vw] max-w-[640px]"
      />
    </div>
  )
}
