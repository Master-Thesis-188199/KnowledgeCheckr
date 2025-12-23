import 'server-only'
import 'winston-daily-rotate-file'
import 'node-json-color-stringify'
import winston, { Logger as WinstonLogger } from 'winston'
import { formatLogMessage } from '@/src/lib/log/FormatLogMessage'
import { createProductionFileTransports } from '@/src/lib/log/ProductionTransports'
import env from '@/src/lib/Shared/Env'

/**
 * Logger type extended with a convenience method to set a module-context.
 * The `context` can be any string that helps identify the origin of a log entry.
 */
export interface ModuleLoggerLogger extends WinstonLogger {
  /**
   * Returns a child logger whose logs are tagged with the given context.
   *
   * @example
   * ```ts
   * const log = logger.createModuleLogger("checks")
   * log.info("Fetch checks...")
   * ```
   */
  createModuleLogger(context: string): ModuleLoggerLogger
}

const baseLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format((log) => ({ ...log, level: log.level.toUpperCase() }))(), //* upper-case level
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, context, ...rest }) =>
      formatLogMessage({ show: { context: true, args: true, timestamp: true }, values: { level, message, timestamp, context, ...rest } }),
    ),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ level: true }),
        winston.format.printf(({ level, message, timestamp, context, ...rest }) =>
          formatLogMessage({ show: { context: true, args: true, colorizeArgs: true }, values: { level, message, timestamp, context, ...rest } }),
        ),
      ),
    }),
    ...createProductionFileTransports({ create: env.ENABLE_FILE_LOGGING }),
  ],
}) as ModuleLoggerLogger

// Implement createModuleLogger so it returns a child logger with that context.
baseLogger.createModuleLogger = function (this: ModuleLoggerLogger, context: string): ModuleLoggerLogger {
  const child = this.child({ context }) as ModuleLoggerLogger
  // Ensure child also has createModuleLogger, so you can re-scope further if desired.
  child.createModuleLogger = baseLogger.createModuleLogger
  return child
}

const logger: ModuleLoggerLogger = baseLogger
export default logger
