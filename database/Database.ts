'use server'

import env from '@/src/lib/Shared/Env'
import { Any } from '@/types'
import mysql, { Connection } from 'mysql2/promise'

export type DBConnection = Connection & {
  insert: <T = Any>(query: string, values?: Any[]) => Promise<{ [key: string]: T } | never>
}

let connection: DBConnection | null = null
export default async function getDatabase() {
  if (connection === null) {
    connection = await getConnection()
  }

  return connection
}

async function getConnection() {
  const connection: DBConnection = (await mysql.createConnection({
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  })) as DBConnection

  await connection.connect()

  connection.insert = insert

  return connection
}

async function insert(query: string, values?: Any[]) {
  await connection!.execute<Any>(query, values)

  //? Select the last element that was inserted that matches the query-fields and values
  const table = query.split(' ').at(2)
  const fields = query
    .split('(')!
    .at(1)!
    .split(')')[0]
    .split(',')
    .map((f) => f.trim())

  const valueWhereClause = (field: string, value: unknown) => {
    if (typeof value === 'string') {
      return `${field} = '${value}'`
    } else if (value === null) {
      return `${field} IS NULL`
    } else {
      return `${field} = ` + value
    }
  }

  const select_query = `SELECT ${fields.join(', ')} FROM ${table} WHERE ${fields.map((f, i) => valueWhereClause(f, values?.at(i))).join(' AND ')}`
  const [elements] = await connection!.query<Any>(select_query)

  if (elements.length === 0) {
    throw new Error(`Inserted Element was not found! ${select_query}`)
  }

  return elements.at(0)
}
