'use server'

import { PracticeData, PracticeSchema } from '@/src/schemas/practice/PracticeSchema'

export type AuthState = {
  success: boolean
  fieldErrors?: {
    [K in keyof PracticeData]?: string[]
  }
  rootError?: string
  values?: PracticeData
}

export async function EvaluateAnswer(_: AuthState, data: PracticeData): Promise<AuthState> {
  console.log('Evaluating practice answers...', data)

  await new Promise((r) => setTimeout(r, 500))

  //* Purposely produce an error for server-side form-field validation
  // const parsed = PracticeSchema.safeParse({ question_id: data.question_id, answer: { type: 'single-choice', selection: '' } } as Partial<PracticeData>)
  const parsed = PracticeSchema.safeParse(data)

  if (!parsed.success) {
    console.log("The practice-schema constraints weren't satisfied....", parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return { success: false, fieldErrors, values: data }
  }

  return { success: true, values: data }
}
