import { useRef } from 'react'

import { ExperienceItem } from './ExperienceItem'
import { Section } from '@/layouts'
import { GlowOrb, SectionHeader, TimelineRail } from '@/components/ui'
import { EXPERIENCE, EXPERIENCE_META } from '@/data'

/**
 * Experience section.
 *
 * A left-rail timeline whose fill tracks scroll progress, using the shared
 * `<TimelineRail>` primitive. That component was extracted while building this
 * section — the About journey has the same scrubbed-rail mechanic inline, and a
 * second hand-written copy of the ScrollTrigger wiring was exactly the
 * duplication worth avoiding.
 *
 * The rail is offset to `left-[1.375rem]` — half of the 44px node — so the line
 * threads the centre of every node at every width.
 */
export function Experience() {
  const listRef = useRef(null)

  return (
    <Section
      id="experience"
      labelledBy="experience-title"
      className="relative overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GlowOrb
          tone="warm"
          motion="drift-slow"
          className="top-[10%] -left-[10%] size-[50vw] max-w-[620px]"
        />
        <GlowOrb
          tone="cool"
          motion="drift"
          className="right-[-8%] bottom-[10%] size-[45vw] max-w-[560px]"
        />
      </div>

      <div className="relative">
        <SectionHeader
          id="experience-title"
          badge={EXPERIENCE_META.badge}
          headline={EXPERIENCE_META.headline}
          intro={EXPERIENCE_META.intro}
        />

        <div ref={listRef} className="relative mt-14 lg:mt-16">
          <TimelineRail
            targetRef={listRef}
            className="top-5 bottom-5 left-[1.375rem]"
          />

          {/* An ordered list because the sequence carries meaning — assistive
              tech announces position and count, which is most of what a
              timeline is. */}
          <ol className="relative">
            {EXPERIENCE.map((entry, index) => (
              <ExperienceItem
                key={entry.id}
                entry={entry}
                isLast={index === EXPERIENCE.length - 1}
              />
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
