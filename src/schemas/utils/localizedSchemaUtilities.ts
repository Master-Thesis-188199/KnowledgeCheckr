import { z } from 'zod'
import schemaDefaults, { SchemaOptionalProps } from '@/schemas/utils/schemaDefaults'
import { stripZodDefault } from '@/schemas/utils/stripZodDefaultValues'
import { Translator } from '@/src/i18n/locales/types'
import { Any } from '@/types'

/**
 * A hook that provides utility functions for working with zod schemas
 * @param getterFunction - The function used to localize a given schema used by the utility functions that are exposed by this hook
 * @returns An object containing utility functions: instantiate, validate and safeParse based on the given schema
 * @internal
 */
export function localizedSchemaUtilities<Schema extends z.ZodTypeAny>(getterFunction: (t: Translator) => Schema) {
  /**
   * Validates a given object against a given schema. Throws an error if the object is invalid
   * @param object - The object to be validated
   */
  const validate = (translator: Translator, object: z.output<Schema> | Partial<z.output<Schema>> | Any): z.output<Schema> | never => stripZodDefault(getterFunction(translator)).parse(object)

  /**
   * Returns a dummy object based on a given schema
   * @param options - Defines how optional properties should be handled in terms of their instantiation (undefined / value)
   */
  function instantiate(translator: Translator, options?: SchemaOptionalProps & { validate?: boolean }): z.output<Schema> {
    const schema = getterFunction(translator)
    const dummyData = schemaDefaults(options?.stripDefaultValues ? stripZodDefault(schema) : schema, options) as z.output<Schema>

    //* ensure that generated dummy data satisfies with schema constraints
    return options?.validate ? validate(translator, dummyData) : dummyData
  }

  /**
   * Safely parses an object against its schema and returns the result of the zod.safeParse method
   * @param object - The object to be parsed / validated
   */
  const safeParse = (translator: Translator, object: z.output<Schema> | Partial<z.output<Schema>> | Any): z.ZodSafeParseResult<z.output<Schema>> =>
    stripZodDefault(getterFunction(translator)).safeParse(object)

  return {
    instantiate,
    validate,
    safeParse,
  }
}
