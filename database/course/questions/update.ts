import { eq } from 'drizzle-orm'
import { getCategoriesByCheckId } from '@/database/course/catagories/select'
import insertKnowledgeCheckQuestions from '@/database/course/questions/insert'
import { DrizzleDB } from '@/database/Database'
import { db_question } from '@/database/drizzle'
import { Course } from '@/src/schemas/CourseSchema'

export async function updateQuestions(db: DrizzleDB, courseId: Course['id'], questions: Course['questions']) {
  await db.delete(db_question).where(eq(db_question.knowledgecheckId, courseId))

  if (questions.length === 0) return

  const categories = await getCategoriesByCheckId(courseId)
  const questionsWithCategoryIds = questions.map((q) => {
    const category = categories.find((c) => c.name === q.category)

    if (!category) throw new Error(`Category "${q.category}" not found for question "${q.id}"`)

    return { ...q, categoryId: category.id }
  })
  await insertKnowledgeCheckQuestions(db, questionsWithCategoryIds, courseId)
}
