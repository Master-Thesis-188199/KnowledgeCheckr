/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
import { z } from 'zod'

type StripZodDefault<T extends z.ZodTypeAny> =
  T extends z.ZodDefault<infer Inner>
    ? StripZodDefault<Inner>
    : T extends z.ZodObject<infer Shape, infer UnknownKeys, infer Catchall>
      ? z.ZodObject<{ [K in keyof Shape]: StripZodDefault<Shape[K]> }, UnknownKeys, Catchall>
      : T extends z.ZodArray<infer Element, infer ArrayCardinality>
        ? z.ZodArray<StripZodDefault<Element>, ArrayCardinality>
        : T extends z.ZodOptional<infer InnerOpt>
          ? z.ZodOptional<StripZodDefault<InnerOpt>>
          : T extends z.ZodNullable<infer InnerNull>
            ? z.ZodNullable<StripZodDefault<InnerNull>>
            : T extends z.ZodUnion<infer Options>
              ? Options extends readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]
                ? z.ZodUnion<MapTuple<Options>>
                : never
              : T extends z.ZodTuple<infer Items>
                ? Items extends readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]
                  ? z.ZodTuple<MapTuple<Items>>
                  : never
                : T extends z.ZodIntersection<infer Left, infer Right>
                  ? z.ZodIntersection<StripZodDefault<Left>, StripZodDefault<Right>>
                  : T extends z.ZodDiscriminatedUnion<infer Disc, infer Options>
                    ? Options extends readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]
                      ? z.ZodDiscriminatedUnion<Disc, MapTuple<Options>>
                      : never
                    : T

type MapTuple<T extends readonly any[]> = T extends readonly [any, ...any[]] ? { [K in keyof T]: StripZodDefault<T[K]> } : never

/**
 * Recursively unwraps ZodDefault<T> and returns a schema with the same shape but without the `.default()` wrapper.
 * @param schema
 * @internal
 */
export function stripZodDefault<Schema extends z.ZodTypeAny>(schema: Schema): StripZodDefault<Schema> {
  switch (schema._def.typeName) {
    // Unwrap ZodDefault by stripping its inner type.
    case z.ZodFirstPartyTypeKind.ZodDefault: {
      const inner = (schema as unknown as z.ZodDefault<z.ZodTypeAny>)._def.innerType
      return stripZodDefault(inner) as StripZodDefault<Schema>
    }

    // For objects, recursively strip each property.
    case z.ZodFirstPartyTypeKind.ZodObject: {
      const objSchema = schema as unknown as z.ZodObject<any>
      const newShape: Record<string, z.ZodTypeAny> = {}
      for (const key in objSchema.shape) {
        newShape[key] = stripZodDefault(objSchema.shape[key])
      }
      return z.object(newShape) as StripZodDefault<Schema>
    }

    // For arrays, strip the element type.
    case z.ZodFirstPartyTypeKind.ZodArray: {
      const arrSchema = schema as unknown as z.ZodArray<z.ZodTypeAny>
      const elementStripped = stripZodDefault(arrSchema.element)
      return z.array(elementStripped) as StripZodDefault<Schema>
    }

    // For optional types, strip the inner type then reapply optional.
    case z.ZodFirstPartyTypeKind.ZodOptional: {
      const unwrapped = (schema as unknown as z.ZodOptional<z.ZodTypeAny>).unwrap()
      const strippedInner = stripZodDefault(unwrapped)
      return z.optional(strippedInner) as StripZodDefault<Schema>
    }

    // For nullable types, strip the inner type then reapply nullable.
    case z.ZodFirstPartyTypeKind.ZodNullable: {
      const unwrapped = (schema as unknown as z.ZodNullable<z.ZodTypeAny>).unwrap()
      const strippedInner = stripZodDefault(unwrapped)
      return z.nullable(strippedInner) as StripZodDefault<Schema>
    }

    // For unions, strip each option and rebuild the union.
    case z.ZodFirstPartyTypeKind.ZodUnion: {
      const unionSchema = schema as unknown as z.ZodUnion<[z.ZodTypeAny, ...z.ZodTypeAny[]]>
      const strippedOptions = unionSchema._def.options.map((option: z.ZodTypeAny) => stripZodDefault(option))

      // @ts-ignore
      return z.union(strippedOptions) as unknown as StripZodDefault<Schema>
    }

    // For tuples, strip each element and rebuild the tuple.
    case z.ZodFirstPartyTypeKind.ZodTuple: {
      const tupleSchema = schema as unknown as z.ZodTuple<[z.ZodTypeAny, ...z.ZodTypeAny[]]>
      const strippedItems = tupleSchema._def.items.map((item: z.ZodTypeAny) => stripZodDefault(item))

      // @ts-ignore
      return z.tuple(strippedItems) as StripZodDefault<Schema>
    }
    // For literal types, no default wrapper is applied, so just return the schema.
    case z.ZodFirstPartyTypeKind.ZodLiteral: {
      return schema as StripZodDefault<Schema>
    }

    // For enum types, return the schema as-is.
    case z.ZodFirstPartyTypeKind.ZodEnum: {
      return schema as StripZodDefault<Schema>
    }

    // For catch wrappers, remove the catch and use the inner type.
    case z.ZodFirstPartyTypeKind.ZodCatch: {
      const catchSchema = schema as unknown as z.ZodCatch<z.ZodTypeAny>
      const inner = catchSchema._def.innerType
      return stripZodDefault(inner) as StripZodDefault<Schema>
    }

    // For effects wrappers, remove the effects and return the underlying schema.
    case z.ZodFirstPartyTypeKind.ZodEffects: {
      return schema as StripZodDefault<Schema>
      const effectsSchema = schema as unknown as z.ZodEffects<z.ZodTypeAny>
      return stripZodDefault(effectsSchema._def.schema) as StripZodDefault<Schema>
    }

    case z.ZodFirstPartyTypeKind.ZodIntersection: {
      const intersectionSchema = schema as unknown as z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>
      const leftStripped = stripZodDefault(intersectionSchema._def.left)
      const rightStripped = stripZodDefault(intersectionSchema._def.right)
      return z.intersection(leftStripped, rightStripped) as StripZodDefault<Schema>
    }

    // For discriminated unions, strip each option and rebuild the discriminated union.
    case z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion: {
      const discUnion = schema as any // treat as ZodDiscriminatedUnion
      const strippedOptions = discUnion._def.options.map((option: z.ZodTypeAny) => stripZodDefault(option))
      return z.discriminatedUnion(discUnion._def.discriminator, strippedOptions) as unknown as StripZodDefault<Schema>
    }

    // For all other types (primitives, etc.), return the schema unchanged.
    default:
      return schema as StripZodDefault<Schema>
  }
}
