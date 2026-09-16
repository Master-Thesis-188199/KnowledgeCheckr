import { relations } from 'drizzle-orm/relations'
import { db_account, db_answer, db_category, db_course, db_courseSettings, db_question, db_session, db_user, db_userContributesToCourse, db_userHasDoneCourse } from '@/database/drizzle/schema'

export const accountRelations = relations(db_account, ({ one }) => ({
  user: one(db_user, {
    fields: [db_account.userId],
    references: [db_user.id],
  }),
}))

export const userRelations = relations(db_user, ({ many }) => ({
  accounts: many(db_account),
  knowledgeChecks: many(db_course),
  sessions: many(db_session),
  userContributesToKnowledgeChecks: many(db_userContributesToCourse),
  userHasDoneKnowledgeChecks: many(db_userHasDoneCourse),
}))

export const answerRelations = relations(db_answer, ({ one }) => ({
  question: one(db_question, {
    fields: [db_answer.questionId],
    references: [db_question.id],
  }),
}))

export const questionRelations = relations(db_question, ({ one, many }) => ({
  answers: many(db_answer),
  category: one(db_category, {
    fields: [db_question.categoryId],
    references: [db_category.id],
  }),
  knowledgeCheck: one(db_course, {
    fields: [db_question.knowledgecheckId],
    references: [db_course.id],
  }),
}))

export const categoryRelations = relations(db_category, ({ one, many }) => ({
  knowledgeCheck: one(db_course, {
    fields: [db_category.knowledgecheckId],
    references: [db_course.id],
  }),

  category: one(db_category, {
    fields: [db_category.prequisiteCategoryId],
    references: [db_category.id],
    relationName: 'category_prequisiteCategoryId_category_id',
  }),
  categories: many(db_category, {
    relationName: 'category_prequisiteCategoryId_category_id',
  }),
  questions: many(db_question),
}))

export const courseRelations = relations(db_course, ({ one, many }) => ({
  user: one(db_user, {
    fields: [db_course.owner_id],
    references: [db_user.id],
  }),
  categories: many(db_category),
  knowledgeCheckSettings: one(db_courseSettings),
  questions: many(db_question),
  userContributesToKnowledgeChecks: many(db_userContributesToCourse),
  userHasDoneKnowledgeChecks: many(db_userHasDoneCourse),
}))

export const courseSettingsRelations = relations(db_courseSettings, ({ one }) => ({
  knowledgeCheck: one(db_course, {
    fields: [db_courseSettings.knowledgecheckId],
    references: [db_course.id],
  }),
}))

export const sessionRelations = relations(db_session, ({ one }) => ({
  user: one(db_user, {
    fields: [db_session.userId],
    references: [db_user.id],
  }),
}))

export const userContributesToCourseRelations = relations(db_userContributesToCourse, ({ one }) => ({
  knowledgeCheck: one(db_course, {
    fields: [db_userContributesToCourse.knowledgecheckId],
    references: [db_course.id],
  }),
  user: one(db_user, {
    fields: [db_userContributesToCourse.userId],
    references: [db_user.id],
  }),
}))

export const userHasDoneCourseRelations = relations(db_userHasDoneCourse, ({ one }) => ({
  knowledgeCheck: one(db_course, {
    fields: [db_userHasDoneCourse.knowledgeCheckId],
    references: [db_course.id],
  }),
  user: one(db_user, {
    fields: [db_userHasDoneCourse.userId],
    references: [db_user.id],
  }),
}))
