import { AnimatePresence, motion } from 'motion/react'

import { Icon } from './Icon'
import { DURATION, EASE } from '@/animations'
import { cn } from '@/utils'

/**
 * Labelled form control with validation messaging.
 *
 * Renders an `<input>`, a `<textarea>` or a `<select>` from one config object,
 * because the differences between them are a tag and one or two attributes —
 * three near-identical components would drift the moment any of them got a new
 * state.
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
 *   - The select is a native `<select>`. A custom listbox would need keyboard
 *     handling, focus management and ARIA state rebuilt from scratch, and would
 *     still be worse on a phone. Only the closed state is restyled.
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
  const isSelect = field.type === 'select'
  const Control = isTextarea ? 'textarea' : isSelect ? 'select' : 'input'
  // Textareas always span; short fields opt in, so a lone half-width control
  // never sits beside an empty cell.
  const spansGrid = isTextarea || field.fullWidth

  // Built once and spread at both call sites below, so the two renderings
  // cannot drift apart.
  const controlProps = {
    id: field.id,
    name: field.id,
    // `type` belongs to <input> alone — it is invalid on <textarea> and
    // <select>, and React passes unknown attributes straight to the DOM.
    ...(!isTextarea && !isSelect && { type: field.type }),
    ...(isTextarea && { rows: field.rows ?? 5 }),
    // A <select> has no placeholder attribute; its first option is the
    // placeholder. Passing one would render an invalid attribute.
    ...(!isSelect && { placeholder: field.placeholder }),
    // Enforced here as well as in validation: stopping the keystroke is kinder
    // than accepting 3,000 characters and then rejecting them. Meaningless on a
    // <select>, where the option list is the constraint — and that list is
    // re-checked on the server against the same shared schema.
    ...(!isSelect && { maxLength: field.maxLength }),
    value,
    onChange: (event) => onChange(field.id, event.target.value),
    onBlur: () => onBlur(field.id),
    autoComplete: field.autoComplete,
    disabled,
    'aria-required': field.required || undefined,
    'aria-invalid': showError || undefined,
    'aria-describedby': describedBy,
    className: cn(
      // `mt-auto` bottom-aligns the control inside its grid cell. Without it, a
      // field carrying a hint pushes its own input down while the one beside it
      // stays high, and the row reads as broken alignment rather than as two
      // fields. Costs nothing on the fields that have no hint.
      'mt-auto w-full rounded-input border bg-surface/60 px-4 py-3',
      'text-body-sm text-ink placeholder:text-faint',
      'transition-[border-color,background-color,box-shadow] duration-fast ease-out-quart',
      'focus:bg-surface focus:outline-none',
      // A visible focus state on the field itself, on top of the global
      // `:focus-visible` ring — a form is where focus position matters most.
      showError
        ? 'border-negative/60 focus:border-negative focus:shadow-[0_0_0_3px_var(--color-negative)]/20'
        : 'border-line focus:border-accent focus:shadow-glow',
      isTextarea && 'resize-y min-h-32',
      isSelect && [
        // `appearance-none` lets the closed state match the inputs beside it.
        // The chevron is a background image rather than an overlaid element, so
        // it cannot intercept a click meant for the control.
        'cursor-pointer appearance-none bg-no-repeat pr-11',
        'bg-[length:1.15rem] bg-[position:right_0.9rem_center]',
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a90' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]",
        // An unchosen select shows its placeholder option; colouring it like a
        // placeholder is what stops "Select a service" reading as an answer.
        !value && 'text-faint',
      ],
      disabled && 'cursor-not-allowed opacity-60',
    ),
  }

  return (
    <div className={cn('flex h-full flex-col gap-2', spansGrid && 'sm:col-span-2')}>
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

      {/*
        THE SELECT IS A SEPARATE CALL SITE, AND IT HAS TO BE.

        The tempting version is one `<Control>` with `{isSelect && options}` as
        its children. It does not work: `<input>` is a void element, and React
        throws — not warns — the moment children are passed to one, even when
        the expression evaluates to `false`. What React checks is that the JSX
        has children at all, not what they evaluate to.

        Written that way, this component crashed every page that rendered a text
        input, and neither the linter nor the production build caught it. Two
        call sites sharing one props object is the cost of not shipping that.
      */}
      {isSelect ? (
        <Control {...controlProps}>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface text-ink">
              {option.label}
            </option>
          ))}
        </Control>
      ) : (
        <Control {...controlProps} />
      )}

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
