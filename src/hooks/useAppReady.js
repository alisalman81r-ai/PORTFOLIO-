import { useContext } from 'react'

import { AppReadyContext } from '@/context/appReadyContext'

/**
 * Whether the first-load loader has finished.
 *
 * Use it to hold back an entrance animation that would otherwise play behind the
 * loader — not to gate rendering. The content should already be in the DOM and
 * laid out; only its motion waits.
 *
 * @returns {import('@/context/appReadyContext').AppReadyContextValue}
 * @throws If called outside <AppReadyProvider>.
 *
 * @example
 * const { isReady } = useAppReady()
 * <motion.div initial="hidden" animate={isReady ? 'visible' : 'hidden'} />
 */
export function useAppReady() {
  const context = useContext(AppReadyContext)

  if (!context) {
    throw new Error('useAppReady() must be called inside an <AppReadyProvider>.')
  }

  return context
}
