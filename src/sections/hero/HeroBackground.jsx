import { GlowOrb } from '@/components/ui'

/**
 * Layered atmosphere behind the hero.
 *
 * Five stacked layers, back to front, each doing one job:
 *
 *   1. Base wash      A wide vertical gradient so the canvas is never flat.
 *   2. Glow orbs      Two warm, one cool — the light sources. Drifting on
 *                     counter-phase timings so they never move in lockstep.
 *   3. Grid           Faint technical rule, masked to fade out before the edges.
 *   4. Vignette       Darkens the corners, which pushes the eye to the centre.
 *   5. Bottom fade    Blends the section into whatever follows it.
 *
 * The depth comes from *how many* near-invisible layers there are, not from any
 * one being strong. Every layer here is under 20% opacity.
 *
 * PERFORMANCE
 * No `filter: blur()` anywhere — every glow is a radial-gradient background
 * (see `GlowOrb`). Only `transform` and `opacity` animate, so the whole
 * composition lives on the compositor and never triggers layout or paint.
 * The drift keyframes freeze under `prefers-reduced-motion` via `base.css`.
 *
 * Entirely decorative: `aria-hidden`, and it never intercepts the pointer.
 */
export function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1 — base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-sunken via-canvas to-canvas" />

      {/* 2 — light sources. Sized in vw so the composition scales with the
             viewport rather than clustering in a corner on ultrawide. */}
      <GlowOrb
        tone="warm"
        motion="drift"
        className="-top-[20vh] -left-[10vw] size-[70vw] max-w-[900px] lg:size-[45vw]"
      />
      <GlowOrb
        tone="cool"
        motion="drift-slow"
        className="-right-[15vw] top-[5vh] size-[75vw] max-w-[1000px] lg:size-[50vw]"
      />
      <GlowOrb
        tone="warm"
        motion="drift-slow"
        className="bottom-[-25vh] left-[25vw] size-[60vw] max-w-[800px] opacity-60 lg:size-[38vw]"
      />

      {/* 3 — grid, faded at the edges so it reads as texture, not a table */}
      <div className="bg-grid absolute inset-0 mask-fade-y opacity-[0.35]" />

      {/* 4 — vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--canvas)_100%)]" />

      {/* 5 — hand-off to the next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  )
}
