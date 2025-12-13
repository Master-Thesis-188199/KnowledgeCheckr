import { generateToken } from '@/src/lib/Shared/generateToken'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { instantiateSingleChoice, Question } from '@/src/schemas/QuestionSchema'
import { ParameterizedTest } from '@/src/tests/parameterizedTest'

describe('Verify selection of practice questions by category', () => {
  beforeEach(() => {
    cy.loginTestUser()
  })

  ParameterizedTest([{ categorySelection: 'random' }, { categorySelection: 'all' }] as const, ({ categorySelection }) =>
    it(`Verify users can select '${categorySelection}' category in /practice/category page`, () => {
      const baseURL = Cypress.env('NEXT_PUBLIC_BASE_URL')
      const dummyCheck = instantiateKnowledgeCheck()
      const dummyCategories = ['general', 'geography', 'mathematics']

      dummyCheck.share_key = 'select-category' + generateToken(8)

      const questions: Question[] = []
      const questionCategories: KnowledgeCheck['questionCategories'] = []

      for (const category of dummyCategories) {
        questions.push({ ...instantiateSingleChoice(), category }, { ...instantiateSingleChoice(), category })
        questionCategories.push({
          id: getUUID(),
          name: category,
          skipOnMissingPrequisite: false,
        })
      }

      dummyCheck.questions = questions
      dummyCheck.questionCategories = questionCategories

      cy.insertKnowledgeCheck(dummyCheck)

      cy.visit(`/checks/${dummyCheck.share_key}/practice`)

      //* ensure users are redirected when no selection is made but > 1 categories exist
      cy.url({ timeout: 5 * 1000 }).should('eq', `${baseURL}/checks/${dummyCheck.share_key}/practice/category`)

      cy.get('#category-selection')
        .children()
        .should('have.length', dummyCategories.length + 1)

      const selection = categorySelection === 'random' ? dummyCategories.at((Math.random() * dummyCategories.length) % dummyCategories.length)! : 'all'
      cy.get('#category-selection').children(`[data-category="${selection}"]`).should('exist').click()

      cy.url({ timeout: 5 * 1000 }).should('eq', `${baseURL}/checks/${dummyCheck.share_key}/practice?category=${categorySelection === 'random' ? selection : '_none_'}`)
    }),
  )
})
