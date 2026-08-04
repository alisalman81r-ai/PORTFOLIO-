import { motion } from 'motion/react'

import { DURATION, EASE, STAGGER } from '@/animations'
import { cn } from '@/utils'

/**
 * Reveals text word by word, each rising out of a clipping mask.
 *
 * The signature editorial headline entrance: type appears to be *set* rather
 * than to fade in.
 *
 * ACCESSIBILITY — THE PART MOST IMPLEMENTATIONS GET WRONG
 * -------------------------------------------------------
 * Splitting a sentence into per-word elements destroys it for screen readers:
 * many announce each fragment as a separate item, turning one headline into
 * nine. So the original string is exposed once via `aria-label`, and every
 * generated span is `aria-hidden`. Assistive tech reads the sentence; sighted
 * users get the animation. Text remains real, selectable, and indexable.
 *
 * WHY WORDS AND NOT CHARACTERS
 * ----------------------------
 * Per-character reveals shatter a headline into dozens of animated nodes and
 * break text selection, ligatures, and word wrapping. Words carry the same
 * effect at a fraction of the cost.
 *
 * The mask is `overflow: hidden` on each word's wrapper via `line-mask`, which
 * also compensates for the descender clipping that naive `overflow-hidden`
 * causes on letters like g, y, and p.
 *
 * @param {object} props
 * @param {string} props.text Sentence to reveal. Kept intact for `aria-label`.
 * @param {React.ElementType} [props.as='span'] Wrapper element. The wrapper is
 *   a container, not the heading itself — put this inside your `<h1>`.
 * @param {number} [props.delay=0] Seconds before the first word.
 * @param {number} [props.stagger=STAGGER.tight] Seconds between words.
 * @param {boolean} [props.animate=true] Set false to defer to a parent's
 *   variant propagation instead of animating on mount.
 * @param {string} [props.className]
 * @param {string} [props.wordClassName] Applied to each word — for per-word
 *   gradients or colour.
 *
 * @example
 * <h1 className="heading-lg">
 *   <TextReveal text="Building digital" />
 *   <TextReveal text="products" delay={0.1} />
 * </h1>
 */
export function TextReveal({
  text,
  as: Component = 'span',
  delay = 0,
  stagger = STAGGER.tight,
  animate = true,
  className,
  wordClassName,
  ...rest
}) {
  const words = String(text).split(' ')

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }

  const word = {
    hidden: { y: '110%' },
    visible: {
      y: '0%',
      transition: { duration: DURATION.slow, ease: EASE.outExpo },
    },
  }

  const MotionTag = motion[Component] ?? motion.span

  return (
    <MotionTag
      aria-label={text}
      className={cn('inline', className)}
      variants={container}
      {...(animate && { initial: 'hidden', animate: 'visible' })}
      {...rest}
    >
      {words.map((item, index) => (
        <span
          // Words repeat within a sentence, so the index is part of the key.
          key={`${item}-${index}`}
          aria-hidden="true"
          className="line-mask mr-[0.25em]"
        >
          <motion.span variants={word} className={cn('inline-block', wordClassName)}>
            {item}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
