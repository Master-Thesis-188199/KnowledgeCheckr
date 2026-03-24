import { z } from 'zod'
import { Translator } from '@/src/i18n/locales/types'
import { localizedSchemaUtilities } from '@/src/schemas/utils/localizedSchemaUtilities'

const getBaseSchema = (t: Translator) =>
  z.object({
    question_id: z.uuidv4(),
  })

const getSingleChoiceInputSchema = (t: Translator) =>
  z.object({
    type: z.literal('single-choice'),
    selection: z.uuidv4().nonempty('Please select an answer'),
  })

const getMultipleChoiceInputSchema = (t: Translator) =>
  z.object({
    type: z.literal('multiple-choice'),
    //* The identifiers (answer-id) of the selected answer [the answer itself]
    selection: z
      .array(
        z
          .uuidv4()
          .or(z.literal(false))
          .optional()
          .transform((v) => (v === false || v === undefined ? null : v))
          .nullable(),
      )
      .refine((values) => values.filter((v) => !!v).length > 0, 'Please select at least one answer'),
  })

const getOpenQuestionInputSchema = (t: Translator) =>
  z.object({
    type: z.literal('open-question'),
    input: z.string().min(1, 'Please provide an answer'),
  })

const getDragDropInputSchema = (t: Translator) =>
  z.object({
    type: z.literal('drag-drop'),
    //* The identifiers of the selected answer [the answer itself]
    input: z.array(z.string()).min(1, 'Please arrange the answers in the correct order'),
  })

const getUserInputSchemaTypes = (t: Translator) =>
  z.discriminatedUnion('type', [getSingleChoiceInputSchema(t), getMultipleChoiceInputSchema(t), getOpenQuestionInputSchema(t), getDragDropInputSchema(t)])

export function getQuestionInputSchema(t: Translator) {
  return z.intersection(getBaseSchema(t), getUserInputSchemaTypes(t))
}

export type QuestionInput = z.output<ReturnType<typeof getQuestionInputSchema>>

const { validate: validateQuestionInput, instantiate: instantiateQuestionInput, safeParse: safeParseQuestionInput } = localizedSchemaUtilities(getQuestionInputSchema)
export { instantiateQuestionInput, safeParseQuestionInput, validateQuestionInput }
