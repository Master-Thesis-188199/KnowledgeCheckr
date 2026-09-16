import { describe, expect, it } from '@jest/globals'
import z from 'zod'
import schemaDefaults from '@/src/schemas/utils/schemaDefaults'

describe('Basic Schemas Instantiations', () => {
  it('Verify that basic person schema is instantiated correctly', () => {
    const schema = z.object({
      name: z.string().default('some name'),
      hobbies: z.string(),
      age: z.number().min(1),
      degree: z.enum(['bachelor', 'master', 'phd', 'college']).default('college'),
      gender: z.enum(['male', 'female']),
      siblings: z.array(
        z.object({
          name: z.string().default('some name'),
          age: z.number().min(1),
        }),
      ),
    })

    const data = schemaDefaults(schema)

    expect(data.name).toEqual('some name')
    expect(data.hobbies).toEqual('')
    expect(data.age).toBeGreaterThanOrEqual(1)
    expect(data.gender).not.toBeUndefined()
    expect(data.gender === 'male' || data.gender === 'female').toBeTruthy()

    expect(data.siblings.length).toBeGreaterThanOrEqual(1)
    expect(data.siblings.reduce((sum, cur) => (sum += cur.age), 0)).toBeGreaterThanOrEqual(data.siblings.length)
  })

  it('Verify that default schema array size can be overridden', () => {
    const schema = z.array(
      z.object({
        name: z.string().default('some name'),
        age: z.number(),
      }),
    )

    const data = schemaDefaults(schema, { overrideArraySize: 10 })

    expect(data.length).toEqual(10)
    expect(data[0].name).toEqual('some name')
  })

  it('Verify that effects are unwrapped when instantiating schema with effects', () => {
    const schema = z
      .object({
        name: z.string().default('some name'),
        age: z
          .number()
          .default(5)
          .transform((v) => v),
        gender: z.enum(['male', 'female']),
      })
      .transform((person) => ({ ...person, age: person.age * 5 }))

    const data = schemaDefaults(schema)

    expect(data.age).toEqual(5)
    expect(schema.parse(data).age).toEqual(25)
  })
})
