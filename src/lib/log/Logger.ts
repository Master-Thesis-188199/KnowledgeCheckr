import 'winston-daily-rotate-file'
import 'node-json-color-stringify'
import isEmpty from 'lodash/isEmpty'
import winston, { Logger as WinstonLogger } from 'winston'
import env from '@/src/lib/Shared/Env'

/**
 * Logger type extended with a convenience method to set a module-identifier.
 * The `identifier` can be any string that helps identify the origin of a log entry.
 */
export interface ModuleLoggerLogger extends WinstonLogger {
  /**
   * Returns a child logger whose logs are tagged with the given identifier.
   *
   * @example
   * ```ts
   * const log = logger.createModuleLogger("checks")
   * log.info("Fetch checks...")
   * ```
   */
  createModuleLogger(identifier: string): ModuleLoggerLogger
}

const logFormat = winston.format.printf(({ level, message, timestamp, identifier, ...rest }) => {
  const prefix = identifier ? `(${identifier}) ` : ''
  return `${timestamp} ${prefix}[${level}]: ${message} ${JSON.stringify(rest, null, 2)}`.trim()
})

const productionTransports = []

if (env.NEXT_PUBLIC_MODE !== 'development') {
  productionTransports.push(
    new winston.transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  )
}

const baseLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    //* upper-case level
    winston.format((info) => {
      info.level = info.level.toUpperCase()
      return info
    })(),
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ level: true }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        winston.format.printf(({ level, message, timestamp, identifier, ...rest }) => {
          const prefix = identifier ? `(${identifier}) ` : ''
          // @ts-expect-error Expect colorStringify to not be found
          const restStr = !isEmpty(rest) ? '\n' + JSON.colorStringify(rest, null, 2) : ''
          return `${prefix}[${level}]: ${message} ${restStr}`.trim()
        }),
      ),
    }),
    ...productionTransports,
  ],
}) as ModuleLoggerLogger

// Implement createModuleLogger so it returns a child logger with that identifier.
baseLogger.createModuleLogger = function (this: ModuleLoggerLogger, identifier: string): ModuleLoggerLogger {
  const child = this.child({ identifier }) as ModuleLoggerLogger
  // Ensure child also has createModuleLogger, so you can re-scope further if desired.
  child.createModuleLogger = baseLogger.createModuleLogger
  return child
}

const logger: ModuleLoggerLogger = baseLogger
export default logger
