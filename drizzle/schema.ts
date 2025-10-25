import { datetime, foreignKey, index, int, json, mediumtext, mysqlEnum, mysqlTable, primaryKey, tinyint, tinytext, varchar } from 'drizzle-orm/mysql-core'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { getUUID } from '@/src/lib/Shared/getUUID'

export const account = mysqlTable(
  'Account',
  {
    id: varchar({ length: 36 }).notNull(),
    accountId: tinytext().notNull(),
    providerId: tinytext().notNull(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
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
  (table) => [index('fk_account_user1_idx').on(table.userId), primaryKey({ columns: [table.id], name: 'Account_id' })],
)

export const answer = mysqlTable(
  'Answer',
  {
    id: varchar({ length: 36 })
      .notNull()
      .primaryKey()
      //? default-value declaration is needed so that drizzle returns the inserted-id through $.returnedId()
      .$defaultFn(() => getUUID()),
    answer: mediumtext().notNull(),
    correct: tinyint(),
    position: int(),
    createdAt: datetime({ mode: 'string' })
      .notNull()
      .default(formatDatetime(new Date(Date.now()))),
    updatedAt: datetime({ mode: 'string' })
      .notNull()
      .default(formatDatetime(new Date(Date.now())))
      .$onUpdate(() => formatDatetime(new Date(Date.now()))),
    questionId: varchar('Question_id', { length: 36 })
      .notNull()
      .references(() => question.id, { onDelete: 'cascade' }),
  },
  (table) => [index('fk_Answer_Question1_idx').on(table.questionId), primaryKey({ columns: [table.id], name: 'Answer_id' })],
)

export const category = mysqlTable(
  'Category',
  {
    id: varchar({ length: 36 })
      .notNull()
      .primaryKey()
      //? default-value declaration is needed so that drizzle returns the inserted-id through $.returnedId()
      .$defaultFn(() => getUUID()),
    name: tinytext().notNull(),
    createdAt: datetime({ mode: 'string' })
      .notNull()
      .default(formatDatetime(new Date(Date.now()))),
    updatedAt: datetime({ mode: 'string' })
      .notNull()
      .default(formatDatetime(new Date(Date.now())))
      .$onUpdate(() => formatDatetime(new Date(Date.now()))),
    prequisiteCategoryId: varchar('prequisite_category_id', { length: 36 }),
  },
  (table) => [
    index('fk_Category_Category1_idx').on(table.prequisiteCategoryId),
    foreignKey({
      columns: [table.prequisiteCategoryId],
      foreignColumns: [table.id],
      name: 'fk_Category_Category1',
    }).onDelete('set null'),
    primaryKey({ columns: [table.id], name: 'Category_id' }),
  ],
)

export const knowledgeCheck = mysqlTable(
  'KnowledgeCheck',
  {
    id: varchar({ length: 36 })
      .notNull()
      .primaryKey()
      //? default-value declaration is needed so that drizzle returns the inserted-id through $.returnedId()
      .$defaultFn(() => getUUID()),
    name: tinytext().notNull(),
    description: mediumtext(),
    owner_id: varchar('owner_id', { length: 36 })
      .notNull()
      .references(() => user.id),
    share_key: tinytext('public_token'),
    openDate: datetime({ mode: 'string' }).notNull(),
    closeDate: datetime({ mode: 'string' }),
    difficulty: int().notNull(),
    createdAt: datetime({ mode: 'string' })
      .notNull()
      .default(formatDatetime(new Date(Date.now()))),
    updatedAt: datetime({ mode: 'string' })
      .notNull()
      .default(formatDatetime(new Date(Date.now())))
      .$onUpdate(() => formatDatetime(new Date(Date.now()))),
    expiresAt: datetime({ mode: 'string' }),
  },
  (table) => [index('fk_KnowledgeCheck_user1_idx').on(table.owner_id), primaryKey({ columns: [table.id], name: 'KnowledgeCheck_id' })],
)

export const knowledgeCheckSettings = mysqlTable(
  'KnowledgeCheck_Settings',
  {
    id: varchar({ length: 36 })
      .notNull()
      .primaryKey()
      //? default-value declaration is needed so that drizzle returns the inserted-id through $.returnedId()
      .$defaultFn(() => getUUID()),
    knowledgecheckId: varchar('knowledgecheck_id', { length: 36 })
      .notNull()
      .references(() => knowledgeCheck.id, { onDelete: 'cascade' }),
    allowAnonymous: tinyint('allow_anonymous').default(1),
    randomizeQuestions: tinyint('randomize_questions').default(1),
    allowFreeNavigation: tinyint('allow_free_navigation').default(1),
  },
  (table) => [index('fk_KnowledgeCheck_Settings_KnowledgeCheck1_idx').on(table.knowledgecheckId), primaryKey({ columns: [table.id], name: 'KnowledgeCheck_Settings_id' })],
)

export const question = mysqlTable(
  'Question',
  {
    id: varchar({ length: 36 })
      .notNull()
      .primaryKey()
      //? default-value declaration is needed so that drizzle returns the inserted-id through $.returnedId()
      .$defaultFn(() => getUUID()),
    type: mysqlEnum(['single-choice', 'multiple-choice', 'open-question', 'drag-drop']).notNull(),
    question: mediumtext().notNull(),
    points: int().notNull(),
    createdAt: datetime({ mode: 'string' })
      .notNull()
      .default(formatDatetime(new Date(Date.now()))),
    updatedAt: datetime({ mode: 'string' })
      .notNull()
      .default(formatDatetime(new Date(Date.now())))
      .$onUpdate(() => formatDatetime(new Date(Date.now()))),
    categoryId: varchar('category_id', { length: 36 })
      .notNull()
      .references(() => category.id, { onDelete: 'cascade' }),
    knowledgecheckId: varchar('knowledgecheck_id', { length: 36 })
      .notNull()
      .references(() => knowledgeCheck.id, { onDelete: 'cascade' }),
  },
  (table) => [index('fk_Question_Category1_idx').on(table.categoryId), index('fk_Question_KnowledgeCheck1_idx').on(table.knowledgecheckId), primaryKey({ columns: [table.id], name: 'Question_id' })],
)

export const session = mysqlTable(
  'Session',
  {
    id: varchar({ length: 36 }).notNull(),
    token: tinytext().notNull(),
    createdAt: datetime({ mode: 'string' }).notNull(),
    updatedAt: datetime({ mode: 'string' }).notNull(),
    expiresAt: datetime({ mode: 'string' }).notNull(),
    ipAddress: tinytext(),
    userAgent: tinytext(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('fk_session_user_idx').on(table.userId), primaryKey({ columns: [table.id], name: 'Session_id' })],
)

export const user = mysqlTable(
  'User',
  {
    id: varchar({ length: 36 }).notNull(),
    name: tinytext().notNull(),
    email: tinytext().notNull(),
    emailVerified: tinyint().notNull(),
    image: varchar({ length: 512 }),
    createdAt: datetime({ mode: 'string' }).notNull(),
    updatedAt: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'User_id' })],
)

export const userContributesToKnowledgeCheck = mysqlTable(
  'User_contributesTo_KnowledgeCheck',
  {
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onUpdate: 'cascade' }),
    knowledgecheckId: varchar('knowledgecheck_id', { length: 36 })
      .notNull()
      .references(() => knowledgeCheck.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index('fk_user_has_KnowledgeCheck_KnowledgeCheck1_idx').on(table.knowledgecheckId),
    index('fk_user_has_KnowledgeCheck_user1_idx').on(table.userId),
    primaryKey({ columns: [table.userId, table.knowledgecheckId], name: 'User_contributesTo_KnowledgeCheck_user_id_knowledgecheck_id' }),
  ],
)

export const userHasDoneKnowledgeCheck = mysqlTable(
  'User_has_done_KnowledgeCheck',
  {
    id: int().autoincrement().notNull(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    knowledgeCheckId: varchar('knowledgeCheck_id', { length: 36 })
      .notNull()
      .references(() => knowledgeCheck.id, { onDelete: 'cascade' }),
    startedAt: datetime({ mode: 'string' }).notNull(),
    finishedAt: datetime({ mode: 'string' }).notNull(),
    score: int().notNull(),
    results: json().notNull(),
  },
  (table) => [
    index('fk_user_has_KnowledgeCheck_KnowledgeCheck2_idx').on(table.knowledgeCheckId),
    index('fk_user_has_KnowledgeCheck_user2_idx').on(table.userId),
    primaryKey({ columns: [table.id, table.userId, table.knowledgeCheckId], name: 'User_has_done_KnowledgeCheck_id_user_id_knowledgeCheck_id' }),
  ],
)

export const verification = mysqlTable(
  'Verification',
  {
    id: varchar({ length: 36 }).notNull(),
    identifier: tinytext().notNull(),
    value: varchar({ length: 1024 }).notNull(),
    expiresAt: datetime({ mode: 'string' }).notNull(),
    createdAt: datetime({ mode: 'string' }).notNull(),
    updatedAt: datetime({ mode: 'string' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'Verification_id' })],
)
