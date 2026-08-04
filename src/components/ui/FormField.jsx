import { AnimatePresence, motion } from 'motion/react'

import { Icon } from './Icon'
import { DURATION, EASE } from '@/animations'
import { cn } from '@/utils'

/**
 * Labelled form control with validation messaging.
 *
 * Renders an `<input>` or a `<textarea>` from one config object, because the
 * only differences between them are the tag and a `rows` attribute — two
 * near-identical components would drift the moment either got a new state.
 *
 * ACCESSIBILITY — the parts that are easy to get wrong
 *   - A real `<label htmlFor>`, never a placeholder standing in for one. A
 *     placeholder disappears the moment typing starts, so anyone who loses
 *     their place has nothing left to read.
 *   - `aria-invalid` announces the error state; `aria-describedby` points at
 *     the hint *and* the message, so both are read as part of the field rather
 *     than as loose text nearby.
 *   - `aria-required` alongside the visual asterisk — the asterisk alone is
 *     decoration a screen reader will not explain.
 *   - `role="alert"` on the error so it is announced when it appears, without
 *     the user having to go looking for it.
 *
 * The field is styled from the design system's tokens, so it matches every
 * other surface on the site without a bespoke input theme.
 *
 * @param {object} props
 * @param {import('@/data/contact').FormFieldConfig} props.field
 * @param {string} props.value
 * @param {string} [props.error] Message to show. Only rendered once `touched`.
 * @param {boolean} [props.touched]
 * @param {(id: string, value: string) => void} props.onChange
 * @param {(id: string) => void} props.onBlur
 * @param {boolean} [props.disabled]
 */
export function FormField({ field, value, error, touched, onChange, onBlur, disabled }) {
  const showError = Boolean(touched && error)
  const hintId = field.hint ? `${field.id}-hint` : undefined
  const errorId = showError ? `${field.id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const isTextarea = field.type === 'textarea'
  const Control = isTextarea ? 'textarea' : 'input'
  // Textareas always span; short fields opt in, so a lone half-width control
  // never sits beside an empty cell.
  const spansGrid = isTextarea || field.fullWidth

  return (
    <div className={cn('flex flex-col gap-2', spansGrid && 'sm:col-span-2')}>
      <label htmlFor={field.id} className="flex items-center gap-1.5 text-body-sm text-ink">
        {field.label}
        {field.required && (
          <span aria-hidden="true" className="text-accent">
            *
          </span>
        )}
      </label>

      {field.hint && (
        <p id={hintId} className="text-body-sm text-faint">
          {field.hint}
        </p>
      )}

      <Control
        id={field.id}
        name={field.id}
        // `type` is invalid on a textarea, so it is only spread for inputs.
        {...(!isTextarea && { type: field.type })}
        {...(isTextarea && { rows: field.rows ?? 5 })}
        value={value}
        onChange={(event) => onChange(field.id, event.target.value)}
        onBlur={() => onBlur(field.id)}
        placeholder={field.placeholder}
        autoComplete={field.autoComplete}
        // `maxLength` is enforced here as well as in validation: stopping the
        // keystroke is kinder than accepting 3,000 characters and rejecting it.
        maxLength={field.maxLength}
        disabled={disabled}
        aria-required={field.required || undefined}
        aria-invalid={showError || undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-input border bg-surface/60 px-4 py-3',
          'text-body-sm text-ink placeholder:text-faint',
          'transition-[border-color,background-color,box-shadow] duration-fast ease-out-quart',
          'focus:bg-surface focus:outline-none',
          // A visible focus state on the field itself, on top of the global
          // `:focus-visible` ring — a form is where focus position matters most.
          showError
            ? 'border-negative/60 focus:border-negative focus:shadow-[0_0_0_3px_var(--color-negative)]/20'
            : 'border-line focus:border-accent focus:shadow-glow',
          isTextarea && 'resize-y min-h-32',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      />

      {/* Height is not animated — a message appearing would push every field
          below it, and animating that reflow costs a layout pass per frame.
          Opacity and a short rise are compositor-only. */}
      <AnimatePresence mode="wait">
        {showError && (
          <motion.p
            key={error}
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.outQuart }}
            className="flex items-center gap-1.5 text-body-sm text-negative"
          >
            <Icon name="error" className="size-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
