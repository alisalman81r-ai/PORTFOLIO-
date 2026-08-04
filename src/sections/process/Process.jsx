import { useState } from 'react'
import { ProcessStep } from './ProcessStep'
import { Section } from '@/layouts'
import { GlowOrb, SectionHeader } from '@/components/ui'
import { PROCESS_META, PROCESS_STEPS } from '@/data'

/**
 * Working process — four steps with an animated connector.
 *
 * THE CONNECTOR
 * Each step draws its own segment to the next one — see `ProcessStep`. A
 * single line spanning this container ends at the container edge, which with
 * `flex-1` columns overshoots the final node by most of a column.
 *
 * LAYOUT
 * Horizontal row on `lg`, vertical stack below. The nodes stay 56px in both, so
 * the connector geometry is the same number in both orientations — which is
 * what keeps the two variants from drifting apart.
 */
export function Process() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <Section
      id="process"
      labelledBy="process-title"
      className="relative overflow-x-clip"
      spacing="sm"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GlowOrb
          tone="cool"
          motion="drift"
          className="top-[20%] left-[15%] size-[45vw] max-w-[560px]"
        />
      </div>

      <div className="relative">
        <SectionHeader
          id="process-title"
          badge={PROCESS_META.badge}
          headline={PROCESS_META.headline}
          intro={PROCESS_META.intro}
        />

        <div className="relative mt-14 lg:mt-20">
          {/* An ordered list because the sequence is the meaning — assistive
              tech announces position and count, which is the whole point of
              numbering the steps. */}
          <ol className="relative flex flex-col gap-12 lg:flex-row lg:gap-8">
            {PROCESS_STEPS.map((step, index) => (
              <ProcessStep
                key={step.id}
                step={step}
                dimmed={hoveredId !== null && hoveredId !== step.id}
                isLast={index === PROCESS_STEPS.length - 1}
                onHoverStart={() => setHoveredId(step.id)}
                onHoverEnd={() => setHoveredId(null)}
              />
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
