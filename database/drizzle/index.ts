import * as drizzleRelations from '@/database/drizzle/relations'
import * as drizzleSchema from '@/database/drizzle/schema'
export type DrizzleSchema = typeof drizzleSchema & typeof drizzleRelations

export * from './schema'
export * from './relations'
