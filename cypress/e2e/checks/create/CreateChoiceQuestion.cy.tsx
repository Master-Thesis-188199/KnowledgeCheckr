import { ChoiceQuestion } from '@/src/schemas/QuestionSchema'

describe('Check: Create Choice Question -', () => {
  beforeEach(() => {
    cy.visit('/checks/create')

    cy.get("[data-slot='dialog-trigger']").should('exist').contains('Create Question').click()
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'open')
  })

  it('Verify that a choice question can be added when the inputs are valid', () => {
    const { question, points, type, answers }: Partial<ChoiceQuestion> = {
      question: 'What is the capital of France?',
      points: 5,
      type: 'single-choice',
      answers: [
        { answer: 'Berlin', correct: false },
        { answer: 'Paris', correct: true },
        { answer: 'Madrid', correct: false },
        { answer: 'Rome', correct: false },
      ],
    }

    cy.get("input[name='question']").clear().type(question)
    cy.get("input[name='points']").clear().type(points.toString())

    cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
    cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${type}"]`).click()

    for (let i = 0; i < answers.length; i++) {
      cy.get(`#question-answers * input[name='answers.${i}.answer']`).should('exist').clear().type(answers[i].answer)

      cy.get(`#question-answers * input[name='answers.${i}.correct']`)
        .should('exist')
        .then((val) => {
          if (val.is(':checked') && !answers[i].correct) {
            // Uncheck
            cy.get(`#question-answers * input[name='answers.${i}.correct']`).should('exist').parent().click()
          } else if (val.is(':not(:checked)') && answers[i].correct) {
            // Check
            cy.get(`#question-answers * input[name='answers.${i}.correct']`).should('exist').parent().click()
          }
        })
    }

    cy.get("#question-dialog * button[type='submit']").should('exist').click({ force: true })

    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
  })

  it('Verify that errors are displayed when the inputs are invalid', () => {
    const { question, points, type, answers }: Partial<ChoiceQuestion> = {
      question: 'Invalid Question',
      points: -5,
      type: 'multiple-choice',
      answers: [
        { answer: 'Duplicate', correct: false },
        { answer: 'Duplicate', correct: false },
        { answer: 'Madrid', correct: false },
        { answer: 'Rome', correct: false },
      ],
    }

    cy.get("input[name='question']").clear().type(question)
    cy.get("input[name='points']").clear().type(points.toString())

    cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
    cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${type}"]`).click()

    for (let i = 0; i < answers.length; i++) {
      cy.get(`#question-answers * input[name='answers.${i}.answer']`).should('exist').clear().type(answers[i].answer)

      cy.get(`#question-answers * input[name='answers.${i}.correct']`)
        .should('exist')
        .then((val) => {
          if (val.is(':checked') && !answers[i].correct) {
            // Uncheck
            cy.get(`#question-answers * input[name='answers.${i}.correct']`).should('exist').parent().click()
          } else if (val.is(':not(:checked)') && answers[i].correct) {
            // Check
            cy.get(`#question-answers * input[name='answers.${i}.correct']`).should('exist').parent().click()
          }
        })
    }

    cy.get("#question-dialog * button[type='submit']").should('exist').click({ force: true })

    // Check for error messages
    cy.get('#question-dialog * div[aria-label="field-error-question"]').should('exist').contains('Please reformulate your question to be at least 3 words long.')
    cy.get('#question-dialog * div[aria-label="field-error-points"]').should('exist').contains('Number must be greater than 0')
    cy.get('#question-dialog * div[aria-label="field-error-answers.root"]').should('exist').contains('At least one answer has to be correct!')
  })

  it('Verify that answers can be added and removed', () => {
    cy.get('#question-answers').should('exist')

    cy.get('#question-answers * input[name$=".answer"]')
      .filter(':visible')
      .its('length')
      .then((count) => {
        for (let i = 0; i < count; i++) {
          cy.get(`#question-answers * button[aria-label='delete answer']`).last().click({ force: true })
        }
      })

    cy.get('#question-answers * input').should('not.exist')

    const addedQuestionCount = 3
    for (let i = 0; i < addedQuestionCount; i++) {
      cy.get('#question-answers > button[aria-label="Add Answer"]').click({ force: true })
    }
    cy.get('#question-answers * input[name$=".answer"]').filter(':visible').should('have.length', addedQuestionCount)
  })
})
