/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-explicit-any */
import { z } from 'zod'

type StripOptions = {
  /** Remove only refinements/transforms (effects), or also drop built-in checks like .min/.max/.regex */
  strip?: 'effects-only' | 'all'
  /** Omit these keys from ALL (nested) ZodObject (e.g., ["correctness"]) */
  omitKeys?: readonly string[]
}

type MapTuple<T extends readonly z.ZodTypeAny[]> = { [K in keyof T]: StripEffects<T[K]> }

export type StripEffects<T extends z.ZodTypeAny> =
  T extends z.ZodDefault<infer U extends z.ZodTypeAny>
    ? z.ZodDefault<StripEffects<U>>
    : T extends z.ZodOptional<infer U extends z.ZodTypeAny>
      ? z.ZodOptional<StripEffects<U>>
      : T extends z.ZodNullable<infer U extends z.ZodTypeAny>
        ? z.ZodNullable<StripEffects<U>>
        : T extends z.ZodCatch<infer U extends z.ZodTypeAny>
          ? z.ZodCatch<StripEffects<U>>
          : T extends z.ZodReadonly<infer U extends z.ZodTypeAny>
            ? z.ZodReadonly<StripEffects<U>>
            : T extends z.ZodPipe<infer In, infer Out>
              ? In extends z.ZodTypeAny
                ? StripEffects<In>
                : Out extends z.ZodTypeAny
                  ? StripEffects<Out>
                  : T
              : T extends z.ZodObject<infer Shape extends z.ZodRawShape, infer Config>
                ? z.ZodObject<{ [K in keyof Shape]: Shape[K] extends z.ZodTypeAny ? StripEffects<Shape[K]> : Shape[K] }, Config>
                : T extends z.ZodArray<infer U extends z.ZodTypeAny>
                  ? z.ZodArray<StripEffects<U>>
                  : T extends z.ZodTuple<infer Items>
                    ? Items extends readonly z.ZodTypeAny[]
                      ? z.ZodTuple<MapTuple<Items>>
                      : T
                    : T extends z.ZodUnion<infer Options>
                      ? Options extends readonly z.ZodTypeAny[]
                        ? z.ZodUnion<MapTuple<Options>>
                        : T
                      : T extends z.ZodIntersection<infer A extends z.ZodTypeAny, infer B extends z.ZodTypeAny>
                        ? z.ZodIntersection<StripEffects<A>, StripEffects<B>>
                        : T

export function stripEffects<T extends z.ZodTypeAny>(schema: T, opts: StripOptions = {}): StripEffects<T> {
  const strip = opts.strip ?? 'effects-only'
  const omitSet = new Set(opts.omitKeys ?? [])
  const memo = new WeakMap<z.ZodTypeAny, z.ZodTypeAny>()

  const getDef = (s: any) => s?._zod?.def ?? s?.def ?? s?._def
  const getType = (s: any): string | undefined => {
    const def = getDef(s)
    return typeof def?.type === 'string' ? def.type : undefined
  }
  const unwrapInner = (s: any) => {
    const def = getDef(s)
    return def?.innerType ?? def?.inner ?? def?.schema
  }

  const copyUnknownKeysAndCatchall = (src: any, dest: any) => {
    const def = getDef(src)
    // unknown key policy
    const uk = def?.unknownKeys
    if (uk === 'passthrough' && typeof dest.passthrough === 'function') dest = dest.passthrough()
    if (uk === 'strict' && typeof dest.strict === 'function') dest = dest.strict()

    // catchall
    const catchall = def?.catchall
    if (catchall && getType(catchall) !== 'never' && typeof dest.catchall === 'function') {
      dest = dest.catchall(go(catchall))
    }

    return dest
  }

  const go = (s: z.ZodTypeAny): z.ZodTypeAny => {
    const cached = memo.get(s)
    if (cached) return cached

    const type = getType(s)

    if (type === 'transform') {
      const inner = unwrapInner(s)
      const out = go(inner)
      memo.set(s, out)
      return out
    }

    if (type === 'pipe') {
      const def = getDef(s)
      const input = def?.in ?? def?.input ?? def?.left
      const output = def?.out ?? def?.output ?? def?.right ?? def?.to
      if (input && output && typeof (z as any).pipe === 'function') {
        const out = go(input)
        memo.set(s, out)
        return out
      }

      if (output) {
        const out = go(output)
        memo.set(s, out)
        return out
      }
      const inner = unwrapInner(s)
      const out = go(inner)
      memo.set(s, out)
      return out
    }

    if (type === 'optional') {
      const inner = unwrapInner(s)
      const out = go(inner).optional()
      memo.set(s, out)
      return out
    }

    if (type === 'nullable') {
      const inner = unwrapInner(s)
      const out = go(inner).nullable()
      memo.set(s, out)
      return out
    }

    if (type === 'default') {
      const def = getDef(s)
      const inner = unwrapInner(s)
      const stripped = go(inner)
      const out = stripped.default(def?.defaultValue)
      memo.set(s, out)
      return out
    }

    if (type === 'catch') {
      const def = getDef(s)
      const inner = unwrapInner(s)
      const base = go(inner)
      const out = (base as any).catch(def?.catchValue)
      memo.set(s, out)
      return out
    }

    if (type === 'readonly') {
      const inner = unwrapInner(s)
      const base = go(inner)
      const out = (base as any).readonly()
      memo.set(s, out)
      return out
    }

    if (type === 'object') {
      const def = getDef(s)
      const shape = (s as any).shape ?? def?.shape
      const newShape: Record<string, z.ZodTypeAny> = {}

      if (shape && typeof shape === 'object' && !Array.isArray(shape)) {
        for (const [k, v] of Object.entries(shape)) {
          if (!omitSet.has(k)) newShape[k] = go(v as any)
        }
      } else if (Array.isArray(shape)) {
        for (const p of shape) {
          if (!omitSet.has(p.key)) newShape[p.key] = go(p.value)
        }
      }

      let out: any = z.object(newShape)
      out = copyUnknownKeysAndCatchall(s, out)
      memo.set(s, out)
      return out
    }

    if (type === 'array') {
      const def = getDef(s)
      const element = (s as any).element ?? def?.element ?? def?.items

      if (strip === 'effects-only') {
        const out = z.array(go(element))
        // todo re-apply non-effects like (min, max) note that def.checks includes refinments as `type: 'custom'`
        // for (const check of def?.checks ?? []) out = out.check(check)

        console.warn('Warning stripping all checks and effects from array.')

        memo.set(s, out)
        return out
      }
      const out = z.array(go(element))
      memo.set(s, out)
      return out
    }

    if (type === 'tuple') {
      const def = getDef(s)
      const items = (def?.items ?? def?.prefixItems ?? []) as z.ZodTypeAny[]
      const strippedItems = items.map(go)
      // @ts-ignore - z.tuple wants a tuple type at compile time
      const out = z.tuple(strippedItems)
      memo.set(s, out)
      return out
    }

    if (type === 'union') {
      const def = getDef(s)
      const options = (def?.options ?? def?.elements ?? []) as z.ZodTypeAny[]
      const strippedOptions = options.map(go)
      // @ts-ignore - z.union wants a tuple type at compile time
      const out = z.union(strippedOptions)
      memo.set(s, out)
      return out
    }

    if (type === 'discriminated_union') {
      const def = getDef(s)
      const discriminator = def?.discriminator
      const options = (def?.options ?? def?.elements ?? []) as z.ZodTypeAny[]
      const strippedOptions = options.map(go)
      // Zod requires a tuple in typings; runtime accepts array.
      const out = (z as any).discriminatedUnion(discriminator, strippedOptions)
      memo.set(s, out)
      return out
    }

    if (type === 'intersection') {
      const def = getDef(s)
      const out = z.intersection(go(def?.left), go(def?.right))
      memo.set(s, out)
      return out
    }

    if (type === 'record') {
      const def = getDef(s)
      const key = def?.keyType ?? def?.key
      const value = def?.valueType ?? def?.value
      const out = z.record(go(key) as any, go(value))
      memo.set(s, out)
      return out
    }

    if (type === 'map') {
      const def = getDef(s)
      const out = z.map(go(def?.keyType), go(def?.valueType))
      memo.set(s, out)
      return out
    }

    if (type === 'set') {
      const def = getDef(s)
      const out = z.set(go(def?.valueType))
      memo.set(s, out)
      return out
    }

    if (type === 'lazy') {
      const def = getDef(s)
      const getter = def?.getter ?? def?.get
      const out = z.lazy(() => go(getter()))
      memo.set(s, out)
      return out
    }

    if (type === 'promise') {
      const def = getDef(s)
      const inner = def?.type ?? def?.innerType ?? unwrapInner(s)
      const out = z.promise(go(inner))
      memo.set(s, out)
      return out
    }

    if (type === 'string') {
      const out = strip === 'all' ? z.string() : s
      memo.set(s, out)
      return out
    }
    if (type === 'number') {
      const out = strip === 'all' ? z.number() : s
      memo.set(s, out)
      return out
    }
    if (type === 'bigint') {
      const out = strip === 'all' ? z.bigint() : s
      memo.set(s, out)
      return out
    }
    if (type === 'date') {
      const out = strip === 'all' ? z.date() : s
      memo.set(s, out)
      return out
    }

    if (type === 'boolean') {
      memo.set(s, strip === 'all' ? z.boolean() : s)
      return memo.get(s)!
    }
    if (type === 'any') {
      memo.set(s, z.any())
      return memo.get(s)!
    }
    if (type === 'unknown') {
      memo.set(s, z.unknown())
      return memo.get(s)!
    }
    if (type === 'null') {
      memo.set(s, z.null())
      return memo.get(s)!
    }
    if (type === 'undefined') {
      memo.set(s, z.undefined())
      return memo.get(s)!
    }
    if (type === 'never') {
      memo.set(s, z.never())
      return memo.get(s)!
    }
    if (type === 'void') {
      memo.set(s, z.void())
      return memo.get(s)!
    }

    if (type === 'literal' || type === 'enum' || type === 'native_enum') {
      memo.set(s, s)
      return s
    }

    if (s !== undefined) memo.set(s, s)
    return s
  }

  return go(schema) as any
}
