import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_question } from '@/database/drizzle'
import { getCategoriesByCheckId } from '@/database/knowledgeCheck/catagories/select'
import insertKnowledgeCheckQuestions from '@/database/knowledgeCheck/questions/insert'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function updateQuestions(db: DrizzleDB, checkId: KnowledgeCheck['id'], questions: KnowledgeCheck['questions']) {
  await db.delete(db_question).where(eq(db_question.knowledgecheckId, checkId))

  if (questions.length === 0) return

  const categories = await getCategoriesByCheckId(checkId)
  const questionsWithCategoryIds = questions.map((q) => {
    const category = categories.find((c) => c.name === q.category)

    if (!category) throw new Error(`Category "${q.category}" not found for question "${q.id}"`)

    return { ...q, categoryId: category.id }
  })
  await insertKnowledgeCheckQuestions(db, questionsWithCategoryIds, checkId)
}
