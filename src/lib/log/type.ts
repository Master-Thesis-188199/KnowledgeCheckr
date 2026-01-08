import { z } from 'zod'
export const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
}

export const logLevelColors: { [key in LoggerLevels]: string } = {
  error: 'bold red',
  warn: 'bold yellow',
  info: 'blue',
  verbose: 'magenta',
  debug: 'italic gray',
}
export type LoggerLevels = keyof typeof logLevels

export const LogSchema = z.object({
  level: z.enum(['verbose', 'info', 'warn', 'error', 'debug']),
  context: z.string().optional(),
  messages: z.array(z.unknown()).default([]),
})

export type LoggerOptions = z.infer<typeof LogSchema>
