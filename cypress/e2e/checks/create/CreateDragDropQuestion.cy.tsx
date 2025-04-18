import { DragDropQuestion } from '@/src/schemas/QuestionSchema'

describe('Check: Drag Drop Question -', () => {
  beforeEach(() => {
    cy.visit('/checks/create')

    cy.get("[data-slot='dialog-trigger']").should('exist').contains('Create Question').click()
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'open')
  })

  it('Verify that a drag-drop question can be added when the inputs are valid', () => {
    const { question, points, type, answers }: Partial<DragDropQuestion> = {
      question: 'Please arrange the following cities in order of their population size:',
      points: 5,
      type: 'drag-drop',
      answers: [
        { answer: 'Tokyo', position: 1 },
        { answer: 'Delhi', position: 2 },
        { answer: 'Shanghai', position: 3 },
        { answer: 'São Paulo', position: 4 },
      ],
    }

    cy.get("input[name='question']").clear().type(question)
    cy.get("input[name='points']").clear().type(points.toString())

    cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
    cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${type}"]`).click()

    for (let i = 0; i < answers.length; i++) {
      cy.get(`#question-answers * input[name='answers.${i}.answer']`).should('exist').clear().type(answers[i].answer)
      cy.get(`#question-answers * input[name='answers.${i}.position']`).should('exist').should('have.value', answers[i].position)
    }

    cy.get("#question-dialog * button[type='submit']").should('exist').click({ force: true })

    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
  })
})
