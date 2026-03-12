/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { Any } from '@/types'

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
  generateRandomNumbers?: boolean
  overrideArraySize?: number
}
type ResolvedOptions = Readonly<Required<SchemaOptionalProps>>
/**
 * Internal sentinel used to mean "do not materialize this property".
 *
 * This is useful for optional object keys: omitting a key is usually more
 * correct than explicitly assigning `undefined`.
 */

const DEFAULT_OPTIONS: ResolvedOptions = {
  instantiate_Optional_PrimitiveProps: true,
  instantiate_Nullable_PrimitiveProps: true,
  instantiate_Optional_Objects: true,
  instantiate_Nullable_Objects: true,
  stripDefaultValues: false,
  generateRandomNumbers: true,
  overrideArraySize: DEFAULT_ARRAY_SIZE,
}

/**
 * Returns a default values for a given schema.
 * @param schema The schema to generate default values for.
 */
export default function schemaDefaults<Schema extends z.ZodTypeAny>(schema: Schema, userOptions?: SchemaOptionalProps): z.output<Schema> {
  const options = resolveOptions(userOptions)

  const getDef = (s: any) => {
    if (s === undefined) {
      console.warn("Couldn't find schema definition... because schema was undefined...")
      return undefined
    }
    const typeDef = s?._zod?.def ?? s?.def ?? s?._def
    if (typeDef?.type) return typeDef

    if (s.type === 'pipe') {
      return s.in.def
    }
  }
  const getType = (s: any) => {
    const def = getDef(s)
    return def?.type
  }

  const unwrapInner = (s: any) => {
    const def = getDef(s)
    return def?.innerType ?? def?.inner ?? def?.schema
  }

  const asChecks = (s: any): any[] => {
    const def = getDef(s)
    return Array.isArray(def?.checks) ? def.checks : []
  }

  const isUUIDish = (s: any): boolean => {
    const def = getDef(s)

    // some string-format schemas (e.g. z.uuid()) may encode the format on the schema def.
    if (typeof def?.format === 'string' && def.format.toLowerCase() === 'uuid') return true

    // Otherwise go over attached checks
    for (const chk of asChecks(s)) {
      const cdef = chk?._zod?.def ?? chk?.def ?? chk?._def
      if (!cdef) continue

      // Common Zod v4 pattern: string formats are checks with check === "string_format" and format === "uuid".
      if (cdef.check === 'string_format' && typeof cdef.format === 'string' && cdef.format.toLowerCase() === 'uuid') return true

      // fallbacks for custom / transitional shapes.
      if (cdef.check === 'uuid') return true
      if (cdef.kind === 'uuid') return true
    }

    return false
  }

  const type = getType(schema)

  switch (type) {
    case 'default': {
      const def = getDef(schema)
      const dv = def?.defaultValue
      // defaultValue may be a function
      return (typeof dv === 'function' ? dv() : dv) as z.output<Schema>
    }

    case 'object': {
      const def = getDef(schema)
      const shape = (schema as any).shape ?? def?.shape

      // Most commonly: a record of { [key]: schema }
      if (shape && typeof shape === 'object' && !Array.isArray(shape)) {
        return Object.fromEntries(Object.entries(shape).map(([key, value]) => [key, schemaDefaults(value as any, options)])) as z.output<Schema>
      }

      // preemptive fallback: some internal structures may be an array
      if (Array.isArray(shape)) {
        return Object.fromEntries(shape.map((p: any) => [p.key, schemaDefaults(p.value, options)])) as z.output<Schema>
      }

      return {} as z.output<Schema>
    }

    case 'string': {
      let value = ''
      if (options.stripDefaultValues) return value as z.output<Schema>

      if (isUUIDish(schema)) value = getUUID()

      return value as z.output<Schema>
    }

    case 'null':
      return null as z.output<Schema>

    case 'nullable': {
      const inner = unwrapInner(schema)
      const innerType = getType(inner)

      if (innerType === 'object' || innerType === 'array') {
        return (options.instantiate_Nullable_Objects ? schemaDefaults(inner, options) : undefined) as z.output<Schema>
      }

      return (options.instantiate_Nullable_PrimitiveProps ? schemaDefaults(inner, options) : undefined) as z.output<Schema>
    }

    case 'optional': {
      const inner = unwrapInner(schema)
      const innerType = getType(inner)

      if (innerType === 'object' || innerType === 'array') {
        return (options.instantiate_Optional_Objects ? schemaDefaults(inner, options) : undefined) as z.output<Schema>
      }

      return (options.instantiate_Optional_PrimitiveProps ? schemaDefaults(inner, options) : undefined) as z.output<Schema>
    }

    case 'undefined':
    case 'unknown':
    case 'any':
      console.log('unknown schema type...')
      return undefined as z.output<Schema>

    case 'array': {
      const def = getDef(schema)
      const element = (schema as any).element ?? def?.element ?? def?.items
      const len = options.overrideArraySize ?? DEFAULT_ARRAY_SIZE

      const elements = Array.from({ length: len }).map(() => schemaDefaults(element, options))
      return elements as z.output<Schema>
    }

    case 'number': {
      const numberConstraints = {
        min: 0,
        max: 100,
      }

      for (const chk of asChecks(schema)) {
        const cdef = chk?._zod?.def ?? chk?.def ?? chk?._def
        if (!cdef) continue

        if (cdef.check === 'greater_than' && typeof cdef.value === 'number') {
          numberConstraints.min = cdef.value + (cdef.inclusive ? 0 : 1)
        }
        if (cdef.check === 'less_than' && typeof cdef.value === 'number') {
          numberConstraints.max = cdef.value - (cdef.inclusive ? 0 : 1)
        }
      }

      if (!options.generateRandomNumbers) {
        return numberConstraints.min as z.output<Schema>
      }

      const span = Math.abs(numberConstraints.max - numberConstraints.min)
      if (span === 0) return numberConstraints.min as z.output<Schema>

      return Math.floor(((Math.random() * 100) % span) + numberConstraints.min) as unknown as z.output<Schema>
    }

    case 'boolean':
      return false as z.output<Schema>

    case 'catch': {
      const def = getDef(schema)
      const cv = def?.catchValue
      return (typeof cv === 'function' ? cv.call(null, {} as any) : cv) as z.output<Schema>
    }

    case 'transform': {
      const inner = unwrapInner(schema)
      return schemaDefaults(inner, options) as z.output<Schema>
    }

    case 'pipe': {
      const inner = unwrapPipe(schema as Any)
      return schemaDefaults(inner, options) as z.output<Schema>
    }

    case 'union': {
      const def = getDef(schema)
      const optionsArr: any[] = def?.options ?? def?.elements ?? []
      const randomOptionIndex = Math.floor(Math.random() * optionsArr.length)
      return schemaDefaults(optionsArr[randomOptionIndex], options) as z.output<Schema>
    }

    case 'discriminated_union': {
      const def = getDef(schema)
      const optionsArr: any[] = def?.options ?? def?.elements ?? []
      const randomOptionIndex = Math.floor(Math.random() * optionsArr.length)
      return schemaDefaults(optionsArr[randomOptionIndex], options) as z.output<Schema>
    }

    case 'date':
      return new Date() as z.output<Schema>

    case 'literal': {
      const def = getDef(schema)
      return def?.values?.at(0) as z.output<Schema>
    }

    case 'enum': {
      const def = getDef(schema)
      // def.entries holds the enum values as an object e.g. {male: 'male', female: 'female' }
      const values: any[] = (def?.values ?? def?.options ?? def?.entries) ? Object.values(def.entries) : []
      if (values.length === 0) return undefined as z.output<Schema>

      const randomIndex = Math.round((Math.random() * values.length) % (values.length - 1))
      return values[randomIndex] as z.output<Schema>
    }

    case 'tuple': {
      const def = getDef(schema)
      const items: any[] = def?.items ?? def?.prefixItems ?? []
      return items.map((item: any) => schemaDefaults(item, options)) as unknown as z.output<Schema>
    }

    case 'intersection': {
      const def = getDef(schema)
      const left = def?.left
      const right = def?.right
      const leftDefaults = schemaDefaults(left, options)
      const rightDefaults = schemaDefaults(right, options)
      return { ...(leftDefaults as any), ...(rightDefaults as any) } as z.output<Schema>
    }

    // wrappers that can appear during composition
    case 'readonly':
    case 'nonoptional': {
      const inner = unwrapInner(schema)
      return schemaDefaults(inner, options) as z.output<Schema>
    }

    case undefined:
      console.log('type is undefined...', type)
      return undefined as z.output<Schema>

    default:
      console.log(type)
      throw new Error(`[SchemaDefaults]: Unsupported type ${String(type)}`)
  }
}

function unwrapPipe<TSchema extends z.ZodPipe>(pipedSchema: TSchema): TSchema['in'] {
  return pipedSchema.in
}

/**
 * joins custom options with default options into an immutable options object
 * that way default values are not lost when users provide options
 */
function resolveOptions(options: SchemaOptionalProps = {}): ResolvedOptions {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    overrideArraySize: normalizeArraySize(options.overrideArraySize ?? DEFAULT_OPTIONS.overrideArraySize),
  }
}

/**
 * normalize array sizes to a finite, thus non-negative integer.
 */
function normalizeArraySize(size: number): number {
  if (!Number.isFinite(size) || size < 0) return DEFAULT_ARRAY_SIZE
  return Math.floor(size)
}
