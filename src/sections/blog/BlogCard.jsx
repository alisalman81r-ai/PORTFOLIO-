import { memo } from 'react'

import { Icon, ImageFrame, Tag } from '@/components/ui'
import { StaggerItem } from '@/components/animations'
import { maskReveal } from '@/animations'
import { formatDate } from '@/utils'
import { cn } from '@/utils'

/**
 * One article preview.
 *
 * THE WHOLE CARD IS ONE LINK
 * The anchor wraps only the title and stretches over the card with an
 * `::after` overlay. That gives a large click target while keeping a single tab
 * stop whose accessible name is the article title — rather than the three
 * separate links (image, title, "read more") that a naive version produces, all
 * pointing at the same place.
 *
 * The date is a `<time datetime>`: machine-readable for crawlers and assistive
 * tech, human-readable on screen. Storing the ISO value and formatting at
 * render is what makes both possible from one field.
 *
 * Articles without a `url` render the action disabled rather than linking
 * nowhere — every placeholder post is in that state until it is written.
 *
 * @param {object} props
 * @param {import('@/data/blog').Post} props.post
 */
export const BlogCard = memo(function BlogCard({ post }) {
  const isPublished = Boolean(post.url)

  // A wipe rather than a rise — the card is led by its cover image, and a clip
  // reveal is the editorial idiom for photography. See the vector guide in
  // `animations/variants.js`.
  return (
    <StaggerItem as="li" variants={maskReveal} className="h-full">
      <article
        className={cn(
          'card card-glass card-flush group relative flex h-full flex-col overflow-hidden rounded-card',
          'transition-[background-color,border-color,box-shadow] duration-base ease-out-quart',
          'hover:border-accent/30 hover:shadow-glow',
          // The stretched link has no box of its own, so without this a
          // keyboard user gets a focus ring around nothing.
          'focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-accent',
        )}
      >
        <ImageFrame
          src={post.cover}
          alt={post.cover ? `${post.title} — cover` : ''}
          ratio="video"
          // Below the fold on every viewport, so deferring the fetch is the
          // biggest saving available here once real artwork lands.
          loading="lazy"
          placeholderLabel="Add a cover image"
          placeholderHint="post.cover"
          imgClassName={cn(
            'transition-transform duration-slow ease-out-expo',
            'motion-safe:group-hover:scale-[1.06]',
          )}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-canvas/70 to-transparent"
          />
          <div className="absolute top-4 left-4">
            <Tag tone="accent">{post.category}</Tag>
          </div>
        </ImageFrame>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-faint">
            <span className="flex items-center gap-1.5">
              <Icon name="calendar" className="size-3.5" />
              <time dateTime={post.date}>{formatDate(post.date, { month: 'short' })}</time>
            </span>

            <span className="flex items-center gap-1.5">
              <Icon name="timer" className="size-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          {/* h3: the section heading is h2, so the outline stays continuous. */}
          <h3 className="mt-4 font-display text-lg font-medium text-ink">
            {isPublished ? (
              <a
                href={post.url}
                className={cn(
                  'transition-colors duration-fast group-hover:text-accent',
                  // Stretches over the card without nesting it inside an
                  // anchor, which would swallow any other link placed here.
                  'after:absolute after:inset-0 after:content-[""]',
                )}
              >
                {post.title}
              </a>
            ) : (
              post.title
            )}
          </h3>

          <p className="mt-3 text-body-sm text-muted">{post.description}</p>

          {/* `mt-auto` pins the action to the bottom regardless of description
              length, so a row of cards has its actions on one line. */}
          <p
            className={cn(
              'mt-auto flex items-center gap-2 pt-6 text-body-sm font-medium',
              isPublished ? 'text-accent' : 'text-faint',
            )}
          >
            {isPublished ? 'Read more' : 'Coming soon'}
            {isPublished && (
              <Icon
                name="arrow"
                className="size-4 transition-transform duration-base ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            )}
          </p>
        </div>
      </article>
    </StaggerItem>
  )
})
