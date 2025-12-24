'use client'

import { logClient } from '@/src/lib/log/LogAction'

type LogClientOptions = Parameters<typeof logClient>[0]

/**
 * This hook exposes various log-level functions that can be used to send and log messages on the server. Note, these logging function cannot be used during the initial render, hence use with useEffects, functions, ...
 * @param context The optional context-prefix that shall be used for all messages.
 */
export function useLogger(context?: LogClientOptions['context']) {
  const info = (...message: unknown[]) => logClient({ level: 'info', context }, ...message)
  const warn = (...message: unknown[]) => logClient({ level: 'warn', context }, ...message)
  const error = (...message: unknown[]) => logClient({ level: 'error', context }, ...message)
  const verbose = (...message: unknown[]) => logClient({ level: 'verbose', context }, ...message)

  return { info, warn, error, verbose }
}
