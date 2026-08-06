import { useCallback, useMemo, useRef, useState } from 'react'

import { validateField } from '@shared/contactSchema.js'

/**
 * VALIDATION LIVES IN `shared/contactSchema.js`, NOT HERE.
 *
 * It used to be in this file. It moved when the form gained a real endpoint,
 * because the server has to apply exactly the same rules — and two copies of
 * "a message must be at least 20 characters" is how a form ends up accepting
 * input in the browser and rejecting it on submit, or the reverse.
 *
 * This hook is now about *when* validation runs and what happens to the result.
 * What counts as valid is not its decision.
 */

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

  // Stamped once when the form mounts. Sent with the submission so the server
  // can reject anything filled in faster than a human could read it — see
  // MIN_SUBMIT_MS in the shared schema. A ref rather than state: it must never
  // cause a render, and it must not change between submissions.
  const renderedAt = useRef(Date.now())

  // Guards against a second submission while the first is still in flight.
  // `status` cannot do this on its own: setState is asynchronous, so two rapid
  // submits can both read 'idle' before either write lands, and the visitor
  // sends two identical enquiries.
  const inFlight = useRef(false)

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  // What the server said, when it said anything. Preferred over the generic
  // copy because only the server knows which failure occurred.
  const [serverMessage, setServerMessage] = useState('')
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
      setServerMessage('')
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

      // Synchronous, so a double-click or an Enter keypress landing on the same
      // frame as a click cannot get past it.
      if (inFlight.current) return

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

      inFlight.current = true
      setStatus('submitting')

      try {
        await onSubmit?.({ ...values, renderedAt: renderedAt.current }, honeypotValue)
        setStatus('success')
        setValues(initialValues)
        setTouched({})
        setErrors({})
      } catch (error) {
        setStatus('error')

        // The endpoint returns per-field errors for anything the client's own
        // validation let through — a value that passed here but not there, or a
        // stale bundle validating against an older rule set. Attaching them to
        // the fields is what makes a server rejection actionable instead of a
        // banner saying something went wrong.
        if (error?.fieldErrors) {
          setErrors(error.fieldErrors)
          setTouched(Object.fromEntries(Object.keys(error.fieldErrors).map((id) => [id, true])))

          // Focus is deferred a frame, and it has to be. Every field is
          // `disabled` while submitting, and the state updates above have only
          // been *queued* at this point — React has not re-enabled anything yet.
          // Calling `focus()` here silently does nothing, because focusing a
          // disabled element is a no-op, and a keyboard or screen-reader user is
          // told the submission failed with no indication of where. Measured:
          // without the deferral, `document.activeElement` stayed on `<body>`.
          const firstId = Object.keys(error.fieldErrors)[0]
          if (firstId) {
            requestAnimationFrame(() => document.getElementById(firstId)?.focus())
          }
        }

        if (error?.message) setServerMessage(error.message)
      } finally {
        inFlight.current = false
      }
    },
    [fields, values, onSubmit, initialValues, honeypot, honeypotValue],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setStatus('idle')
    setServerMessage('')
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    status,
    serverMessage,
    isSubmitting: status === 'submitting',
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    honeypotValue,
    setHoneypotValue,
  }
}
