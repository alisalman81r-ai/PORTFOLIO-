import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Compose class names conditionally, resolving Tailwind conflicts.
 *
 * `clsx` flattens the conditional syntax; `twMerge` then makes the *last*
 * conflicting utility win, so a caller's prop can override a component default:
 *
 *   cn('px-4 py-2 bg-surface', isActive && 'bg-accent', className)
 *   // -> 'px-4 py-2 bg-accent'  (plain string concat would keep both)
 *
 * @param {...(string|number|boolean|null|undefined|Record<string, unknown>|Array<unknown>)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
