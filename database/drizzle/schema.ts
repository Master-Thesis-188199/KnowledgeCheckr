import { sql } from 'drizzle-orm'
import { boolean, datetime, foreignKey, index, int, json, mediumtext, mysqlEnum, mysqlTable, primaryKey, tinyint, tinytext, unique, varchar } from 'drizzle-orm/mysql-core'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'

const primaryKeyUUID = varchar({ length: 36 })
  .notNull()
  .primaryKey()
  //? default-value declaration is needed so that drizzle returns the inserted-id through $.returnedId()
  .$defaultFn(() => getUUID())

export const db_account = mysqlTable(
  'Account',
  {
    id: varchar({ length: 36 }).notNull().primaryKey(),
    accountId: tinytext().notNull(),
    providerId: tinytext().notNull(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    accessToken: mediumtext(),
    refreshToken: mediumtext(),
    idToken: mediumtext(),
    accessTokenExpiresAt: datetime({ mode: 'string' }),
    refreshTokenExpiresAt: datetime({ mode: 'string' }),
    scope: tinytext(),
    password: tinytext(),
    createdAt: datetime({ mode: 'string' }).notNull(),
    updatedAt: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [
    index('fk_account_user1_idx').on(table.userId),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [db_user.id],
      name: 'fk_account_user1',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
  ],
)

export const db_answer = mysqlTable(
  'Answer',
  {
    id: primaryKeyUUID,
    answer: mediumtext().notNull(),
    correct: tinyint(),
    position: int(),
    createdAt: datetime({ mode: 'string' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$default(() => formatDatetime(new Date(Date.now()))),
    updatedAt: datetime({ mode: 'string' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$default(() => formatDatetime(new Date(Date.now())))
      .$onUpdate(() => formatDatetime(new Date(Date.now()))),
    questionId: varchar('Question_id', { length: 36 }).notNull(),
    _position: int().notNull(),
  },
  (table) => [
    index('fk_Answer_Question1_idx').on(table.questionId),
    foreignKey({
      columns: [table.questionId],
      foreignColumns: [db_question.id],
      name: 'fk_Answer_Question1',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
  ],
)

export const db_category = mysqlTable(
  'Category',
  {
    id: varchar({ length: 36 })
      .notNull()
      .primaryKey()
      //? default-value declaration is needed so that drizzle returns the inserted-id through $.returnedId()
      .$defaultFn(() => getUUID()),
    name: varchar({ length: 255 }).notNull(),
    createdAt: datetime({ mode: 'string' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$default(() => formatDatetime(new Date(Date.now()))),
    updatedAt: datetime({ mode: 'string' })
      .notNull()
      .default(formatDatetime(new Date(Date.now())))
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => formatDatetime(new Date(Date.now()))),
    prequisiteCategoryId: varchar('prequisite_category_id', { length: 36 }),
    knowledgecheckId: varchar('knowledgecheck_id', { length: 36 }).notNull(),
  },
  (table) => [
    unique().on(table.knowledgecheckId, table.name), //* ensure a check can not have duplicate categories
    index('fk_Category_KnowledgeCheck1_idx').on(table.knowledgecheckId),
    foreignKey({
      columns: [table.knowledgecheckId],
      foreignColumns: [db_knowledgeCheck.id],
      name: 'fk_Category_KnowledgeCheck1',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
    index('fk_Category_Category1_idx').on(table.prequisiteCategoryId),
    foreignKey({
      columns: [table.prequisiteCategoryId],
      foreignColumns: [table.id],
      name: 'fk_Category_Category1',
    })
      .onDelete('set null')
      .onUpdate('no action'),
  ],
)

export const db_knowledgeCheck = mysqlTable(
  'KnowledgeCheck',
  {
    id: primaryKeyUUID,
    name: tinytext().notNull(),
    description: mediumtext(),
    owner_id: varchar('owner_id', { length: 36 }).notNull(),

    share_key: varchar('public_token', { length: 50 }).unique(),
    openDate: datetime({ mode: 'string' }).notNull(),
    closeDate: datetime({ mode: 'string' }).$default(() => sql`NULL`),
    difficulty: int().notNull(),
    createdAt: datetime({ mode: 'string' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$default(() => formatDatetime(new Date(Date.now()))),
    updatedAt: datetime({ mode: 'string' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$default(() => formatDatetime(new Date(Date.now())))
      .$onUpdate(() => formatDatetime(new Date(Date.now()))),
    expiresAt: datetime({ mode: 'string' }).default(sql`NULL`),
  },
  (table) => [
    index('fk_KnowledgeCheck_user1_idx').on(table.owner_id),
    foreignKey({
      columns: [table.owner_id],
      foreignColumns: [db_user.id],
      name: 'fk_KnowledgeCheck_user1',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
  ],
)

export const db_knowledgeCheckSettings = mysqlTable(
  'KnowledgeCheck_Settings',
  {
    id: primaryKeyUUID,
    knowledgecheckId: varchar('knowledgecheck_id', { length: 36 }).notNull(),
    allowAnonymous: tinyint('allow_anonymous')
      .notNull()
      .default(KnowledgeCheckSettingsSchema.shape.examination.shape.allowAnonymous._def.defaultValue() ? 1 : 0),
    allowFreeNavigation: tinyint('allow_free_navigation')
      .notNull()
      .default(KnowledgeCheckSettingsSchema.shape.examination.shape.allowFreeNavigation._def.defaultValue() ? 1 : 0),
    questionOrder: mysqlEnum(['create-order', 'random']).notNull().default(KnowledgeCheckSettingsSchema.shape.examination.shape.questionOrder._def.defaultValue()),
    answerOrder: mysqlEnum(['create-order', 'random']).notNull().default(KnowledgeCheckSettingsSchema.shape.examination.shape.answerOrder._def.defaultValue()),
    examTimeFrameSeconds: int().notNull().default(KnowledgeCheckSettingsSchema.shape.examination.shape.examTimeFrameSeconds._def.defaultValue()),
    examinationAttemptCount: int().notNull().default(KnowledgeCheckSettingsSchema.shape.examination.shape.examinationAttemptCount._def.defaultValue()),
    shareAccessibility: int()
      .notNull()
      .default(KnowledgeCheckSettingsSchema.shape.shareAccessibility._def.defaultValue() ? 1 : 0),

    // -----
    enableExaminations: int()
      .notNull()
      .default(KnowledgeCheckSettingsSchema.shape.examination.shape.enableExaminations._def.defaultValue() ? 1 : 0),
    startDate: datetime({ mode: 'string' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$default(() => formatDatetime(new Date(Date.now()))),
    endDate: datetime({ mode: 'string' }),
  },
  (table) => [
    index('fk_KnowledgeCheck_Settings_KnowledgeCheck1_idx').on(table.knowledgecheckId),
    foreignKey({
      columns: [table.knowledgecheckId],
      foreignColumns: [db_knowledgeCheck.id],
      name: 'fk_KnowledgeCheck_Settings_KnowledgeCheck1',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
  ],
)

export const db_question = mysqlTable(
  'Question',
  {
    id: primaryKeyUUID,
    type: mysqlEnum(['single-choice', 'multiple-choice', 'open-question', 'drag-drop']).notNull(),
    question: mediumtext().notNull(),
    points: int().notNull(),
    createdAt: datetime({ mode: 'string' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$default(() => formatDatetime(new Date(Date.now()))),
    updatedAt: datetime({ mode: 'string' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$default(() => formatDatetime(new Date(Date.now())))
      .$onUpdate(() => formatDatetime(new Date(Date.now()))),
    categoryId: varchar('category_id', { length: 36 }).notNull(),
    accessibility: mysqlEnum(['all', 'practice-only', 'exam-only'])
      .notNull()
      .default('all')
      .$default(() => 'all'),

    _position: int().notNull(),
    knowledgecheckId: varchar('knowledgecheck_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('fk_Question_Category1_idx').on(table.categoryId),
    index('fk_Question_KnowledgeCheck1_idx').on(table.knowledgecheckId),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [db_category.id],
      name: 'fk_Question_Category1',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
    foreignKey({
      columns: [table.knowledgecheckId],
      foreignColumns: [db_knowledgeCheck.id],
      name: 'fk_Question_KnowledgeCheck1',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
  ],
)

export const db_session = mysqlTable(
  'Session',
  {
    id: varchar({ length: 36 }).notNull().primaryKey(),
    token: tinytext().notNull(),
    createdAt: datetime({ mode: 'string' }).notNull(),
    updatedAt: datetime({ mode: 'string' }).notNull(),
    expiresAt: datetime({ mode: 'string' }).notNull(),
    ipAddress: tinytext(),
    userAgent: tinytext(),
    userId: varchar('user_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('fk_session_user_idx').on(table.userId),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [db_user.id],
      name: 'fk_session_user',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
  ],
)

export const db_user = mysqlTable('User', {
  id: varchar({ length: 36 }).notNull().primaryKey(),
  name: tinytext().notNull(),
  email: tinytext().notNull(),
  emailVerified: tinyint().notNull(),
  image: varchar({ length: 512 }),
  createdAt: datetime({ mode: 'string' }).notNull(),
  updatedAt: datetime({ mode: 'string' }).notNull(),
  isAnonymous: boolean(),
})

export const db_userContributesToKnowledgeCheck = mysqlTable(
  'User_contributesTo_KnowledgeCheck',
  {
    userId: varchar('user_id', { length: 36 }).notNull(),
    knowledgecheckId: varchar('knowledgecheck_id', { length: 36 }).notNull(),
  },
  (table) => [
    index('fk_user_has_KnowledgeCheck_KnowledgeCheck1_idx').on(table.knowledgecheckId),
    index('fk_user_has_KnowledgeCheck_user1_idx').on(table.userId),
    primaryKey({ columns: [table.userId, table.knowledgecheckId], name: 'User_has_done_KnowledgeCheck_pk' }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [db_user.id],
      name: 'fk_user_has_KnowledgeCheck_user1',
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    foreignKey({
      columns: [table.knowledgecheckId],
      foreignColumns: [db_knowledgeCheck.id],
      name: 'fk_user_has_KnowledgeCheck_KnowledgeCheck1',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
  ],
)

export const db_userHasDoneKnowledgeCheck = mysqlTable(
  'User_has_done_KnowledgeCheck',
  {
    id: int().autoincrement().notNull(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    knowledgeCheckId: varchar('knowledgeCheck_id', { length: 36 }).notNull(),
    startedAt: datetime({ mode: 'string' }).notNull(),
    finishedAt: datetime({ mode: 'string' }).notNull(),
    score: int().notNull(),
    results: json().notNull(),
  },
  (table) => [
    index('fk_user_has_KnowledgeCheck_KnowledgeCheck2_idx').on(table.knowledgeCheckId),
    index('fk_user_has_KnowledgeCheck_user2_idx').on(table.userId),
    primaryKey({ columns: [table.id, table.userId, table.knowledgeCheckId] }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [db_user.id],
      name: 'fk_user_has_KnowledgeCheck_user2',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
    foreignKey({
      columns: [table.knowledgeCheckId],
      foreignColumns: [db_knowledgeCheck.id],
      name: 'fk_user_has_KnowledgeCheck_KnowledgeCheck2',
    })
      .onDelete('cascade')
      .onUpdate('no action'),
  ],
)

export const db_verification = mysqlTable('Verification', {
  id: varchar({ length: 36 }).notNull().primaryKey(),
  identifier: tinytext().notNull(),
  value: varchar({ length: 1024 }).notNull(),
  expiresAt: datetime({ mode: 'string' }).notNull(),
  createdAt: datetime({ mode: 'string' }).notNull(),
  updatedAt: datetime({ mode: 'string' }).notNull(),
})
