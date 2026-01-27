import { z } from 'zod'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

const baseSchema = z.object({
  question_id: z.string().uuid(),
})

const SingleChoiceAnswerSchema = z.object({
  type: z.literal('single-choice'),
  selection: z.string().uuid().nonempty('Please select an answer'),
})

const MultipleChoiceAnswerSchema = z.object({
  type: z.literal('multiple-choice'),
  //* The identifiers of the selected answer [the answer itself]
  selection: z
    .array(
      z
        .string()
        .uuid()
        .or(z.literal(false))
        .optional()
        .transform((v) => (v === false || v === undefined ? null : v))
        .nullable(),
    )
    .refine((values) => values.filter((v) => !!v).length > 0, 'Please select at least one answer'),
})

const OpenQuestionAnswerSchema = z.object({
  type: z.literal('open-question'),
  input: z.string().min(1, 'Please provide an answer'),
})

const DragDropAnswerSchema = z.object({
  type: z.literal('drag-drop'),
  //* The identifiers of the selected answer [the answer itself]
  input: z.array(z.string()).min(1, 'Please arrange the answers in the correct order'),
})

const answerOptionsSchema = z.discriminatedUnion('type', [SingleChoiceAnswerSchema, MultipleChoiceAnswerSchema, OpenQuestionAnswerSchema, DragDropAnswerSchema])

export const PracticeSchema = z.intersection(baseSchema, answerOptionsSchema)

export type PracticeData = z.infer<typeof PracticeSchema>

const { validate: validatePracticeData, instantiate: instantiatePracticeData, safeParse: safeParsePracticeData } = schemaUtilities(PracticeSchema)
export { instantiatePracticeData, safeParsePracticeData, validatePracticeData }
