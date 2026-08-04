import { useCallback, useMemo, useState } from 'react'

/**
 * Email pattern.
 *
 * Deliberately permissive. The only definitive test of an address is sending to
 * it, and every "strict" regex on the internet rejects valid addresses —
 * apostrophes, plus-addressing, new TLDs. This catches the genuine typos
 * (missing @, missing dot, trailing space) and lets everything else through,
 * which is the right trade for a contact form: a false rejection loses a real
 * enquiry, a false accept costs one bounced email.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate one value against its field config.
 *
 * Order matters: `required` is checked first so an empty field reports "this is
 * required" rather than "must be at least 20 characters", which is technically
 * true and completely unhelpful.
 *
 * @param {string} value
 * @param {import('@/data/contact').FormFieldConfig} field
 * @returns {string} Error message, or an empty string when valid.
 */
function validateField(value, field) {
  const trimmed = value.trim()

  if (field.required && !trimmed) {
    return `${field.label} is required.`
  }

  // Everything below only applies to a field with content. An optional field
  // left blank is valid, and length rules must not fire on it.
  if (!trimmed) return ''

  if (field.type === 'email' && !EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address.'
  }

  if (field.minLength && trimmed.length < field.minLength) {
    return `${field.label} must be at least ${field.minLength} characters.`
  }

  if (field.maxLength && trimmed.length > field.maxLength) {
    return `${field.label} must be ${field.maxLength} characters or fewer.`
  }

  return ''
}

/**
 * Form state, validation, and submission.
 *
 * Schema-driven: it reads the same declarative field config the UI renders
 * from, so adding a field to `data/contact.js` gives it validation, error
 * wiring and submission handling with no change here.
 *
 * WHEN ERRORS APPEAR
 * On blur, and on submit — never while typing. Validating each keystroke means
 * telling someone their email is invalid before they have finished writing it,
 * which is the most-complained-about pattern in form design. Once a field has
 * been blurred *and* is showing an error, it re-validates as they type, so the
 * message clears the moment they fix it rather than making them blur again.
 *
 * SUBMISSION
 * `onSubmit` receives the values and may be async. Throwing sets the `error`
 * status; returning normally sets `success` and resets the form.
 *
 * @param {object} options
 * @param {import('@/data/contact').FormFieldConfig[]} options.fields
 * @param {(values: Record<string, string>) => Promise<void>|void} options.onSubmit
 * @param {string} [options.honeypot] Name of a hidden field. When filled, the
 *   submission is treated as a bot: reported as success, and discarded.
 */
export function useForm({ fields, onSubmit, honeypot }) {
  const initialValues = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.id, ''])),
    [fields],
  )

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [honeypotValue, setHoneypotValue] = useState('')

  const handleChange = useCallback(
    (id, value) => {
      setValues((current) => ({ ...current, [id]: value }))

      // Only re-validate a field that is already showing an error, so the
      // message disappears as soon as the problem is fixed — without ever
      // being the first thing a user sees while typing.
      setErrors((current) => {
        if (!current[id]) return current
        const field = fields.find((item) => item.id === id)
        return { ...current, [id]: field ? validateField(value, field) : '' }
      })

      // Any edit after a completed submission returns the form to a neutral
      // state, so a stale "sent" banner never sits above a half-typed message.
      setStatus((current) => (current === 'success' || current === 'error' ? 'idle' : current))
    },
    [fields],
  )

  const handleBlur = useCallback(
    (id) => {
      const field = fields.find((item) => item.id === id)
      if (!field) return

      setTouched((current) => ({ ...current, [id]: true }))
      setErrors((current) => ({ ...current, [id]: validateField(values[id] ?? '', field) }))
    },
    [fields, values],
  )

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault()

      // Silently accept and discard. Telling a bot it failed only teaches it
      // to try again with the field left blank.
      if (honeypot && honeypotValue) {
        setStatus('success')
        return
      }

      const nextErrors = Object.fromEntries(
        fields.map((field) => [field.id, validateField(values[field.id] ?? '', field)]),
      )

      setErrors(nextErrors)
      setTouched(Object.fromEntries(fields.map((field) => [field.id, true])))

      const firstInvalid = fields.find((field) => nextErrors[field.id])
      if (firstInvalid) {
        // Move focus to the first problem. Without this a keyboard or screen
        // reader user is told the form failed with no indication of where.
        document.getElementById(firstInvalid.id)?.focus()
        return
      }

      setStatus('submitting')

      try {
        await onSubmit?.(values)
        setStatus('success')
        setValues(initialValues)
        setTouched({})
      } catch {
        setStatus('error')
      }
    },
    [fields, values, onSubmit, initialValues, honeypot, honeypotValue],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setStatus('idle')
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    status,
    isSubmitting: status === 'submitting',
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    honeypotValue,
    setHoneypotValue,
  }
}
