import { ContactForm } from './ContactForm'
import { ContactInfo } from './ContactInfo'
import { Section } from '@/layouts'
import { GlowOrb, SectionHeader } from '@/components/ui'
import { Reveal } from '@/components/animations'
import { fadeInUp } from '@/animations'
import { CONTACT_META } from '@/data'

/**
 * Contact section.
 *
 * Form on the left at desktop, details on the right — the form is the primary
 * action and reading order should reach it first. Below `lg` they stack in the
 * same order, so a phone user is not scrolled past a wall of links before
 * getting to the thing they came to do.
 *
 * `min-w-0` on both columns is load-bearing: a grid item's automatic minimum
 * size is its min-content width, and a long unbroken string in a field or an
 * email address would otherwise force the column wider than the viewport.
 */
export function Contact() {
  return (
    <Section
      id="contact"
      labelledBy="contact-title"
      // `overflow-x-clip`, not `overflow-hidden`: hidden would make this a
      // scroll container and break `position: sticky` for anything nested here.
      className="relative overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GlowOrb
          tone="warm"
          motion="drift"
          className="top-[-5%] left-[20%] size-[55vw] max-w-[700px]"
        />
        <GlowOrb
          tone="cool"
          motion="drift-slow"
          className="right-[-10%] bottom-[10%] size-[50vw] max-w-[620px]"
        />
      </div>

      <div className="relative">
        <SectionHeader
          id="contact-title"
          badge={CONTACT_META.badge}
          headline={CONTACT_META.headline}
          intro={CONTACT_META.intro}
        />

        <div className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <Reveal variants={fadeInUp} className="min-w-0 lg:col-span-7">
            <ContactForm />
          </Reveal>

          <ContactInfo className="min-w-0 lg:col-span-5" />
        </div>
      </div>
    </Section>
  )
}
