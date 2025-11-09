import { Any } from '@/types'

/**
 * Removes the 'Partial<T>' utilty type from a given type. While required does the same thing, the IDE tends to display Required<Partial<T>> instead making types harder to read.
 */
export type UndoPartial<T> = T extends Partial<infer R> ? R : T

/**
 * When properties from a discriminatedUnion type are to be removed 'Omit<T>' won't work as expected.
 * This is because Omit is not distributive over unions, so it doesn’t operate on each union member separately.
 * Instead, it produces a single object type whose visible keys are those that “work” across the union.
 *
 * This means that when there is a type `{base: boolean} & {type: "A", correct: string} | {type: "B", input: string}`,
 * then using `Omit<T>` to exclude the `base` prop will not work, thus when applied the resulting type would be a union of
 * the available types: `{type: 'A' | 'B' ... }. This means the discriminatedUnion props are not retrieved.
 *
 * By using the `DistributiveOmit` utility type we can remove said base properties from a union-object as expected to get `{ type: 'A', correct: string} | {type: 'B': input: string}` in this example.
 */
export type DistributiveOmit<T, K extends PropertyKey> = T extends Any ? Omit<T, K> : never
