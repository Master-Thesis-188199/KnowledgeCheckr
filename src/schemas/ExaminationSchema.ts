import { StringDate } from '@/src/schemas/CustomZodTypes'
import { KnowledgeCheckSchema } from '@/src/schemas/KnowledgeCheck'
import { QuestionSchema } from '@/src/schemas/QuestionSchema'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'
import { stripEffects } from '@/src/schemas/utils/stripEffects'
import { z } from 'zod'

export const ExaminationSchema = z.object({
  knowledgeCheck: stripEffects(KnowledgeCheckSchema),
  startedAt: StringDate.default(new Date(Date.now())),
  finishedAt: StringDate.nullable().default(null),
  score: z.number().positive().nullable().default(null),
  results: z
    .array(
      z.object({
        question_id: QuestionSchema._def.left.shape.id,
        answer: z.array(
          z.object({
            selected: z.boolean().optional(),
            text: z.string().optional(),
            position: z.number().optional(),
          }),
        ),
      }),
    )
    .default([]),
})

export type ExaminationSchema = z.infer<typeof ExaminationSchema>

const { validate: validateExaminationSchema, instantiate: instantiateExaminationSchema, safeParse: safeParseExaminationSchema } = schemaUtilities<ExaminationSchema>(ExaminationSchema)
export { instantiateExaminationSchema, safeParseExaminationSchema, validateExaminationSchema }
