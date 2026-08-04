import { Icon, MagneticButton } from '@/components/ui'
import { TechIcon } from '@/components/ui/TechIcon'
import { Reveal } from '@/components/animations'
import { fadeInUp } from '@/animations'
import { CONTACT_METHODS, CONTACT_PANEL, PERSONAL, SOCIAL_LINKS } from '@/data'
import { cn } from '@/utils'

/**
 * Direct contact details, socials, and the résumé download.
 *
 * A form is a commitment; some people want an address they can paste into their
 * own client, and a recruiter usually wants the CV before anything else. Both
 * sit beside the form rather than under it, so neither is buried.
 *
 * Entries with an empty `href` render as plain text rather than as a link that
 * goes nowhere — which is how the placeholder phone number behaves until it is
 * filled in.
 */
export function ContactInfo({ className }) {
  return (
    <div className={cn('flex flex-col gap-10', className)}>
      <Reveal variants={fadeInUp} delay={0.1}>
        <ul className="flex flex-col gap-3">
          {CONTACT_METHODS.map((method) => {
            const isLink = Boolean(method.href)

            const content = (
              <>
                <span
                  className={cn(
                    'grid size-11 shrink-0 place-items-center rounded-input border border-line bg-surface',
                    'transition-colors duration-base ease-out-quart',
                    isLink && 'group-hover:border-accent/40 group-hover:bg-accent-soft',
                  )}
                >
                  <Icon
                    name={method.icon}
                    className={cn(
                      'size-4 text-muted transition-colors duration-base',
                      isLink && 'group-hover:text-accent',
                    )}
                  />
                </span>

                <span className="min-w-0">
                  <span className="eyebrow flex text-faint">{method.label}</span>
                  <span
                    className={cn(
                      'mt-1 block truncate text-body-sm',
                      isLink ? 'text-ink' : 'text-muted',
                    )}
                  >
                    {method.value}
                  </span>
                </span>
              </>
            )

            return (
              <li key={method.id}>
                {isLink ? (
                  <a
                    href={method.href}
                    className="group flex items-center gap-4 rounded-card p-2 transition-colors duration-fast hover:bg-elevated"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-2">{content}</div>
                )}
              </li>
            )
          })}
        </ul>
      </Reveal>

      <Reveal variants={fadeInUp} delay={0.15}>
        <div className="border-t border-line pt-8">
          <h3 className="eyebrow flex text-faint">{CONTACT_PANEL.socialsHeading}</h3>

          <ul className="mt-4 flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  // `noreferrer` implies `noopener`, but both are stated: some
                  // older engines honour only one, and the extra token is free.
                  rel="noreferrer noopener"
                  // Icon-only control, so the label is the entire accessible
                  // name — without it this announces as "link".
                  aria-label={`${social.label} (opens in a new tab)`}
                  className="btn btn-icon btn-outline hover:border-accent/40 hover:text-accent"
                >
                  <TechIcon name={social.icon} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal variants={fadeInUp} delay={0.2}>
        <div className="card card-glass rounded-card">
          <h3 className="font-display text-base font-medium text-ink">
            {CONTACT_PANEL.resumeHeading}
          </h3>
          <p className="mt-2 text-body-sm text-muted">
            {CONTACT_PANEL.resumeBody}
          </p>

          <MagneticButton
            as="a"
            href={PERSONAL.resumeUrl}
            // `download` asks the browser to save rather than navigate, which
            // keeps the visitor on the page.
            download
            className="btn btn-outline btn-sm group/cta mt-5"
          >
            {CONTACT_PANEL.resumeCta}
            <Icon
              name="download"
              className="size-4 transition-transform duration-base ease-out-expo group-hover/cta:translate-y-0.5"
            />
          </MagneticButton>
        </div>
      </Reveal>
    </div>
  )
}
