import { GlowOrb } from '@/components/ui'
// Direct path, not the barrel — see the note in `components/ui/index.js`.
import { TechIcon } from '@/components/ui/TechIcon'

/**
 * Floating decoration behind the skills grid.
 *
 * Two counter-drifting glow orbs plus a few oversized brand marks at very low
 * opacity — enough to hint at the subject without competing with the cards that
 * actually carry it.
 *
 * The marks are set at 2–3% opacity. Anything you consciously notice here is
 * too strong: this layer exists to stop a large dark area from reading as flat,
 * not to be looked at.
 *
 * Everything animates via CSS keyframes (`animate-float`, the orbs' drift), so
 * it runs on the compositor with no JavaScript scheduling it and freezes
 * correctly under `prefers-reduced-motion` through `base.css`.
 */
const FLOATING_MARKS = [
  { id: 'react', icon: 'react', className: 'top-[12%] left-[4%] size-40 lg:size-56' },
  { id: 'nextjs', icon: 'nextjs', className: 'top-[58%] right-[6%] size-32 lg:size-44 [animation-delay:-3s]' },
  { id: 'tailwind', icon: 'tailwind', className: 'bottom-[8%] left-[22%] size-28 lg:size-36 [animation-delay:-5s]' },
]

export function SkillsBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <GlowOrb
        tone="warm"
        motion="drift"
        className="-top-[10%] right-[8%] size-[60vw] max-w-[720px]"
      />
      <GlowOrb
        tone="cool"
        motion="drift-slow"
        className="bottom-[-10%] left-[-8%] size-[55vw] max-w-[680px]"
      />

      {FLOATING_MARKS.map((mark) => (
        <TechIcon
          key={mark.id}
          name={mark.icon}
          className={`absolute animate-float text-ink opacity-[0.025] ${mark.className}`}
        />
      ))}
    </div>
  )
}
