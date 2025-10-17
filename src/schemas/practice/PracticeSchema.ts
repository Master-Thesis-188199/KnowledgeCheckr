import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'
import { z } from 'zod'

export const PracticeSchema = z.object({
  question_id: z.string().min(1, 'Question ID is required'),
  answer: z
    .discriminatedUnion('type', [
      z.object({
        type: z.literal('single-choice'),
        //* The identifier of the selected answer [the answer itself]
        selection: z.string().uuid().nonempty('Please select an answer'),
      }),
      z.object({
        type: z.literal('multiple-choice'),
        //* The identifiers of the selected answer [the answer itself]
        selection: z
          .array(
            z
              .string()
              .uuid()
              .or(z.boolean())
              .transform((v) => (v === false ? null : v))
              .nullable(),
          )
          .refine((values) => values.filter((v) => !!v).length > 0, 'Please select at least one answer'),
      }),
      z.object({
        type: z.literal('drag-drop'),
        //* The identifiers of the selected answer [the answer itself]
        input: z.array(z.string()).min(1, 'Please arrange the answers in the correct order'),
      }),
      z.object({
        type: z.literal('open-question'),
        input: z.string().min(1, 'Please provide an answer'),
      }),
    ])
    .optional(),
})

export type PracticeData = z.infer<typeof PracticeSchema>

const { validate: validatePracticeData, instantiate: instantiatePracticeData, safeParse: safeParsePracticeData } = schemaUtilities<PracticeData>(PracticeSchema)
export { instantiatePracticeData, safeParsePracticeData, validatePracticeData }
