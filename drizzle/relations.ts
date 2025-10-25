import { relations } from 'drizzle-orm/relations'
import { account, answer, category, knowledgeCheck, knowledgeCheckSettings, question, session, user, userContributesToKnowledgeCheck, userHasDoneKnowledgeCheck } from './schema'

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  knowledgeChecks: many(knowledgeCheck),
  sessions: many(session),
  userContributesToKnowledgeChecks: many(userContributesToKnowledgeCheck),
  userHasDoneKnowledgeChecks: many(userHasDoneKnowledgeCheck),
}))

export const answerRelations = relations(answer, ({ one }) => ({
  question: one(question, {
    fields: [answer.questionId],
    references: [question.id],
  }),
}))

export const questionRelations = relations(question, ({ one, many }) => ({
  answers: many(answer),
  category: one(category, {
    fields: [question.categoryId],
    references: [category.id],
  }),
  knowledgeCheck: one(knowledgeCheck, {
    fields: [question.knowledgecheckId],
    references: [knowledgeCheck.id],
  }),
}))

export const categoryRelations = relations(category, ({ one, many }) => ({
  category: one(category, {
    fields: [category.prequisiteCategoryId],
    references: [category.id],
    relationName: 'category_prequisiteCategoryId_category_id',
  }),
  categories: many(category, {
    relationName: 'category_prequisiteCategoryId_category_id',
  }),
  questions: many(question),
}))

export const knowledgeCheckRelations = relations(knowledgeCheck, ({ one, many }) => ({
  user: one(user, {
    fields: [knowledgeCheck.owner_id],
    references: [user.id],
  }),
  knowledgeCheckSettings: many(knowledgeCheckSettings),
  questions: many(question),
  userContributesToKnowledgeChecks: many(userContributesToKnowledgeCheck),
  userHasDoneKnowledgeChecks: many(userHasDoneKnowledgeCheck),
}))

export const knowledgeCheckSettingsRelations = relations(knowledgeCheckSettings, ({ one }) => ({
  knowledgeCheck: one(knowledgeCheck, {
    fields: [knowledgeCheckSettings.knowledgecheckId],
    references: [knowledgeCheck.id],
  }),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const userContributesToKnowledgeCheckRelations = relations(userContributesToKnowledgeCheck, ({ one }) => ({
  knowledgeCheck: one(knowledgeCheck, {
    fields: [userContributesToKnowledgeCheck.knowledgecheckId],
    references: [knowledgeCheck.id],
  }),
  user: one(user, {
    fields: [userContributesToKnowledgeCheck.userId],
    references: [user.id],
  }),
}))

export const userHasDoneKnowledgeCheckRelations = relations(userHasDoneKnowledgeCheck, ({ one }) => ({
  knowledgeCheck: one(knowledgeCheck, {
    fields: [userHasDoneKnowledgeCheck.knowledgeCheckId],
    references: [knowledgeCheck.id],
  }),
  user: one(user, {
    fields: [userHasDoneKnowledgeCheck.userId],
    references: [user.id],
  }),
}))
