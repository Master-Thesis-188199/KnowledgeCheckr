/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
import { z } from 'zod'

type StripZodDefault<T> = T

/**
 * Recursively unwraps ZodDefault<T> and returns a schema with the same shape but without the `.default()` wrapper.
 * @param schema
 * @internal
 */
export function stripZodDefault<Schema extends z.ZodTypeAny>(schema: Schema): Schema {
  switch (schema._zod.def.type) {
    // Unwrap ZodDefault by stripping its inner type.
    case 'default': {
      const inner = (schema as unknown as z.ZodDefault<z.ZodTypeAny>).def.innerType
      return stripZodDefault(inner) as StripZodDefault<Schema>
    }

    // For objects, recursively strip each property.
    case 'object': {
      const objSchema = schema as unknown as z.ZodObject<any>
      const newShape: Record<string, z.ZodTypeAny> = {}
      for (const key in objSchema.shape) {
        newShape[key] = stripZodDefault(objSchema.shape[key])
      }
      return z.object(newShape) as unknown as StripZodDefault<Schema>
    }

    // For arrays, strip the element type.
    case 'array': {
      const arrSchema = schema as unknown as z.ZodArray<z.ZodTypeAny>
      const elementStripped = stripZodDefault(arrSchema.element)
      return z.array(elementStripped) as unknown as StripZodDefault<Schema>
    }

    // For optional types, strip the inner type then reapply optional.
    case 'optional': {
      const unwrapped = (schema as unknown as z.ZodOptional<z.ZodTypeAny>).unwrap()
      const strippedInner = stripZodDefault(unwrapped)
      return z.optional(strippedInner) as unknown as StripZodDefault<Schema>
    }

    // For nullable types, strip the inner type then reapply nullable.
    case 'nullable': {
      const unwrapped = (schema as unknown as z.ZodNullable<z.ZodTypeAny>).unwrap()
      const strippedInner = stripZodDefault(unwrapped)
      return z.nullable(strippedInner) as unknown as StripZodDefault<Schema>
    }

    // For unions, strip each option and rebuild the union.
    case 'union': {
      const unionSchema = schema as unknown as z.ZodUnion<[z.ZodTypeAny, ...z.ZodTypeAny[]]>
      const strippedOptions = unionSchema._zod.def.options.map((option: z.ZodTypeAny) => stripZodDefault(option))

      // @ts-ignore
      return z.union(strippedOptions) as unknown as StripZodDefault<Schema>
    }

    // For tuples, strip each element and rebuild the tuple.
    case 'tuple': {
      const tupleSchema = schema as unknown as z.ZodTuple<[z.ZodTypeAny, ...z.ZodTypeAny[]]>
      const strippedItems = tupleSchema._zod.def.items.map((item: z.ZodTypeAny) => stripZodDefault(item))

      // @ts-ignore
      return z.tuple(strippedItems) as StripZodDefault<Schema>
    }
    // For literal types, no default wrapper is applied, so just return the schema.
    case 'literal': {
      return schema as StripZodDefault<Schema>
    }

    // For enum types, return the schema as-is.
    case 'enum': {
      return schema as StripZodDefault<Schema>
    }

    // For catch wrappers, remove the catch and use the inner type.
    case 'catch': {
      const catchSchema = schema as unknown as z.ZodCatch<z.ZodTypeAny>
      const inner = catchSchema._def.innerType
      return stripZodDefault(inner) as StripZodDefault<Schema>
    }

    // For effects wrappers, remove the effects and return the underlying schema.
    // case z.ZodFirstPartyTypeKind.ZodEffects: {
    //   return schema as StripZodDefault<Schema>
    //   const effectsSchema = schema as unknown as z.ZodEffects<z.ZodTypeAny>
    //   return stripZodDefault(effectsSchema._def.schema) as StripZodDefault<Schema>
    // }

    case 'intersection': {
      const intersectionSchema = schema as unknown as z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>
      const leftStripped = stripZodDefault(intersectionSchema._zod.def.left)
      const rightStripped = stripZodDefault(intersectionSchema._zod.def.right)
      return z.intersection(leftStripped, rightStripped) as unknown as StripZodDefault<Schema>
    }

    // For all other types (primitives, etc.), return the schema unchanged.
    default:
      return schema as StripZodDefault<Schema>
  }
}
