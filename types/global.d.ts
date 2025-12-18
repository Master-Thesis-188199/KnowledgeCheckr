import { Connection, Pool } from 'mysql2/promise'

declare global {
  var pool: Pool
  var connection: Connection
}
