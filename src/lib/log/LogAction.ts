'use server'

import _logger from '@/src/lib/log/Logger'
import { Any } from '@/types'

/**
 * This server-action allows the client-side to send logs to the server that are then captured by winston.
 * @param opt.level Defines he log level for the message
 * @param opt.contaxt Optionally defines the context-prefix that is shown before the message
 * @param message The message arguments that are to be logged
 */
export async function logClient(opt: { level: 'info' | 'verbose' | 'warn' | 'error'; context?: string }, ...message: Any[]) {
  const logger = _logger.createModuleLogger(opt.context ? `client/${opt.context}` : 'Client')

  // Converting client-data into referencable obj on server
  // Otherwise: 'Cannot access toString on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client.'
  const msgs = JSON.parse(JSON.stringify(message))

  // eslint-disable-next-line prefer-spread
  logger[opt.level].apply(logger, msgs)
}
