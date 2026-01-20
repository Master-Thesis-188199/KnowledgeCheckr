import { z, ZodIssueCode } from 'zod'
import { schemaUtilities } from '@/schemas/utils/schemaUtilities'
import { getUUID } from '@/src/lib/Shared/getUUID'
import lorem from '@/src/lib/Shared/Lorem'
import identifyDuplicateFields from '@/src/schemas/utils/refinements/IdentifyDuplicateFields'

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

/**
 * Ensures that the `answers` have unique names and ids, otherwise location / property based issues are created.
 * @param answers The array of answers provided by the `superRefine` operrand.
 * @param ctx The superRefine context to create issues with.
 */
const uniqueAnswerConstraints = (answers: Array<{ answer: string; id: string }>, ctx: z.RefinementCtx) => {
  identifyDuplicateFields(answers, ctx, {
    field: 'answer',
    key: (a) => a.answer,
    normalizeKey: (s) => s.trim().toLowerCase(),
    message: (dup) => `Answers must be unique. Duplicate: "${dup}"`,
    mark: 'both',
  })

  identifyDuplicateFields(answers, ctx, {
    field: 'id',
    key: (a) => a.id,
    message: (dup) => `Answer-ids must be unique. Duplicate id: "${dup}"`,
    mark: 'both',
  })
}

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
    .superRefine(uniqueAnswerConstraints)
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
    .superRefine(uniqueAnswerConstraints)
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
    .superRefine((answers, ctx) => {
      const n = answers.length
      const seen = new Set<number>()
      const minPos = Math.min(...answers.map((a) => a.position))

      if (minPos !== 0) {
        ctx.addIssue({
          code: ZodIssueCode.too_small,
          minimum: 0,
          type: 'number',
          inclusive: true,
          message: `[drag-drop] positions must begin from 0; received: ${minPos} `,
          path: [answers.findIndex((a) => a.position === minPos), 'position'],
        })
        return
      }

      answers.forEach((answer, i) => {
        if (seen.has(answer.position)) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: `[drag-drop] duplicate position: ${answer.position}`,
            path: [i, 'position'],
          })
        }
        seen.add(answer.position)
      })

      //* Identify gaps in continuous range of positions
      for (let pos = 0; pos <= n - 1; pos++) {
        if (!seen.has(pos)) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: `[drag-drop] positions must form a continuous range: [0...${n - 1}]; received: [${answers.map((a) => a.position).join(', ')}]. Position ${pos} is missing!`,
          })

          break
        }
      }
    })
    .superRefine(uniqueAnswerConstraints)
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

export const QuestionSchema = z.intersection(baseQuestion, questionAnswerTypes)

export type Question = z.infer<typeof QuestionSchema>

const { validate: validateQuestion, instantiate: instantiateQuestion, safeParse: safeParseQuestion } = schemaUtilities(QuestionSchema)
export { instantiateQuestion, safeParseQuestion, validateQuestion }

export type ChoiceQuestion = Extract<Question, { type: 'single-choice' | 'multiple-choice' }>
export type SingleChoice = Extract<Question, { type: 'single-choice' }>
const { validate: validateSingleChoice, instantiate: instantiateSingleChoice, safeParse: safeParseSingleChoice } = schemaUtilities(z.intersection(baseQuestion, singleChoiceAnswerSchema))
export { instantiateSingleChoice, safeParseSingleChoice, validateSingleChoice }

export type MultipleChoice = Extract<Question, { type: 'multiple-choice' }>
const { validate: validateMultipleChoice, instantiate: instantiateMultipleChoice, safeParse: safeParseMultipleChoice } = schemaUtilities(z.intersection(baseQuestion, multipleChoiceAnswerSchema))
export { instantiateMultipleChoice, safeParseMultipleChoice, validateMultipleChoice }

export type OpenQuestion = Extract<Question, { type: 'open-question' }>
const { validate: validateOpenQuestion, instantiate: instantiateOpenQuestion, safeParse: safeParseOpenQuestion } = schemaUtilities(z.intersection(baseQuestion, openAnswerSchema))
export { instantiateOpenQuestion, safeParseOpenQuestion, validateOpenQuestion }

export type DragDropQuestion = Extract<Question, { type: 'drag-drop' }>
const { validate: validateDragDropQuestion, instantiate: instantiateDragDropQuestion, safeParse: safeParseDragDropQuestion } = schemaUtilities(z.intersection(baseQuestion, dragDropAnswerSchema))
export { instantiateDragDropQuestion, safeParseDragDropQuestion, validateDragDropQuestion }
