import { Icon, Logo, MagneticButton } from '@/components/ui'
import { TechIcon } from '@/components/ui/TechIcon'
import { Container } from '@/layouts'
import {
  CONTACT_METHODS,
  FOOTER,
  FOOTER_LINKS,
  PERSONAL,
  SITE,
  SOCIAL_LINKS,
} from '@/data'
import { useAnchorScroll } from '@/hooks'
import { cn } from '@/utils'

/**
 * Site footer.
 *
 * Chrome, not a section — it lives in `components/shared` beside `Header` and
 * mounts once in the shell, outside the page-transition boundary, so it stays
 * put while routes cross-fade beneath it.
 *
 * LAYOUT
 * A 12-column grid: identity on 5, then three narrow columns. Below `lg` it
 * collapses to a single column in reading order — identity, navigate, contact,
 * legal — which is the order someone scanning a footer on a phone expects.
 *
 * The copyright year is computed at render rather than typed. A hardcoded year
 * is wrong on 1 January and stays wrong until somebody notices, which on a
 * portfolio is usually a visitor rather than the owner.
 *
 * Anchor links go through `useAnchorScroll`, the same handler the header uses,
 * so a jump from the footer eases exactly like a jump from the nav instead of
 * lurching as Lenis animates back from a native scroll.
 */
export function Footer() {
  const handleAnchorClick = useAnchorScroll()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-x-clip border-t border-line">
      {/* A single soft glow anchored to the top edge, so the footer reads as a
          continuation of the page rather than a slab bolted underneath it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ── Identity ────────────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <Logo
              label={SITE.name}
              onClick={(event) => handleAnchorClick(event, '#home')}
              className="text-xl"
            />

            <p className="lead mt-5 max-w-sm text-body-sm">{FOOTER.statement}</p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.href}
                    target="_blank"
                    // `noreferrer` implies `noopener`, but both are stated: some
                    // older engines honour only one, and the token costs nothing.
                    rel="noreferrer noopener"
                    // Icon-only, so the label is the entire accessible name.
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="btn btn-icon btn-ghost border border-line hover:border-accent/40 hover:text-accent"
                  >
                    <TechIcon name={social.icon} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Navigate ────────────────────────────────────────────────── */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className="eyebrow flex text-faint">Navigate</h2>

            <ul className="mt-5 flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(event) => handleAnchorClick(event, link.href)}
                    className="link-underline text-body-sm text-muted transition-colors duration-fast hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Contact ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <h2 className="eyebrow flex text-faint">Get in touch</h2>

            <ul className="mt-5 flex flex-col gap-3">
              {CONTACT_METHODS.map((method) => (
                <li key={method.id}>
                  {/* An empty `href` renders plain text rather than a link that
                      goes nowhere — which is how the placeholder phone number
                      behaves until it is filled in. */}
                  {method.href ? (
                    <a
                      href={method.href}
                      className="group flex items-center gap-3 text-body-sm text-muted transition-colors duration-fast hover:text-ink"
                    >
                      <Icon
                        name={method.icon}
                        className="size-4 shrink-0 text-faint transition-colors duration-fast group-hover:text-accent"
                      />
                      <span className="truncate">{method.value}</span>
                    </a>
                  ) : (
                    <span className="flex items-center gap-3 text-body-sm text-muted">
                      <Icon name={method.icon} className="size-4 shrink-0 text-faint" />
                      <span className="truncate">{method.value}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <p className="text-body-sm text-faint">{FOOTER.ctaLabel}</p>

              <MagneticButton
                as="a"
                href={PERSONAL.resumeUrl}
                // `download` asks the browser to save rather than navigate,
                // which keeps the visitor on the page.
                download
                className="btn btn-outline btn-sm group/cta mt-3"
              >
                Download résumé
                <Icon
                  name="download"
                  className="size-4 transition-transform duration-base ease-out-expo group-hover/cta:translate-y-0.5"
                />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* ── Legal ─────────────────────────────────────────────────────── */}
        <div
          className={cn(
            'mt-14 flex flex-col gap-3 border-t border-line pt-8',
            'sm:flex-row sm:items-center sm:justify-between',
          )}
        >
          <p className="text-body-sm text-faint">{FOOTER.copyright(year)}</p>
          <p className="text-body-sm text-faint">{FOOTER.colophon}</p>
        </div>
      </Container>
    </footer>
  )
}
