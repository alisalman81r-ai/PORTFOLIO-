import { useEffect, useRef } from 'react'

import { GlowOrb } from '@/components/ui'
import { gsap } from '@/animations'
import { useMediaQuery, useMousePosition, usePrefersReducedMotion } from '@/hooks'

/**
 * Maximum pointer-driven travel, in pixels.
 *
 * Deliberately small. The light is meant to feel like it sits behind the page
 * and responds to where you are looking — above roughly 40px it stops reading as
 * depth and starts reading as an element chasing the cursor.
 */
const POINTER_TRAVEL = 26

/**
 * Layered atmosphere behind the hero.
 *
 * Six stacked layers, back to front, each doing one job:
 *
 *   1. Base wash      A wide vertical gradient so the canvas is never flat.
 *   2. Glow orbs      Two warm, one cool — the light sources. Drifting on
 *                     counter-phase timings so they never move in lockstep.
 *   3. Pointer layer  The orbs' shared parent, which shifts *against* the
 *                     cursor. See below.
 *   4. Grid           Faint technical rule, masked to fade out before the edges.
 *   5. Vignette       Darkens the corners, which pushes the eye to the centre.
 *   6. Bottom fade    Blends the section into whatever follows it.
 *
 * The depth comes from *how many* near-invisible layers there are, not from any
 * one being strong. Every layer here is under 20% opacity.
 *
 * THE POINTER PARALLAX, AND WHY IT IS ON A WRAPPER
 * ------------------------------------------------
 * The orbs move opposite the cursor, which is what makes them read as sitting
 * behind the content rather than on it — the same reason a camera pan shifts
 * the background more than the foreground.
 *
 * It is applied to their shared *parent*, never to the orbs themselves. Each orb
 * already runs a CSS `drift` keyframe that animates `transform`; GSAP writing
 * `transform` on the same element would overwrite the keyframe every frame and
 * the drift would silently stop. Parent moves, children keep drifting.
 *
 * Driven off `gsap.ticker` — the loop that already steps Lenis — so the pointer
 * layer, the smooth scroll and every ScrollTrigger resolve inside one frame
 * rather than three competing rAF callbacks. Position comes from a ref, so a
 * pointer firing 120×/second causes zero React renders.
 *
 * DISABLED on coarse pointers (a touch device has no hover position, so the
 * layer would sit frozen wherever the last tap landed) and under reduced motion.
 *
 * Entirely decorative: `aria-hidden`, and it never intercepts the pointer.
 */
export function HeroBackground() {
  const pointerLayerRef = useRef(null)
  const { position } = useMousePosition({ normalized: true })
  const prefersReducedMotion = usePrefersReducedMotion()
  const isFinePointer = useMediaQuery('(pointer: fine)')

  useEffect(() => {
    const layer = pointerLayerRef.current
    if (!layer || prefersReducedMotion || !isFinePointer) return

    // `quickTo` reuses one tween and retargets it, so this is a property write
    // per frame rather than a new tween. The long duration is the effect: the
    // light lags well behind the cursor, which is what makes it feel heavy and
    // distant instead of attached.
    const moveX = gsap.quickTo(layer, 'x', { duration: 1.4, ease: 'power3.out' })
    const moveY = gsap.quickTo(layer, 'y', { duration: 1.4, ease: 'power3.out' })

    // Retargeting only when the pointer has actually moved. Without this the
    // ticker retargets two tweens on every one of the ~60 frames a second the
    // page is open, including while the cursor sits still.
    let lastX = null
    let lastY = null

    const update = () => {
      const { nx, ny } = position.current
      if (nx === lastX && ny === lastY) return
      lastX = nx
      lastY = ny
      // Negated: the background travels against the pointer.
      moveX(nx * -POINTER_TRAVEL)
      moveY(ny * -POINTER_TRAVEL)
    }

    // The hero is one screen of a page seventeen screens tall, so for most of a
    // visit this layer is nowhere near the viewport. Running a per-frame
    // callback for it the whole time is work with no possible visible result —
    // the observer suspends it the moment the hero leaves.
    let isRunning = false
    const start = () => {
      if (isRunning) return
      gsap.ticker.add(update)
      isRunning = true
    }
    const stop = () => {
      if (!isRunning) return
      gsap.ticker.remove(update)
      isRunning = false
    }

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      // No threshold: any sliver of the hero on screen means the light is
      // visible, and waiting for a percentage would stall it mid-scroll.
      { rootMargin: '0px' },
    )
    observer.observe(layer)

    return () => {
      observer.disconnect()
      stop()
      gsap.killTweensOf(layer)
      gsap.set(layer, { x: 0, y: 0 })
    }
  }, [position, prefersReducedMotion, isFinePointer])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1 — base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-sunken via-canvas to-canvas" />

      {/* 2+3 — light sources, inside the pointer-reactive layer. Sized in vw so
             the composition scales with the viewport rather than clustering in a
             corner on ultrawide. */}
      <div ref={pointerLayerRef} className="absolute inset-0">
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
      </div>

      {/* 4 — grid, faded at the edges so it reads as texture, not a table */}
      <div className="bg-grid absolute inset-0 mask-fade-y opacity-[0.35]" />

      {/* 5 — vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--canvas)_100%)]" />

      {/* 6 — hand-off to the next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  )
}
