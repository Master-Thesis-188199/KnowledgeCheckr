import 'winston-daily-rotate-file'
import 'node-json-color-stringify'
import isEmpty from 'lodash/isEmpty'
import winston, { Logger as WinstonLogger } from 'winston'

/**
 * Logger type extended with a convenience method to set a module-context
 * The `context` is can be any string that helps identify the origin of a log entry.
 */
export interface ContextLogger extends WinstonLogger {
  /**
   *
   * @example
   * ```ts
   * logger.setContext("checks")
   * logger.info('Fetch checks...');
   * ```
   */
  setContext(context: string): void
}

let loggerContext: string | null = null

const logFormat = winston.format.printf(({ level, message, timestamp, ...rest }) => {
  return `${timestamp} [${level}]: ${message} ${JSON.stringify(rest, null, 2)}`.trim()
})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    //* upper-case level
    winston.format((info) => {
      info.level = info.level.toUpperCase()
      return info
    })(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ level: true }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        winston.format.printf(({ level, message, timestamp, ...rest }) => {
          //@ts-expect-error Expect colorStringify to not be found
          return `${loggerContext ? `(${loggerContext})` : ''} [${level}]: ${message} ${!isEmpty(rest) ? '\n' + JSON.colorStringify(rest, null, 2) : ''}`.trim()
        }),
      ),
    }),
  ],
}) as ContextLogger

if (process.env.NODE_ENV === 'production') {
  const transportAll = new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  })

  const transportError = new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
  })

  logger.add(transportAll)
  logger.add(transportError)
}

logger.setContext = function (context: string) {
  loggerContext = context
}

export default logger
