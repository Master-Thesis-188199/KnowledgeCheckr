import { z } from 'zod'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

const baseSchema = z.object({
  question_id: z.string().uuid(),
})

const SingleChoiceInputSchema = z.object({
  type: z.literal('single-choice'),
  selection: z.string().uuid().nonempty('Please select an answer'),
})

const MultipleChoiceInputSchema = z.object({
  type: z.literal('multiple-choice'),
  //* The identifiers (answer-id) of the selected answer [the answer itself]
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

const OpenQuestionInputSchema = z.object({
  type: z.literal('open-question'),
  input: z.string().min(1, 'Please provide an answer'),
})

const DragDropInputSchema = z.object({
  type: z.literal('drag-drop'),
  //* The identifiers of the selected answer [the answer itself]
  input: z.array(z.string()).min(1, 'Please arrange the answers in the correct order'),
})

const userInputSchema = z.discriminatedUnion('type', [SingleChoiceInputSchema, MultipleChoiceInputSchema, OpenQuestionInputSchema, DragDropInputSchema])

export const QuestionInputSchema = z.intersection(baseSchema, userInputSchema)

export type QuestionInput = z.infer<typeof QuestionInputSchema>

const { validate: validateQuestionInput, instantiate: instantiateQuestionInput, safeParse: safeParseQuestionInput } = schemaUtilities(QuestionInputSchema)
export { instantiateQuestionInput, safeParseQuestionInput, validateQuestionInput }
