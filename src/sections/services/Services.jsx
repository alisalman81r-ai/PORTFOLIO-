import { ServiceCard } from './ServiceCard'
import { Section } from '@/layouts'
import { Stagger } from '@/components/animations'
import { GlowOrb, SectionHeader } from '@/components/ui'
import { SERVICES, SERVICES_META } from '@/data'

/**
 * Services section.
 *
 * A plain grid of six cards — no filtering, no tabs. Six is few enough to read
 * at a glance, and a control that hides half of them would make a visitor work
 * for information they came to find.
 *
 * The header comes from `<SectionHeader>`, shared with every section built from
 * here on: the badge, masked heading lines, gradient accent word and lead
 * paragraph were being hand-written per section, and the animation timing is a
 * design decision that should exist in one place.
 */
export function Services() {
  return (
    <Section
      id="services"
      labelledBy="services-title"
      // Contains the background glows. `overflow-x-clip`, not `overflow-hidden`:
      // hidden would make this a scroll container and break `position: sticky`
      // for anything nested here later.
      className="relative overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GlowOrb
          tone="warm"
          motion="drift"
          className="-top-[10%] right-[5%] size-[55vw] max-w-[680px]"
        />
        <GlowOrb
          tone="cool"
          motion="drift-slow"
          className="bottom-[-5%] left-[-10%] size-[50vw] max-w-[620px]"
        />
      </div>

      <div className="relative">
        <SectionHeader
          id="services-title"
          badge={SERVICES_META.badge}
          headline={SERVICES_META.headline}
          intro={SERVICES_META.intro}
        />

        <Stagger
          as="ul"
          className="mt-14 grid items-stretch gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
