'use client'

import { LoggerOptions } from '@/src/lib/log/type'

/**
 * This hook exposes various log-level functions that can be used to send and log messages on the server. Note, these logging function cannot be used during the initial render, hence use with useEffects, functions, ...
 * @param context The optional context-prefix that shall be used for all messages.
 */
export function useLogger(context?: LoggerOptions['context']) {
  const info = (...messages: LoggerOptions['messages']) => sendClientLog({ level: 'info', context, messages })
  const warn = (...messages: LoggerOptions['messages']) => sendClientLog({ level: 'warn', context, messages })
  const error = (...messages: LoggerOptions['messages']) => sendClientLog({ level: 'error', context, messages })
  const verbose = (...messages: LoggerOptions['messages']) => sendClientLog({ level: 'verbose', context, messages })

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
