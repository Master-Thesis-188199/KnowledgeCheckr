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

      const selection = categorySelection === 'random' ? dummyCategories[Math.floor(Math.random() * dummyCategories.length)] : 'all'
      cy.get('#category-selection').children(`[data-category="${selection}"]`).should('exist').click()

      cy.url({ timeout: 5 * 1000 }).should('eq', `${baseURL}/checks/${dummyCheck.share_key}/practice?category=${categorySelection === 'random' ? selection : '_none_'}`)

      cy.get('#practice-question-steps')
        .children()
        .should('have.length', categorySelection === 'all' ? dummyCheck.questions.length : dummyCheck.questions.filter((q) => q.category === selection).length)
    }),
  )

  it(`Verify users are not asked to select category when check has just 1 category`, () => {
    const baseURL = Cypress.env('NEXT_PUBLIC_BASE_URL')
    const dummyCheck = instantiateKnowledgeCheck()
    const dummyCategories = ['general']

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

    //* ensure users are NOT redirected to category selection when only 1 category exists
    cy.url().should('not.eq', `${baseURL}/checks/${dummyCheck.share_key}/practice/category`)
    cy.url().should('eq', `${baseURL}/checks/${dummyCheck.share_key}/practice`)

    cy.get('#practice-question-steps').children().should('have.length', dummyCheck.questions.length)
  })

  ParameterizedTest([{ categorySelection: 'random' }, { categorySelection: 'all' }] as const, ({ categorySelection }) =>
    it(`Verify users can switch between practice categories through breadcrumbs (category-selection: ${categorySelection})`, () => {
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

      cy.url().should('eq', `${baseURL}/checks/${dummyCheck.share_key}/practice/category`)

      cy.get('#category-selection')
        .children()
        .should('have.length', dummyCategories.length + 1)

      const selection = categorySelection === 'random' ? dummyCategories[Math.floor(Math.random() * dummyCategories.length)] : 'all'

      cy.get('#category-selection').children(`[data-category="${selection}"]`).should('exist').click()

      cy.url({ timeout: 5 * 1000 }).should('eq', `${baseURL}/checks/${dummyCheck.share_key}/practice?category=${categorySelection === 'random' ? selection : '_none_'}`)

      cy.get('#practice-question-steps')
        .children()
        .should('have.length', categorySelection === 'all' ? dummyCheck.questions.length : dummyCheck.questions.filter((q) => q.category === selection).length)

      cy.get('[data-slot="breadcrumb"]').should('exist').and('be.visible')
      cy.get('#category-switcher')
        .should('exist')
        .should('contain.text', selection === 'all' ? 'combined-questions' : selection)
        .should('have.attr', 'data-state', 'closed')
        .realHover()
        .click()
        .should('have.attr', 'data-state', 'open')

      // select a _different_ category than before, by reverting selection condition (!== vs ===)
      const breadcrumbSelection: string = categorySelection !== 'random' ? dummyCategories[Math.floor(Math.random() * dummyCategories.length)] : 'all'

      // check drop-down-menu category options
      cy.get('[data-slot="dropdown-menu-content"]')
        .should('exist')
        .and('be.visible')
        .children()
        .should('have.length', dummyCategories.length + 1)
        .parent({ log: false })
        .children(`[data-category="${breadcrumbSelection}"]`)
        .should('exist')
        .click()

      cy.url({ timeout: 5 * 1000 }).should('eq', `${baseURL}/checks/${dummyCheck.share_key}/practice?category=${breadcrumbSelection === 'all' ? '_none_' : breadcrumbSelection}`)
      cy.wait(250)

      cy.get('#practice-question-steps')
        .children()
        .should('have.length', breadcrumbSelection === 'all' ? dummyCheck.questions.length : dummyCheck.questions.filter((q) => q.category === breadcrumbSelection).length)
    }),
  )

  it('Verify that category-selection is re-apply using searchParams', () => {
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

    const randomSelection = dummyCategories[Math.floor(Math.random() * dummyCategories.length)]
    cy.get('#category-selection').children(`[data-category="${randomSelection}"]`).should('exist').click()

    cy.url({ timeout: 5 * 1000 }).should('eq', `${baseURL}/checks/${dummyCheck.share_key}/practice?category=${randomSelection}`)

    cy.get('#practice-question-steps')
      .children()
      .should('have.length', dummyCheck.questions.filter((q) => q.category === randomSelection).length)

    cy.wait(500)
    cy.reload()
    cy.url({ timeout: 5 * 1000 }).should('eq', `${baseURL}/checks/${dummyCheck.share_key}/practice?category=${randomSelection}`)
    cy.get('#practice-question-steps')
      .children()
      .should('have.length', dummyCheck.questions.filter((q) => q.category === randomSelection).length)
  })
})
