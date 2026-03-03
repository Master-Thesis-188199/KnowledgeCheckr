/* eslint-disable @typescript-eslint/no-explicit-any */
import z from 'zod'
import { Any } from '@/types'

/**
 * Type-level helper that unwraps ZodDefault recursively and preserves schema structure.
 */
type StripZodDefault<T extends z.ZodTypeAny> =
  // Ensure inferred schema types remain constrained to ZodTypeAny
  T extends z.ZodDefault<infer Inner extends z.ZodTypeAny>
    ? StripZodDefault<Inner>
    : T extends z.ZodObject<infer Shape extends z.ZodRawShape, infer Config>
      ? z.ZodObject<{ [K in keyof Shape]: Shape[K] extends z.ZodTypeAny ? StripZodDefault<Shape[K]> : Shape[K] }, Config>
      : T extends z.ZodArray<infer Element extends z.ZodTypeAny>
        ? z.ZodArray<StripZodDefault<Element>>
        : T extends z.ZodOptional<infer InnerOpt extends z.ZodTypeAny>
          ? z.ZodOptional<StripZodDefault<InnerOpt>>
          : T extends z.ZodNullable<infer InnerNull extends z.ZodTypeAny>
            ? z.ZodNullable<StripZodDefault<InnerNull>>
            : T extends z.ZodUnion<infer Options>
              ? Options extends readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]
                ? z.ZodUnion<MapTuple<Options>>
                : never
              : T extends z.ZodTuple<infer Items>
                ? Items extends readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]
                  ? z.ZodTuple<MapTuple<Items>>
                  : never
                : T extends z.ZodIntersection<infer Left extends z.ZodTypeAny, infer Right extends z.ZodTypeAny>
                  ? z.ZodIntersection<StripZodDefault<Left>, StripZodDefault<Right>>
                  : T extends z.ZodDiscriminatedUnion<infer A, infer B>
                    ? // Some Zod v4 builds use <Discriminator, Options>, others use <Options, Discriminator>
                      B extends string
                      ? A extends readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]
                        ? z.ZodDiscriminatedUnion<MapTuple<A>, B>
                        : z.ZodDiscriminatedUnion<any, B>
                      : T
                    : T

type MapTuple<T extends readonly z.ZodTypeAny[]> = { [K in keyof T]: StripZodDefault<T[K]> }

/**
 * Recursively unwraps ZodDefault<T> and returns a schema with the same shape but without the `.default()` wrapper.
 *
 * @internal
 */
export function stripZodDefault<Schema extends z.ZodTypeAny>(schema: Schema): StripZodDefault<Schema> {
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
  const getType = (s: any): string | undefined => {
    const def = getDef(s)
    return typeof def?.type === 'string' ? def.type : undefined
  }
  const unwrapInner = (s: any) => {
    const def = getDef(s)
    return def?.innerType ?? def?.inner ?? def?.schema
  }

  const type = getType(schema)

  switch (type) {
    case 'default': {
      const inner = unwrapInner(schema)
      return stripZodDefault(inner) as StripZodDefault<Schema>
    }

    case 'object': {
      const def = getDef(schema)
      const shape = (schema as any).shape ?? def?.shape
      const newShape: Record<string, z.ZodTypeAny> = {}

      if (shape && typeof shape === 'object' && !Array.isArray(shape)) {
        for (const key of Object.keys(shape)) {
          newShape[key] = stripZodDefault(shape[key])
        }

        // @ts-expect-error - type 'unknown' for object properties does not align with generic Schema
        return z.object(newShape) as StripZodDefault<Schema>
      }

      // Defensive fallback: some internal shapes can be arrays of { key, value }
      if (Array.isArray(shape)) {
        for (const p of shape) {
          newShape[p.key] = stripZodDefault(p.value)
        }

        // @ts-expect-error - type 'unknown' for object properties does not align with generic Schema
        return z.object(newShape) as StripZodDefault<Schema>
      }

      return z.object({}) as StripZodDefault<Schema>
    }

    case 'array': {
      const def = getDef(schema)
      const element = (schema as any).element ?? def?.element ?? def?.items
      const elementStripped = stripZodDefault(element)
      return z.array(elementStripped) as StripZodDefault<Schema>
    }

    case 'optional': {
      const inner = unwrapInner(schema)
      const strippedInner = stripZodDefault(inner)
      return z.optional(strippedInner) as StripZodDefault<Schema>
    }

    case 'nullable': {
      const inner = unwrapInner(schema)
      const strippedInner = stripZodDefault(inner)
      return z.nullable(strippedInner) as StripZodDefault<Schema>
    }

    case 'union': {
      const def = getDef(schema)
      const options = (def?.options ?? def?.elements) as z.ZodTypeAny[]
      const strippedOptions = options.map((opt) => stripZodDefault(opt))

      // @ts-ignore - z.union expects a tuple type at compile time
      return z.union(strippedOptions) as unknown as StripZodDefault<Schema>
    }

    case 'tuple': {
      const def = getDef(schema)
      const items = (def?.items ?? def?.prefixItems) as z.ZodTypeAny[]
      const strippedItems = items.map((item) => stripZodDefault(item))

      // @ts-ignore - z.tuple expects a tuple type at compile time
      return z.tuple(strippedItems) as unknown as StripZodDefault<Schema>
    }

    case 'literal':
    case 'enum':
      return schema as StripZodDefault<Schema>

    case 'catch': {
      const def = getDef(schema)
      const inner = unwrapInner(schema)
      const strippedInner = stripZodDefault(inner)

      // Preserve catch fallback
      const catchValue = def?.catchValue
      return (strippedInner as any).catch(catchValue) as StripZodDefault<Schema>
    }

    case 'transform': {
      // Unwrap and then reapply the transform/refinement/preprocess
      const inner = unwrapInner(schema)
      const base = stripZodDefault(inner)
      return reapplyEffects(schema as any, base as any) as StripZodDefault<Schema>
    }

    case 'pipe': {
      const def = getDef(schema)
      const out = def?.out ?? def?.output ?? def?.right ?? def?.to

      const inner = unwrapPipe(schema as Any)
      if (!out) return stripZodDefault(inner) as StripZodDefault<Schema>

      return z.pipe(stripZodDefault(inner), stripZodDefault(out)) as unknown as StripZodDefault<Schema>
    }

    case 'intersection': {
      const def = getDef(schema)
      const left = def?.left
      const right = def?.right
      const leftStripped = stripZodDefault(left)
      const rightStripped = stripZodDefault(right)
      return z.intersection(leftStripped, rightStripped) as StripZodDefault<Schema>
    }

    case 'discriminated_union': {
      const def = getDef(schema)
      const discriminator = def?.discriminator
      const options = (def?.options ?? def?.elements) as z.ZodTypeAny[]
      const strippedOptions = options.map((opt) => stripZodDefault(opt))

      return z.discriminatedUnion(discriminator, strippedOptions as any) as unknown as StripZodDefault<Schema>
    }

    case 'readonly': {
      const inner = unwrapInner(schema)
      return stripZodDefault(inner).readonly() as StripZodDefault<Schema>
    }

    case 'nonoptional': {
      const inner = unwrapInner(schema)
      return stripZodDefault(inner).nonoptional() as StripZodDefault<Schema>
    }

    default:
      return schema as StripZodDefault<Schema>
  }
}

/**
 * Re-applies transform/refinement/preprocess effects after unwrapping/stripping.
 */
function reapplyEffects(original: z.ZodTypeAny, base: z.ZodTypeAny): z.ZodTypeAny {
  const def = (original as any)?._zod?.def ?? (original as any)?.def ?? (original as any)?._def

  // in Zod v4 effects are usually stored within `def.effect` for 'transform' wrappers.
  const effect = def?.effect as
    | { type: 'transform'; transform: (arg: unknown, ctx: any) => unknown | Promise<unknown> }
    | { type: 'refinement'; refinement: (arg: unknown, ctx: any) => void | Promise<void> }
    | { type: 'preprocess'; transform: (arg: unknown) => unknown | Promise<unknown> }
    | undefined

  if (!effect) return base

  switch (effect.type) {
    case 'transform':
      return base.transform(effect.transform as any)

    case 'refinement':
      return base.superRefine(effect.refinement as any)

    case 'preprocess':
      return z.preprocess(effect.transform as any, base)

    default:
      return base
  }
}

function unwrapPipe<TSchema extends z.ZodPipe>(pipedSchema: TSchema): TSchema['in'] {
  return pipedSchema.in
}
