import { describe, expect, it } from '@jest/globals'
import z from 'zod'
import { getUUID } from '@/src/lib/Shared/getUUID'
import lorem from '@/src/lib/Shared/Lorem'
import { stripZodDefault } from '@/src/schemas/utils/stripZodDefaultValues'

describe('Stripping of zod Default values', () => {
  it('Verify stripping of default-values from basic schema', () => {
    const schema = stripZodDefault(
      z.object({
        name: z.string().default('some name'),
        age: z.number().min(1),
        degree: z.enum(['bachelor', 'master', 'phd', 'college']).default('college'),
      }),
    )

    const dummy: Partial<z.output<typeof schema>> = {
      name: 'some name',
      age: 10,
    }

    // ensure that schema validation fails because `degree` is missing - thus the default value is correctly stripped
    expect(() => schema.parse(dummy)).toThrow(
      new RegExp(
        `Invalid option: expected one of ${Array.from(schema.shape.degree._zod.values)
          .map((enumValue) => `"${String(enumValue)}"`)
          .join('|')}`,
      ),
    )
  })

  it('Verify stripping of default-values from complex schema', () => {
    // #region Cloned complex (Question) schema
    // copied `QuestionSchema` schema that uses intersections, discriminatedUnion, refinements and more
    const AnswerId = z
      .string()
      .uuid('An answer must have an uuid to identify it!')
      .catch(() => getUUID())

    const baseQuestion = z.object({
      id: z.string().uuid(),
      points: z.number().positive(),
      category: z.string().default('general'),

      question: z
        .string()
        .refine((q) => q.split(' ').length > 2, 'Please reformulate your question to be at least 3 words long.')
        .default(
          lorem()
            .substring(0, Math.floor(Math.random() * 100) + 20)
            .split('\n')
            .join(''),
        ),

      //* specifies how / in which environments the question should be displayed to users.
      accessibility: z.enum(['all', 'practice-only', 'exam-only']).default('all').catch('all'),
    })

    const multipleChoiceAnswerSchema = z.object({
      type: z.literal('multiple-choice'),
      answers: z
        .array(
          z.object({
            id: AnswerId,
            answer: z.string().min(1, 'An answer must not be empty!'),
            correct: z.boolean(),
          }),
        )
        .min(1, 'Please provide at least one answer')
        .refine((answers) => answers.find((answer) => answer.correct), { message: 'At least one answer has to be correct!' })
        .default(() => [
          { id: getUUID(), answer: 'Answer 1', correct: false },
          { id: getUUID(), answer: 'Answer 2', correct: true },
          { id: getUUID(), answer: 'Answer 3', correct: true },
          { id: getUUID(), answer: 'Answer 4', correct: false },
        ]),
    })

    const singleChoiceAnswerSchema = z.object({
      type: z.literal('single-choice'),
      answers: z
        .array(
          z.object({
            id: AnswerId,
            answer: z.string(),
            correct: z.boolean(),
          }),
        )
        .min(1, 'Please provide at least one answer')
        .refine((answers) => answers.filter((answer) => answer.correct).length === 1, { message: 'A single-choice question must have *one* correct answer!' })
        .default(() => [
          { id: getUUID(), answer: 'Answer 1', correct: false },
          { id: getUUID(), answer: 'Answer 2', correct: true },
          { id: getUUID(), answer: 'Answer 3', correct: false },
          { id: getUUID(), answer: 'Answer 4', correct: false },
        ]),
    })

    const dragDropAnswerSchema = z.object({
      type: z.literal('drag-drop'),
      answers: z
        .array(
          z.object({
            id: AnswerId,
            answer: z.string(),
            position: z.number().min(0, 'Position must be positive'),
          }),
        )
        .default(() => [
          { id: getUUID(), answer: 'Answer 1', position: 0 },
          { id: getUUID(), answer: 'Answer 2', position: 1 },
          { id: getUUID(), answer: 'Answer 3', position: 2 },
          { id: getUUID(), answer: 'Answer 4', position: 3 },
        ]),
    })

    const openAnswerSchema = z.object({
      type: z.literal('open-question'),
      expectation: z.string().optional(),
    })

    const questionAnswerTypes = z.discriminatedUnion('type', [singleChoiceAnswerSchema, multipleChoiceAnswerSchema, openAnswerSchema, dragDropAnswerSchema])

    const questionSchema = z.intersection(baseQuestion, questionAnswerTypes)
    // #endregion

    const schema = stripZodDefault(questionSchema)

    const dummy: Partial<z.output<typeof schema>> = {
      id: getUUID(),
      type: 'single-choice',
      accessibility: 'all',
      category: 'general',
      points: 4,
      question: 'some dummy question...',
    }

    // ensure that schema validation fails because `answers` is missing - thus the default value is correctly stripped
    expect(() => schema.parse(dummy)).toThrow('Invalid input: expected array, received undefined')
  })
})
