import { BlogCard } from './BlogCard'
import { Section } from '@/layouts'
import { Stagger } from '@/components/animations'
import { GlowOrb, SectionHeader } from '@/components/ui'
import { FEATURED_POSTS, HAS_POSTS, BLOG_META } from '@/data'

/**
 * Blog preview.
 *
 * Shows three posts, not every post. This is a doorway to the writing, and a
 * section that lists everything removes the reason to open the blog itself —
 * the cap lives in `data/blog.js` as `FEATURED_POSTS`, so the component renders
 * whatever it is given.
 *
 * The section removes itself below two posts: one article is not a blog, and an
 * "Insights" heading over a single card advertises how little there is.
 */
export function Blog() {
  if (!HAS_POSTS) return null

  return (
    <Section
      id="blog"
      labelledBy="blog-title"
      // `overflow-x-clip`, not `overflow-hidden`: hidden would make this a
      // scroll container and break `position: sticky` for anything nested here.
      className="relative overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GlowOrb
          tone="warm"
          motion="drift-slow"
          className="top-[15%] left-[10%] size-[45vw] max-w-[560px]"
        />
      </div>

      <div className="relative">
        <SectionHeader
          id="blog-title"
          badge={BLOG_META.badge}
          headline={BLOG_META.headline}
          intro={BLOG_META.intro}
        />

        <Stagger
          as="ul"
          className="mt-14 grid items-stretch gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        >
          {FEATURED_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
