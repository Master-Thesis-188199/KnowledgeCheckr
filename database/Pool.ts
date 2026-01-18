import { createPool as mysqlCreatePool, Pool, PoolOptions } from 'mysql2/promise'
import _logger from '@/src/lib/log/Logger'
import env from '@/src/lib/Shared/Env'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

let pool: Pool
const config: PoolOptions = {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  connectionLimit: 10,
}

/**
 * Caching of database pool during developement
 * This is to prevent the "Too many connections" error during development
 * In production, a new pool is created for each request
 * @returns A mysql connection pool
 */
export default function createPool(): Pool {
  if (process.env.NODE_ENV === 'production') {
    pool = mysqlCreatePool(config)
  } else {
    if (!global.pool) {
      logger.info('Creating new database pool for development environment.')
      global.pool = mysqlCreatePool(config)
    }
    pool = global.pool
  }

  return pool
}
