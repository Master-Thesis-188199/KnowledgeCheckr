/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as z from 'zod'
import { Any } from '@/types'

type StripOptions = {
  /** Remove only refinements/transforms (effects), or also drop built-in checks like .min/.max/.regex */
  strip?: 'effects-only' | 'all'
  /** Omit these keys from ALL ZodObject shapes (e.g., ["correctness"]) */
  omitKeys?: readonly string[]
}

export type StripEffects<T extends z.ZodTypeAny, OmitKeys extends readonly PropertyKey[] = [], Mode extends 'effects-only' | 'all' = 'effects-only'> =
  // Unwrap effects
  T extends z.ZodEffects<infer U, Any, Any>
    ? StripEffects<U, OmitKeys, Mode>
    : // Preserve wrappers, relax inner
      T extends z.ZodOptional<infer U>
      ? z.ZodOptional<StripEffects<U, OmitKeys, Mode>>
      : T extends z.ZodNullable<infer U>
        ? z.ZodNullable<StripEffects<U, OmitKeys, Mode>>
        : T extends z.ZodDefault<infer U>
          ? z.ZodDefault<StripEffects<U, OmitKeys, Mode>>
          : T extends z.ZodCatch<infer U>
            ? z.ZodCatch<StripEffects<U, OmitKeys, Mode>>
            : T extends z.ZodReadonly<infer U>
              ? z.ZodReadonly<StripEffects<U, OmitKeys, Mode>>
              : // Objects (omit keys + recurse)
                T extends z.ZodObject<infer Shape, infer UnknownKeys, infer Catchall, Any, Any>
                ? z.ZodObject<
                    {
                      [K in keyof Shape as K extends OmitKeys[number] ? never : K]: Shape[K] extends z.ZodTypeAny ? StripEffects<Shape[K], OmitKeys, Mode> : Shape[K]
                    },
                    UnknownKeys,
                    Catchall extends z.ZodTypeAny ? StripEffects<Catchall, OmitKeys, Mode> : Catchall
                  >
                : // Arrays / Tuples
                  T extends z.ZodArray<infer U, infer Card>
                  ? z.ZodArray<StripEffects<U, OmitKeys, Mode>, Card>
                  : T extends z.ZodTuple<infer Items, infer Rest>
                    ? z.ZodTuple<
                        //@ts-expect-error
                        { [I in keyof Items]: Items[I] extends z.ZodTypeAny ? StripEffects<Items[I], OmitKeys, Mode> : Items[I] },
                        Rest extends z.ZodTypeAny ? StripEffects<Rest, OmitKeys, Mode> : Rest
                      >
                    : // Records / Maps / Sets
                      T extends z.ZodRecord<infer K, infer V>
                      ? //@ts-expect-error
                        z.ZodRecord<StripEffects<K, OmitKeys, Mode>, StripEffects<V, OmitKeys, Mode>>
                      : T extends z.ZodMap<infer K, infer V>
                        ? z.ZodMap<StripEffects<K, OmitKeys, Mode>, StripEffects<V, OmitKeys, Mode>>
                        : T extends z.ZodSet<infer V>
                          ? z.ZodSet<StripEffects<V, OmitKeys, Mode>>
                          : // Unions / Discriminated unions / Intersections
                            T extends z.ZodUnion<infer Options>
                            ? z.ZodUnion<{ [I in keyof Options]: Options[I] extends z.ZodTypeAny ? StripEffects<Options[I], OmitKeys, Mode> : Options[I] }>
                            : T extends z.ZodDiscriminatedUnion<infer Disc, infer Options>
                              ? //@ts-expect-error
                                z.ZodDiscriminatedUnion<Disc, { [I in keyof Options]: Options[I] extends z.ZodTypeAny ? StripEffects<Options[I], OmitKeys, Mode> : Options[I] }>
                              : T extends z.ZodIntersection<infer A, infer B>
                                ? z.ZodIntersection<StripEffects<A, OmitKeys, Mode>, StripEffects<B, OmitKeys, Mode>>
                                : // Lazy / Promise / Pipeline
                                  T extends z.ZodLazy<infer U>
                                  ? z.ZodLazy<StripEffects<U, OmitKeys, Mode>>
                                  : T extends z.ZodPromise<infer U>
                                    ? z.ZodPromise<StripEffects<U, OmitKeys, Mode>>
                                    : T extends z.ZodPipeline<infer In, infer Out>
                                      ? z.ZodPipeline<StripEffects<In, OmitKeys, Mode>, StripEffects<Out, OmitKeys, Mode>>
                                      : // Literals / Enums
                                        T extends z.ZodLiteral<infer V>
                                        ? z.ZodLiteral<V>
                                        : T extends z.ZodEnum<infer Values>
                                          ? z.ZodEnum<Values>
                                          : T extends z.ZodNativeEnum<infer E>
                                            ? z.ZodNativeEnum<E>
                                            : // Branding (kept, since your runtime doesn't strip it)
                                              T extends z.ZodBranded<infer U, infer B>
                                              ? z.ZodBranded<StripEffects<U, OmitKeys, Mode>, B>
                                              : // Primitives & other structure-only nodes — unchanged
                                                T

export function stripEffects<T extends z.ZodTypeAny, OmitKeys extends readonly PropertyKey[] = [], Mode extends 'effects-only' | 'all' = 'effects-only'>(
  schema: T,
  opts: StripOptions = {},
): StripEffects<T, OmitKeys, Mode> {
  const strip = opts.strip ?? 'effects-only'
  const omitSet = new Set(opts.omitKeys ?? [])
  const memo = new WeakMap<z.ZodTypeAny, z.ZodTypeAny>()

  const isV4 = (s: Any) => s && typeof s === 'object' && '_zod' in s
  if (isV4(schema)) {
    throw new Error('stripEffects: This utility expects Zod v3 schemas. You passed a v4 schema.')
  }

  const go = (s: z.ZodTypeAny): z.ZodTypeAny => {
    if (memo.has(s)) return memo.get(s)!

    // Effects (refine/superRefine/transform/preprocess) — unwrap
    if (s instanceof (z as Any).ZodEffects) {
      const inner = (s as Any)._def.schema as z.ZodTypeAny
      const out = go(inner)
      memo.set(s, out)
      return out
    }

    // Optional / Nullable / Default / Catch / Readonly wrappers — preserve wrapper, relax inner
    if (s instanceof z.ZodOptional) {
      const out = go((s as Any)._def.innerType).optional()
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodNullable) {
      const out = go((s as Any)._def.innerType).nullable()
      memo.set(s, out)
      return out
    }
    if ((z as Any).ZodDefault && s instanceof (z as Any).ZodDefault) {
      const def = (s as Any)._def
      const out = (go(def.innerType) as Any).default(def.defaultValue())
      memo.set(s, out)
      return out
    }
    if ((z as Any).ZodCatch && s instanceof (z as Any).ZodCatch) {
      const out = (go((s as Any)._def.innerType) as Any).catch((s as Any)._def.catchValue)
      memo.set(s, out)
      return out
    }
    if ((z as Any).ZodReadonly && s instanceof (z as Any).ZodReadonly) {
      const out = (go((s as Any)._def.innerType) as Any).readonly()
      memo.set(s, out)
      return out
    }

    // Objects
    if (s instanceof z.ZodObject) {
      const shape: Record<string, z.ZodTypeAny> = {}
      for (const [k, v] of Object.entries((s as Any).shape)) {
        if (!omitSet.has(k)) shape[k] = go(v as z.ZodTypeAny)
      }
      let obj = z.object(shape)

      // Preserve unknown key policy & catchall
      const def = (s as Any)._def
      //@ts-expect-error
      if (def.unknownKeys === 'passthrough') obj = obj.passthrough()
      //@ts-expect-error
      if (def.unknownKeys === 'strict') obj = obj.strict()
      if (def.catchall && !(def.catchall instanceof z.ZodNever)) {
        obj = obj.catchall(go(def.catchall))
      }
      memo.set(s, obj)
      return obj
    }

    // Arrays (drop min/max/length by recreating clean array)
    if (s instanceof z.ZodArray) {
      const out = z.array(go((s as Any)._def.type))
      memo.set(s, out)
      return out
    }

    // Tuples
    if (s instanceof z.ZodTuple) {
      const def = (s as Any)._def
      const items = (def.items as z.ZodTypeAny[]).map(go)
      let out = z.tuple(items as Any)
      if (def.rest) out = (out as Any).rest(go(def.rest))
      memo.set(s, out)
      return out
    }

    // Records / Maps / Sets
    if (s instanceof z.ZodRecord) {
      const def = (s as Any)._def
      const out = z.record(go(def.keyType) as Any, go(def.valueType))
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodMap) {
      const def = (s as Any)._def
      const out = z.map(go(def.keyType), go(def.valueType))
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodSet) {
      const out = z.set(go((s as Any)._def.valueType))
      memo.set(s, out)
      return out
    }

    // Unions / Discriminated unions / Intersections
    if (s instanceof z.ZodUnion) {
      const out = z.union(((s as Any)._def.options as z.ZodTypeAny[]).map(go) as Any)
      memo.set(s, out)
      return out
    }
    if ((z as Any).ZodDiscriminatedUnion && s instanceof (z as Any).ZodDiscriminatedUnion) {
      const def = (s as Any)._def
      const out = (z as Any).discriminatedUnion(def.discriminator, def.options.map(go))
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodIntersection) {
      const def = (s as Any)._def
      const out = z.intersection(go(def.left), go(def.right))
      memo.set(s, out)
      return out
    }

    // Lazy / Promise / Pipeline (.pipe)
    if (s instanceof z.ZodLazy) {
      const out = z.lazy(() => go((s as Any)._def.getter()))
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodPromise) {
      const out = z.promise(go((s as Any)._def.type))
      memo.set(s, out)
      return out
    }
    if ((z as Any).ZodPipeline && s instanceof (z as Any).ZodPipeline) {
      const def = (s as Any)._def
      const out = (z as Any).ZodPipeline.create({ in: go(def.in), out: go(def.out) })
      memo.set(s, out)
      return out
    }

    // Literals / Enums
    if (s instanceof z.ZodLiteral) {
      const out = z.literal((s as Any)._def.value)
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodEnum) {
      const vals = [...(s as Any)._def.values] as [string, ...string[]]
      const out = z.enum(vals)
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodNativeEnum) {
      const out = z.nativeEnum((s as Any)._def.values)
      memo.set(s, out)
      return out
    }

    // Primitives (drop built-in checks only when strip === "all")
    if (s instanceof z.ZodString) {
      const out = strip === 'all' ? z.string() : s
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodNumber) {
      const out = strip === 'all' ? z.number() : s
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodBigInt) {
      const out = strip === 'all' ? z.bigint() : s
      memo.set(s, out)
      return out
    }
    if (s instanceof z.ZodDate) {
      const out = strip === 'all' ? z.date() : s
      memo.set(s, out)
      return out
    }

    // “Structure-only” primitives — safe to return as-is
    if (s instanceof z.ZodBoolean || s instanceof z.ZodAny || s instanceof z.ZodUnknown || s instanceof z.ZodNever || s instanceof z.ZodVoid || s instanceof z.ZodNull || s instanceof z.ZodUndefined) {
      memo.set(s, s)
      return s
    }

    memo.set(s, s)
    return s
  }

  return go(schema) as Any
}
