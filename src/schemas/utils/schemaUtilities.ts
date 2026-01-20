/* eslint-disable @typescript-eslint/no-explicit-any */
import { SafeParseReturnType, z } from 'zod'
import schemaDefaults, { SchemaOptionalProps } from '@/schemas/utils/schemaDefaults'
import { stripZodDefault } from '@/schemas/utils/stripZodDefaultValues'

/**
 * A hook that provides utility functions for working with zod schemas
 * @param schema - The schema used by the utility functions that are exposed by this hook
 * @returns An object containing utility functions: getDummy, validate and safeParse based on the given schema
 * @internal
 */
export function schemaUtilities<Schema extends z.ZodTypeAny>(schema: Schema) {
  /**
   * Validates a given object against a given schema. Throws an error if the object is invalid
   * @param object - The object to be validated
   */
  const validate = (object: any): z.infer<Schema> | never => stripZodDefault(schema).parse(object)

  /**
   * Returns a dummy object based on a given schema
   * @param options - Defines how optional properties should be handled in terms of their instantiation (undefined / value)
   */
  function instantiate(options?: SchemaOptionalProps): z.infer<Schema> {
    return schemaDefaults(options?.stripDefaultValues ? stripZodDefault(schema) : schema, options)
  }

  /**
   * Safely parses an object against its schema and returns the result of the zod.safeParse method
   * @param object - The object to be parsed / validated
   */
  const safeParse = (object: any): z.SafeParseReturnType<any, z.infer<Schema>> => stripZodDefault(schema).safeParse(object) as SafeParseReturnType<any, z.infer<Schema>>

  return {
    instantiate,
    validate,
    safeParse,
  }
}
