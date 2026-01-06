import { z } from 'zod'

export type DescriptionMap = Record<string, string | undefined>

export type ExtractDescriptionMapOptions = {
  /**
   * How to resolve conflicts when multiple schema branches produce a description for the same path.
   *
   * Examples:
   * - Intersection where both sides define the same property
   * - Union/discriminated union where multiple variants describe the same path
   *
   * "first"  -> keep the first discovered description
   * "last"   -> allow later discoveries to overwrite earlier ones
   *
   * Default: "first"
   */
  prefer?: 'first' | 'last'

  /**
   * Segment used to represent "any index" (arrays/tuples) and "any key" (records).
   * This is designed to match React Hook Form names like `items.0.name` by normalizing indices.
   *
   * Default: "*"
   */
  wildcard?: string
}

const DEFAULT_OPTIONS: Required<ExtractDescriptionMapOptions> = {
  prefer: 'first',
  wildcard: '*',
}

type AnySchema = z.ZodTypeAny

/**
 * Extracts Zod `.describe()` metadata into a flat map keyed by dot-separated paths.
 *
 * The output is RHF-friendly:
 * - Arrays are represented using a wildcard segment (e.g. `items.*.name`)
 * - Records are represented using a wildcard segment (e.g. `attributes.*.label`)
 *
 * Supports:
 * - ZodObject
 * - ZodIntersection
 * - ZodUnion / ZodDiscriminatedUnion
 * - ZodArray / ZodTuple / ZodRecord
 * - Wrapper chains: ZodEffects, Optional, Nullable, Default, Catch, Readonly, Branded
 *
 * Notes:
 * - Descriptions are resolved from the *wrapper chain* (outer → inner), because in real schemas
 *   `.describe()` often lands on wrappers (e.g. `z.string().optional().describe("...")`).
 * - Traversal is done on an unwrapped view to correctly reach structural nodes like `ZodObject.shape`.
 */
export function extractDescriptionMap(schema: AnySchema, options: ExtractDescriptionMapOptions = {}): DescriptionMap {
  const opt = { ...DEFAULT_OPTIONS, ...options }
  const out: DescriptionMap = {}
  walk(schema, '', out, opt)
  return out
}

/**
 * Looks up a description in a DescriptionMap using a React Hook Form name.
 *
 * Behavior:
 * 1) Try exact key match.
 * 2) Normalize bracket notation (`items[0].name` -> `items.0.name`) and try again.
 * 3) Replace numeric segments with wildcard (`items.0.name` -> `items.*.name`) and try again.
 */
export function getDescriptionForRhfName(map: DescriptionMap, rhfName: string, wildcard = '*'): string | undefined {
  if (map[rhfName] !== undefined) return map[rhfName]

  const dotForm = normalizeRhfName(rhfName)
  if (map[dotForm] !== undefined) return map[dotForm]

  const wildcarded = replaceNumericSegments(dotForm, wildcard)
  return map[wildcarded]
}

/* -------------------------------------------------------------------------------------------------
 * Implementation details
 * ------------------------------------------------------------------------------------------------- */

/**
 * Depth-first walk of the schema graph.
 *
 * - Writes description for the current node at `path` (if any).
 * - Traverses children using an unwrapped view for structural correctness.
 */
function walk(schema: AnySchema, path: string, out: DescriptionMap, opt: Required<ExtractDescriptionMapOptions>): void {
  // Description is read from the *outer wrapper chain* (not the unwrapped traversal schema).
  write(out, path, findDescription(schema), opt.prefer)

  const structural = unwrapForTraversal(schema)

  if (structural instanceof z.ZodObject) {
    const shape = structural.shape as Record<string, AnySchema>
    for (const [key, child] of Object.entries(shape)) {
      walk(child, join(path, key), out, opt)
    }
    return
  }

  if (structural instanceof z.ZodIntersection) {
    // Intersections may define properties on either side. We merge both.
    // Order + prefer policy determines which wins on conflicts.
    const leftMap: DescriptionMap = {}
    const rightMap: DescriptionMap = {}

    walk(structural._def.left, path, leftMap, opt)
    walk(structural._def.right, path, rightMap, opt)

    merge(out, leftMap, opt.prefer)
    merge(out, rightMap, opt.prefer)
    return
  }

  if (structural instanceof z.ZodDiscriminatedUnion || structural instanceof z.ZodUnion) {
    const options = (structural._def.options as AnySchema[]) ?? []

    for (const variant of options) {
      const variantMap: DescriptionMap = {}
      walk(variant, path, variantMap, opt)
      merge(out, variantMap, opt.prefer)
    }
    return
  }

  if (structural instanceof z.ZodArray) {
    // Any index: `items.*`
    walk(structural._def.type, join(path, opt.wildcard), out, opt)
    return
  }

  if (structural instanceof z.ZodTuple) {
    // Tuple indices are fixed: `tuple.0`, `tuple.1`, ...
    ;(structural._def.items as AnySchema[]).forEach((item, idx) => {
      walk(item, join(path, String(idx)), out, opt)
    })
    return
  }

  if (structural instanceof z.ZodRecord) {
    // Any key: `record.*`
    walk(structural._def.valueType, join(path, opt.wildcard), out, opt)
    return
  }

  // Non-container leaf schema: nothing to traverse.
}

/**
 * Returns the *first* description found while walking outer → inner across wrapper schemas.
 * This is intentionally separate from traversal unwrapping so we don't lose metadata.
 */
function findDescription(schema: AnySchema): string | undefined {
  const own = readDescription(schema)
  if (own) return own

  if (schema instanceof z.ZodEffects) return findDescription(schema._def.schema)
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) return findDescription(schema.unwrap())
  if (schema instanceof z.ZodDefault) return findDescription(schema._def.innerType)
  if (schema instanceof z.ZodCatch) return findDescription(schema._def.innerType)
  if (schema instanceof z.ZodReadonly) return findDescription(schema._def.innerType)
  if (schema instanceof z.ZodBranded) return findDescription(schema._def.type)

  // Add wrapper types you use here (pipeline, lazy, promise, etc.) if needed.
  return undefined
}

/**
 * Unwraps wrappers solely for structural traversal (to reach objects/arrays/unions/etc.).
 * This intentionally does *not* attempt to preserve descriptions; that's handled by findDescription().
 */
function unwrapForTraversal(schema: AnySchema): AnySchema {
  if (schema instanceof z.ZodEffects) return unwrapForTraversal(schema._def.schema)
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) return unwrapForTraversal(schema.unwrap())
  if (schema instanceof z.ZodDefault) return unwrapForTraversal(schema._def.innerType)
  if (schema instanceof z.ZodCatch) return unwrapForTraversal(schema._def.innerType)
  if (schema instanceof z.ZodReadonly) return unwrapForTraversal(schema._def.innerType)
  if (schema instanceof z.ZodBranded) return unwrapForTraversal(schema._def.type)

  return schema
}

/**
 * Reads the schema's own description in a way that works across Zod versions.
 * Prefer the public `.description` accessor when available, fall back to `_def.description`.
 */
function readDescription(schema: AnySchema): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (schema as any).description ?? (schema as any)?._def?.description
}

function write(out: DescriptionMap, path: string, desc: string | undefined, prefer: 'first' | 'last') {
  if (!path) return

  if (prefer === 'first') {
    if (out[path] === undefined) out[path] = desc
    return
  }

  out[path] = desc
}

function merge(target: DescriptionMap, source: DescriptionMap, prefer: 'first' | 'last') {
  for (const [k, v] of Object.entries(source)) {
    write(target, k, v, prefer)
  }
}

function join(base: string, seg: string): string {
  return base ? `${base}.${seg}` : seg
}

function normalizeRhfName(name: string): string {
  // Convert bracket numeric indices to dot segments: items[0].name -> items.0.name
  return name.replace(/\[(\d+)\]/g, '.$1')
}

function replaceNumericSegments(path: string, wildcard: string): string {
  // Replace `.123` (or leading `123`) segments with wildcard.
  // Examples:
  // - items.0.name -> items.*.name
  // - 0.name -> *.name (rare but handled)
  return path.replace(/(?:^|\.)\d+(?=\.|$)/g, (m) => (m[0] === '.' ? `.${wildcard}` : wildcard))
}
