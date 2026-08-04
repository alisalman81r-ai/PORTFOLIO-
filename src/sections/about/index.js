/**
 * About section.
 *
 * A folder because the section has four independently meaningful parts: the
 * portrait composition, the pillar cards, the timeline, and a timeline item.
 *
 * Only `About` is public. `AboutPortrait`, `HighlightCards`, `Timeline`, and
 * `TimelineItem` are implementation details and are intentionally not
 * re-exported — anything reusable beyond this section belongs in
 * `@/components/ui` instead, which is where `Icon`, `Tag`, `ImageFrame`, and
 * `GlowBorder` came from while building it.
 */

export { About } from './About'
