'use server'

import env from '@/src/lib/Shared/Env'
import mysql from 'mysql2/promise'

export default async function getDatabase() {
  const connection = await getConnection()

  return connection
}

async function getConnection() {
  const connection = await mysql.createConnection({
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  })

  await connection.connect()

  return connection
}
