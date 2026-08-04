import { AnimatePresence, motion } from 'motion/react'

import { FormField, Icon } from '@/components/ui'
import { DURATION, EASE } from '@/animations'
import { FORM_FIELDS, FORM_MESSAGES, HONEYPOT_FIELD } from '@/data'
import { useForm } from '@/hooks'
import { cn } from '@/utils'

/**
 * Contact form.
 *
 * NO BACKEND YET — AND THE SEAM IS EXPLICIT
 * The submit handler below is the only place that needs to change. Swap the
 * simulated delay for a real request and everything around it — validation,
 * error focus, status messaging, the honeypot, the disabled state — already
 * works:
 *
 *   const handleSubmit = async (values) => {
 *     const response = await fetch('https://formspree.io/f/YOUR_ID', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(values),
 *     })
 *     if (!response.ok) throw new Error('Request failed')
 *   }
 *
 * Throwing is the contract: `useForm` turns a rejection into the error status.
 * A no-backend form that silently pretends to succeed is worse than no form at
 * all, so the simulation is documented here rather than hidden.
 *
 * `noValidate` turns off the browser's own bubbles so ours are the only
 * messages shown — they are styled, positioned next to the field, and announced
 * via `role="alert"`. The input `type` attributes stay, because they still
 * select the right mobile keyboard.
 */
export function ContactForm({ className }) {
  const form = useForm({
    fields: FORM_FIELDS,
    honeypot: HONEYPOT_FIELD,
    onSubmit: async () => {
      // ── REPLACE THIS ────────────────────────────────────────────────────
      // Simulated latency so the submitting state is real and testable.
      // Throw to exercise the error path.
      await new Promise((resolve) => setTimeout(resolve, 900))
      // ────────────────────────────────────────────────────────────────────
    },
  })

  const { values, errors, touched, status, isSubmitting } = form

  return (
    <form
      onSubmit={form.handleSubmit}
      noValidate
      className={cn('card card-glass rounded-panel', className)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {FORM_FIELDS.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={values[field.id] ?? ''}
            error={errors[field.id]}
            touched={touched[field.id]}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            disabled={isSubmitting}
          />
        ))}
      </div>

      {/*
        Honeypot. Hidden from sight, from assistive tech, and from the tab
        order — so no human can fill it — while remaining a real field in the
        DOM that a bot will happily complete.

        `left-[-9999px]` rather than `display: none`: some bots skip fields
        that are not rendered, and this one needs to look fillable.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px]">
        <label htmlFor={HONEYPOT_FIELD}>Company website</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypotValue}
          onChange={(event) => form.setHoneypotValue(event.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary group/cta"
        >
          {isSubmitting ? (
            <>
              <Icon name="spinner" className="size-4 animate-spin" />
              {FORM_MESSAGES.submitting}
            </>
          ) : (
            <>
              Send message
              <Icon
                name="send"
                className="size-4 transition-transform duration-base ease-out-expo group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
              />
            </>
          )}
        </button>

        {/*
          Submission result.

          `aria-live="polite"` announces it without interrupting, and the region
          is always in the DOM — a live region inserted at the same moment as
          its content is frequently missed, because the announcement fires
          before assistive tech has registered the region exists.
        */}
        <div aria-live="polite" className="min-h-6 flex-1">
          <AnimatePresence mode="wait">
            {(status === 'success' || status === 'error') && (
              <motion.p
                key={status}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast, ease: EASE.outQuart }}
                className={cn(
                  'flex items-start gap-2 text-body-sm',
                  status === 'success' ? 'text-positive' : 'text-negative',
                )}
              >
                <Icon
                  name={status === 'success' ? 'success' : 'error'}
                  className="mt-0.5 size-4 shrink-0"
                />
                {FORM_MESSAGES[status]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  )
}
