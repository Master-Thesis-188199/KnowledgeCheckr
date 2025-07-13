/* eslint-disable no-var */
import { Pool } from 'mysql2/promise'

declare global {
  var pool: Pool
}
