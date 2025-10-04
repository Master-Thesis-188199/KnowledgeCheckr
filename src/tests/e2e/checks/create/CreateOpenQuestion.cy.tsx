import { OpenQuestion } from '@/src/schemas/QuestionSchema'

describe('Check: Open Question -', () => {
  beforeEach(() => {
    cy.loginTestUser()
    cy.visit('/checks/create')

    //* Switch to questions-stage
    cy.get('#multi-stage-list-parent').children().filter(':visible').should('have.length', 1).contains('Questions').click()

    cy.get("[data-slot='dialog-trigger']").should('exist').contains('Create Question').click()
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'open')
  })

  it('Verify that a open question can be added when the optional "expectation" inputs is given', () => {
    const { question, points, type, expectation }: Partial<OpenQuestion> = {
      question: 'What are the four most populous cities in the world?',
      points: 5,
      type: 'open-question',
      expectation: 'Tokyo, Delhi, Shanghai, São Paulo',
    }

    cy.get("input[name='question']").clear().type(question)
    cy.get("input[name='points']").clear().type(points.toString())

    cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
    cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${type}"]`).click()

    cy.get("input[name='expectation']").clear().type(expectation.toString())

    cy.get("#question-dialog * button[type='submit']").should('exist').click({ force: true })

    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
  })

  it('Verify that a open question can be added when the optional "expectation" inputs is missing', () => {
    const { question, points, type }: Partial<OpenQuestion> = {
      question: 'What are the four most populous cities in the world?',
      points: 5,
      type: 'open-question',
    }

    cy.get("input[name='question']").clear().type(question)
    cy.get("input[name='points']").clear().type(points.toString())

    cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
    cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${type}"]`).click()

    cy.get("#question-dialog * button[type='submit']").should('exist').click({ force: true })

    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
  })
})
