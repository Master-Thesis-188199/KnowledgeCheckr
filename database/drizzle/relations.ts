import { relations } from 'drizzle-orm/relations'
import {
  db_account,
  db_answer,
  db_category,
  db_knowledgeCheck,
  db_knowledgeCheckSettings,
  db_question,
  db_session,
  db_user,
  db_userContributesToKnowledgeCheck,
  db_userHasDoneKnowledgeCheck,
} from '@/database/drizzle/schema'

export const accountRelations = relations(db_account, ({ one }) => ({
  user: one(db_user, {
    fields: [db_account.userId],
    references: [db_user.id],
  }),
}))

export const userRelations = relations(db_user, ({ many }) => ({
  accounts: many(db_account),
  knowledgeChecks: many(db_knowledgeCheck),
  sessions: many(db_session),
  userContributesToKnowledgeChecks: many(db_userContributesToKnowledgeCheck),
  userHasDoneKnowledgeChecks: many(db_userHasDoneKnowledgeCheck),
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
  knowledgeCheck: one(db_knowledgeCheck, {
    fields: [db_question.knowledgecheckId],
    references: [db_knowledgeCheck.id],
  }),
}))

export const categoryRelations = relations(db_category, ({ one, many }) => ({
  knowledgeCheck: one(db_knowledgeCheck, {
    fields: [db_category.knowledgecheckId],
    references: [db_knowledgeCheck.id],
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

export const knowledgeCheckRelations = relations(db_knowledgeCheck, ({ one, many }) => ({
  user: one(db_user, {
    fields: [db_knowledgeCheck.owner_id],
    references: [db_user.id],
  }),
  categories: many(db_category),
  knowledgeCheckSettings: one(db_knowledgeCheckSettings),
  questions: many(db_question),
  userContributesToKnowledgeChecks: many(db_userContributesToKnowledgeCheck),
  userHasDoneKnowledgeChecks: many(db_userHasDoneKnowledgeCheck),
}))

export const knowledgeCheckSettingsRelations = relations(db_knowledgeCheckSettings, ({ one }) => ({
  knowledgeCheck: one(db_knowledgeCheck, {
    fields: [db_knowledgeCheckSettings.knowledgecheckId],
    references: [db_knowledgeCheck.id],
  }),
}))

export const sessionRelations = relations(db_session, ({ one }) => ({
  user: one(db_user, {
    fields: [db_session.userId],
    references: [db_user.id],
  }),
}))

export const userContributesToKnowledgeCheckRelations = relations(db_userContributesToKnowledgeCheck, ({ one }) => ({
  knowledgeCheck: one(db_knowledgeCheck, {
    fields: [db_userContributesToKnowledgeCheck.knowledgecheckId],
    references: [db_knowledgeCheck.id],
  }),
  user: one(db_user, {
    fields: [db_userContributesToKnowledgeCheck.userId],
    references: [db_user.id],
  }),
}))

export const userHasDoneKnowledgeCheckRelations = relations(db_userHasDoneKnowledgeCheck, ({ one }) => ({
  knowledgeCheck: one(db_knowledgeCheck, {
    fields: [db_userHasDoneKnowledgeCheck.knowledgeCheckId],
    references: [db_knowledgeCheck.id],
  }),
  user: one(db_user, {
    fields: [db_userHasDoneKnowledgeCheck.userId],
    references: [db_user.id],
  }),
}))
