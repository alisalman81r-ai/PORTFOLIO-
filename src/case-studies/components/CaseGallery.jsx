import { CaseSection } from './CaseSection'
import { Stagger, StaggerItem } from '@/components/animations'
import { ImageFrame } from '@/components/ui'
import { maskReveal } from '@/animations'
import { cn } from '@/utils'

/**
 * Section 10 — Gallery.
 *
 * HOW REPLACEMENT WORKS, AND WHY IT IS SPLIT IN TWO
 * Captions live in the case-study data file; images live in `media.js`. They are
 * separate on purpose. Writing a caption is authoring and happens once; swapping
 * a placeholder for a real screenshot is asset management and happens every time
 * a screen changes. Keeping them apart means replacing every image on a project
 * is one edit in one file, and it cannot disturb a word of the writing.
 *
 * `resolveGallery` in `schema.js` pairs them by index and keeps every caption
 * even when no image exists for it — so a slot you have written but not
 * photographed renders as an empty frame naming what belongs there, rather than
 * silently disappearing.
 *
 * Figures rather than divs: an image with a caption is a `<figure>` with a
 * `<figcaption>`, which is what tells assistive tech the two belong together.
 *
 * Every image is lazy-loaded. This section is the furthest thing down a long
 * page, and on a phone most readers never reach it.
 */
export function CaseGallery({ gallery, projectId }) {
  if (!gallery?.length) return null

  return (
    <CaseSection
      id="gallery"
      step="09"
      eyebrow="Gallery"
      icon="gallery"
      title="The work itself"
      lead="Screenshots and artefacts. Empty frames name what belongs in them — replace the entries in `media.js` and they fill in."
    >
      <Stagger as="ul" className="grid gap-5 sm:grid-cols-2">
        {gallery.map((item, index) => (
          <StaggerItem
            as="li"
            key={item.caption + index}
            variants={maskReveal}
            // The first image of each pair spans both columns on wide screens,
            // so the grid has a rhythm rather than reading as a contact sheet.
            className={cn(index % 3 === 0 && 'sm:col-span-2')}
          >
            <figure className="group">
              <ImageFrame
                src={item.image}
                alt={item.image ? item.caption : ''}
                ratio={index % 3 === 0 ? 'video' : 'square'}
                loading="lazy"
                placeholderLabel={item.hint ?? 'Add a screenshot'}
                placeholderHint={'media.js → projects.' + projectId + '.gallery[' + index + ']'}
                className="rounded-panel border border-line"
                imgClassName="transition-transform duration-slow ease-out-expo motion-safe:group-hover:scale-[1.03]"
              />
              <figcaption className="mt-3 text-body-sm text-faint">{item.caption}</figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </CaseSection>
  )
}
