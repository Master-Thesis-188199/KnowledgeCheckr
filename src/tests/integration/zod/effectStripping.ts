import { describe, expect, it } from '@jest/globals'
import z from 'zod'
import { stripEffects } from '@/src/schemas/utils/stripEffects'

describe('Verify Stripping of effects from schemas', () => {
  it('Verify that effects are properly stripped from objects', () => {
    const schema = z
      .object({
        name: z.string(),
        age: z.number().optional(),
      })
      .transform((obj) => ({
        ...obj,
        name: 'My name has been transformed...',
      }))
      .transform((obj) => ({ ...obj, age: 7 }))

    const dummyData: z.output<typeof schema> = {
      name: 'some name',
      age: 3,
    }

    expect(stripEffects(schema).parse(dummyData).name).toBe(dummyData.name)
    expect(stripEffects(schema).parse(dummyData).age).not.toBe(7)
  })

  it('Verify that effects are properly stripped from arrays', () => {
    const schema = z
      .array(
        z
          .object({
            name: z.string(),
            age: z.number().optional(),
          })
          .transform((obj) => ({
            ...obj,
            name: 'My name has been transformed...',
          }))
          .transform((obj) => ({ ...obj, age: 7 })),
      )
      .min(1, 'Array must have length of one.')
      .default([
        {
          age: 0,
          name: 'Default name',
        },
      ])

    const dummyData: z.output<typeof schema> = [
      {
        name: 'some name',
        age: 3,
      },
    ]

    const stripped = stripEffects(schema)

    expect(stripped.parse(dummyData)[0].name).toBe(dummyData[0].name)
    expect(stripped.parse(dummyData)[0].age).not.toBe(7)
    expect(() => stripped.parse([])).not.toThrow()
    expect(stripped.parse(undefined)).toEqual([{ age: 0, name: 'Default name' }])
  })
})
