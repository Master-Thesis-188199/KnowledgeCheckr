'use client'

import { logClient } from '@/src/lib/log/LogAction'
import { LoggerOptions } from '@/src/lib/log/type'

type LogClientOptions = Parameters<typeof logClient>[0]

/**
 * This hook exposes various log-level functions that can be used to send and log messages on the server. Note, these logging function cannot be used during the initial render, hence use with useEffects, functions, ...
 * @param context The optional context-prefix that shall be used for all messages.
 */
export function useLogger(context?: LogClientOptions['context']) {
  const info = (...messages: unknown[]) => sendClientLog({ level: 'info', context, messages })
  const warn = (...messages: unknown[]) => sendClientLog({ level: 'warn', context, messages })
  const error = (...messages: unknown[]) => sendClientLog({ level: 'error', context, messages })
  const verbose = (...messages: unknown[]) => sendClientLog({ level: 'verbose', context, messages })

  return { info, warn, error, verbose }
}

async function sendClientLog(logOptions: LoggerOptions) {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(logOptions),
      keepalive: true,
    })
  } catch {}
}
