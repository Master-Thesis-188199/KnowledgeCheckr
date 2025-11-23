/* eslint-disable @typescript-eslint/no-explicit-any */
import { z, ZodTypeAny } from 'zod'
import { getUUID } from '@/src/lib/Shared/getUUID'

/**
 * The default size of an array.
 * @internal
 */
export const DEFAULT_ARRAY_SIZE = 5

/**
 * @internal
 */
export interface SchemaOptionalProps {
  instantiate_Optional_PrimitiveProps?: boolean
  instantiate_Nullable_PrimitiveProps?: boolean
  instantiate_Optional_Objects?: boolean
  instantiate_Nullable_Objects?: boolean
  stripDefaultValues?: boolean
  overrideArraySize?: number
}

/**
 * Returns a default values for a given schema.
 * @param schema The schema to generate default values for.
 */
export default function schemaDefaults<Schema extends z.ZodFirstPartySchemaTypes>(
  schema: Schema,
  options: SchemaOptionalProps = { instantiate_Optional_PrimitiveProps: true, instantiate_Optional_Objects: true, instantiate_Nullable_PrimitiveProps: true, instantiate_Nullable_Objects: true },
): z.TypeOf<Schema> {
  if (options.instantiate_Optional_PrimitiveProps === undefined) options.instantiate_Optional_PrimitiveProps = true

  switch (schema._def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodDefault:
      return schema._def.defaultValue()

    case z.ZodFirstPartyTypeKind.ZodObject:
      return Object.fromEntries(Object.entries((schema as z.SomeZodObject).shape).map(([key, value]) => [key, schemaDefaults(value, options)]))

    case z.ZodFirstPartyTypeKind.ZodString:
      const schemaChecks = schema._def.checks

      let value = ''
      if (schemaChecks.some((check: any) => check.kind === 'uuid')) value = getUUID()

      return value

    case z.ZodFirstPartyTypeKind.ZodNull:
      return null

    case z.ZodFirstPartyTypeKind.ZodNullable:
      const strippedNullableSchema = (schema as z.ZodNullable<ZodTypeAny>).unwrap()

      switch (strippedNullableSchema._def.typeName) {
        case z.ZodFirstPartyTypeKind.ZodObject:
          return options.instantiate_Nullable_Objects ? schemaDefaults(strippedNullableSchema, options) : undefined

        case z.ZodFirstPartyTypeKind.ZodArray:
          return options.instantiate_Nullable_Objects ? schemaDefaults(strippedNullableSchema, options) : undefined
      }

      return options.instantiate_Nullable_PrimitiveProps ? schemaDefaults(strippedNullableSchema, options) : undefined

    case z.ZodFirstPartyTypeKind.ZodUndefined:
      return undefined

    case z.ZodFirstPartyTypeKind.ZodUnknown:
      return undefined

    case z.ZodFirstPartyTypeKind.ZodArray: {
      const arraySchema = schema as z.ZodArray<any>
      const elementSchema = arraySchema.element

      const elements = Array.from({ length: options.overrideArraySize ?? DEFAULT_ARRAY_SIZE }).map(() => schemaDefaults(elementSchema, options)) as z.TypeOf<Schema>
      return elements
    }

    case z.ZodFirstPartyTypeKind.ZodOptional:
      const strippedOptionalSchema = (schema as z.ZodOptional<ZodTypeAny>).unwrap()

      switch (strippedOptionalSchema._def.typeName) {
        case z.ZodFirstPartyTypeKind.ZodObject:
          return options.instantiate_Optional_Objects ? schemaDefaults(strippedOptionalSchema, options) : undefined

        case z.ZodFirstPartyTypeKind.ZodArray:
          return options.instantiate_Optional_Objects ? schemaDefaults(strippedOptionalSchema, options) : undefined
      }

      return options.instantiate_Optional_PrimitiveProps ? schemaDefaults(strippedOptionalSchema, options) : undefined

    case z.ZodFirstPartyTypeKind.ZodNumber:
      const checks = schema._def.checks
      const numberConstraints = {
        min: 0,
        max: 100,
      }

      checks.forEach((check: any) => {
        if (check.kind === 'min') numberConstraints.min = check.value + (check.inclusive ? 0 : 1)
        if (check.kind === 'max') numberConstraints.max = check.value - (check.inclusive ? 0 : 1)
      })

      return Math.floor(((Math.random() * 100) % (numberConstraints.max - numberConstraints.min)) + numberConstraints.min) as z.TypeOf<Schema>

    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return false

    case z.ZodFirstPartyTypeKind.ZodAny:
      return undefined

    case z.ZodFirstPartyTypeKind.ZodCatch:
      return schema._def.catchValue.call(null, {} as any)

    case z.ZodFirstPartyTypeKind.ZodEffects:
      return schemaDefaults((schema as any)._def.schema, options)

    case z.ZodFirstPartyTypeKind.ZodUnion: {
      const unionSchema = schema as z.ZodUnion<any>
      const unionOptions = unionSchema._def.options

      const randomOptionIndex = Math.floor(Math.random() * unionOptions.length)
      return schemaDefaults(unionOptions[randomOptionIndex], options)
    }

    case z.ZodFirstPartyTypeKind.ZodDate:
      return new Date()

    case z.ZodFirstPartyTypeKind.ZodLiteral: {
      return schema._def.value
    }

    case z.ZodFirstPartyTypeKind.ZodEnum: {
      const enumSchema = schema as z.ZodEnum<any>
      const enumValues = enumSchema._def.values
      const randomIndex = Math.floor(Math.random() * enumValues.length)
      return enumValues[randomIndex]
    }

    case z.ZodFirstPartyTypeKind.ZodTuple: {
      const tupleSchema = schema as z.ZodTuple<any>
      const tupleItems = tupleSchema._def.items
      return tupleItems.map((item: ZodTypeAny) => schemaDefaults(item, options)) as unknown as z.TypeOf<Schema>
    }

    case z.ZodFirstPartyTypeKind.ZodIntersection: {
      const intersectionSchema = schema as z.ZodIntersection<ZodTypeAny, ZodTypeAny>
      const leftDefaults = schemaDefaults(intersectionSchema._def.left, options)
      const rightDefaults = schemaDefaults(intersectionSchema._def.right, options)
      // Merge the left and right results (right properties override left if overlapping)
      return { ...leftDefaults, ...rightDefaults } as z.TypeOf<Schema>
    }

    case (z.ZodFirstPartyTypeKind as any).ZodDiscriminatedUnion: {
      // The discriminated union internally stores a tuple of options just like a union.
      const discUnion = schema as any // ZodDiscriminatedUnion<any, any>
      const optionsArr = discUnion._def.options
      const randomOptionIndex = Math.floor(Math.random() * optionsArr.length)
      return schemaDefaults(optionsArr[randomOptionIndex], options)
    }

    default:
      throw new Error(`[SchemaDefaults]: Unsupported type ${(schema as any)._def.typeName}`)
  }
}
