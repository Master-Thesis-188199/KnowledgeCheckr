'use server'

import { DBConnection } from '@/database/Database'
import { DBAnswer, DBCategory, DbQuestion } from '@/database/knowledgeCheck/questions/type'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

export default async function getKnowledgeCheckQuestions(db: DBConnection, knowledgeCheck_id: KnowledgeCheck['id']) {
  await requireAuthentication()

  const questions: Question[] = []

  const raw_questions = await db.exec<Array<DbQuestion>>('SELECT * FROM Question WHERE knowledgecheck_id = ?', [knowledgeCheck_id])

  for (const question of raw_questions) {
    const answers = await db.exec<DBAnswer[]>('SELECT * FROM Answer WHERE Question_id = ?', [question.id])
    const category = await parseCategory(db, question.category_id)

    questions.push({
      id: question.id,
      type: question.type as Any,
      question: question.question,
      category,
      points: question.points,
      ...parseAnswer(question.type, answers as DBAnswer[]),
    })
  }

  return questions
}

function parseAnswer(question_type: Question['type'], answers: DBAnswer[]): Pick<ChoiceQuestion, 'answers'> | Pick<OpenQuestion, 'expectation'> | Pick<DragDropQuestion, 'answers'> {
  switch (question_type) {
    case 'multiple-choice':
      return {
        answers: answers.map((raw_mcq): ChoiceQuestion['answers'][number] => ({
          id: raw_mcq.id,
          answer: raw_mcq.answer,
          correct: raw_mcq.correct === 1,
        })),
      }
    case 'single-choice':
      return {
        answers: answers.map((raw_mcq): ChoiceQuestion['answers'][number] => ({
          id: raw_mcq.id,
          answer: raw_mcq.answer,
          correct: raw_mcq.correct === 1,
        })),
      }

    case 'open-question':
      return { expectation: answers.join('. ') }

    case 'drag-drop':
      return {
        answers: answers.map((raw_mcq): DragDropQuestion['answers'][number] => ({
          id: raw_mcq.id,
          answer: raw_mcq.answer,
          position: raw_mcq.correct!,
        })),
      }
  }
}

async function parseCategory(db: DBConnection, category_id: string): Promise<Question['category']> {
  await requireAuthentication()

  const categories = await db.exec<DBCategory[]>('SELECT * FROM Category WHERE id = ?', [category_id])

  return categories.at(0)!.name
}
