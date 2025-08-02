/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  z,
  ZodArray,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodDefault,
  ZodEnum,
  ZodIntersection,
  ZodLiteral,
  ZodMap,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodPipe,
  ZodRecord,
  ZodSet,
  ZodString,
  ZodTransform,
  ZodTypeAny,
  ZodUnion,
} from 'zod'

/**
 * The default size of an array.
 * @internal
 */
export const DEFAULT_ARRAY_SIZE = 5

/**
 * Internal – recursively builds a default value for `schema`.
 */
function _instantiate(schema: ZodTypeAny): unknown {
  // 1. honour explicit .default()
  if (schema instanceof ZodDefault) {
    const v = schema._zod.def.defaultValue
    // defaultValue is either a direct value or a thunk
    return typeof v === 'function' ? (v as () => unknown)() : v
  }

  // 2. primitives
  if (schema instanceof ZodString) return ''
  if (schema instanceof ZodNumber) return 0
  if (schema instanceof ZodBigInt) return BigInt(0)
  if (schema instanceof ZodBoolean) return false
  if (schema instanceof ZodDate) return new Date(Date.now())

  // 3. enums
  if (schema instanceof ZodEnum) return schema.options[0]

  // 4. arrays, sets, maps, tuples
  if (schema instanceof ZodArray) {
    const itemSchema = schema.element

    // @ts-expect-error
    return Array.from({ length: DEFAULT_ARRAY_SIZE }, () => _instantiate(itemSchema))
  }
  if (schema instanceof ZodSet) return new Set()
  if (schema instanceof ZodMap) return new Map()
  // if (schema instanceof ZodTuple) return schema._zod.def.items.map(_instantiate)
  if (schema instanceof ZodIntersection) {
    // @ts-expect-error
    return Object.assign(_instantiate(schema._zod.def.left), _instantiate(schema._zod.def.right))
  }

  if (schema instanceof ZodTransform) {
    // const base = _instantiate(schema._zod.def.type)

    return schema._zod.def.transform('something...', { issues: [{ code: 'invalid_key', input: 'test', issues: [], origin: 'map' }], value: 'invalid-value' })
  }

  // @ts-expect-error
  if (schema instanceof ZodUnion) return _instantiate(schema.options.at((Math.random() * schema.options.length) % schema.options.length))

  // @ts-expect-error
  if (schema instanceof ZodNullable || schema instanceof ZodOptional) return _instantiate(schema._zod.def.innerType)

  if (schema instanceof ZodLiteral) return schema._zod.def.values.at((schema._zod.def.values.length * (Math.random() * 10)) % schema._zod.def.values.length)

  // 5. objects & records
  if (schema instanceof ZodRecord) return {}
  if (schema instanceof ZodObject) {
    const out: Record<string, unknown> = {}
    const shape = schema.shape // getter in v4
    for (const key in shape) {
      out[key] = _instantiate(shape[key])
    }
    return out
  }

  if (schema instanceof ZodPipe) {
    console.log('Pipe output ->', schema._zod.def.out)

    // @ts-expect-error
    return _instantiate(schema._zod.def.out)
  }

  // 10. Anything we do not recognise → undefined

  console.warn('schemaDefaults: unknown Zod type, returning undefined:', schema)

  return undefined
}

/**
 * Returns a default values for a given schema.
 * @param schema The schema to generate default values for.
 */
export default function schemaDefaults<Schema extends z.ZodObject>(schema: Schema): z.TypeOf<Schema> {
  return _instantiate(schema) as z.infer<Schema>
}
