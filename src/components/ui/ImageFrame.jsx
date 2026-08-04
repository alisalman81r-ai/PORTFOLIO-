import { Icon } from './Icon'
import { cn } from '@/utils'

const RATIOS = {
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
  video: 'aspect-video',
  tall: 'aspect-[3/4]',
}

/**
 * Fixed-ratio image container with a built-in placeholder.
 *
 * REPLACING THE PLACEHOLDER
 * -------------------------
 * Drop a photo into `src/assets/images/`, then in `src/data/personal.js`:
 *
 *   import portrait from '@/assets/images/portrait.jpg'
 *   export const PERSONAL = { …, avatar: portrait }
 *
 * Import it rather than writing a string path — Vite then fingerprints and
 * optimises the file, and a typo fails the *build* instead of shipping a broken
 * image to production. Nothing else changes; this component swaps automatically.
 *
 * WHY THE RATIO IS ENFORCED
 * -------------------------
 * The aspect ratio is reserved by the container, so the layout is correct before
 * the image decodes. Without it the page reflows the moment the photo arrives —
 * a Cumulative Layout Shift hit, and visibly janky on a slow connection.
 *
 * @param {object} props
 * @param {string} [props.src] Imported image. Falsy renders the placeholder.
 * @param {string} [props.alt] Required when `src` is set. Describe the person,
 *   not the file: "Portrait of …", never "portrait.jpg".
 * @param {keyof typeof RATIOS} [props.ratio='portrait']
 * @param {'lazy'|'eager'} [props.loading] Defer the fetch until the image nears
 *   the viewport. Omitted by default, which leaves the browser's `eager`
 *   behaviour — correct for anything above the fold, where deferring would
 *   delay the largest element on the page. Pass `"lazy"` for images further
 *   down, such as a project gallery.
 * @param {string} [props.className] Applied to the frame.
 * @param {string} [props.imgClassName] Applied to the `<img>` itself. For
 *   effects that must transform the image *inside* a fixed frame — a hover
 *   zoom, for instance — where transforming the frame would reflow the layout
 *   around it.
 * @param {string} [props.placeholderLabel='Add an image'] Shown when there is no
 *   `src`. Generic by default — this component is used for portraits, project
 *   previews, and galleries, and a placeholder that names the wrong thing is
 *   worse than a vague one.
 * @param {string} [props.placeholderHint] The data field to fill in, e.g.
 *   `'project.thumbnail'`. Rendered smaller, beneath the label.
 * @param {string} [props.placeholderIcon='gallery'] Registry key for the glyph.
 * @param {React.ReactNode} [props.children] Overlays — badges, gradients.
 */
export function ImageFrame({
  src,
  alt = '',
  ratio = 'portrait',
  loading,
  className,
  imgClassName,
  placeholderLabel = 'Add an image',
  placeholderHint,
  placeholderIcon = 'gallery',
  children,
  ...rest
}) {
  return (
    <div
      className={cn('relative overflow-hidden bg-surface', RATIOS[ratio] ?? RATIOS.portrait, className)}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          // Opt-in per usage: `lazy` is right for a gallery further down the
          // page, and wrong for a hero portrait, where deferring the largest
          // element delays the page's perceived load. `async` decoding keeps
          // the decode off the main thread either way.
          loading={loading}
          decoding="async"
          className={cn('size-full object-cover', imgClassName)}
        />
      ) : (
        <Placeholder label={placeholderLabel} hint={placeholderHint} icon={placeholderIcon} />
      )}

      {children}
    </div>
  )
}

/**
 * Stand-in shown until a real photo exists.
 *
 * Built to look like a considered empty state rather than a broken image: a
 * soft gradient, a centred glyph, and a mono hint naming the file to replace.
 * It is unmistakably a placeholder, which is the point — a generic stock-looking
 * silhouette could ship unnoticed.
 *
 * `aria-hidden` because it conveys nothing to a screen reader; the surrounding
 * section already says who this is about.
 */
function Placeholder({ label, hint, icon }) {
  return (
    <div
      aria-hidden="true"
      className="grid size-full place-items-center bg-gradient-to-br from-elevated via-surface to-sunken"
    >
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <span className="glass grid size-16 place-items-center rounded-full">
          <Icon name={icon} className="size-6 text-faint" />
        </span>

        <span className="font-mono text-xs text-faint">
          {label}
          {hint && (
            <>
              <br />
              <span className="text-faint/70">{hint}</span>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
