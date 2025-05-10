import { DragDropQuestion } from '@/src/schemas/QuestionSchema'

describe('Check: Drag Drop Question -', () => {
  beforeEach(() => {
    cy.signUp('testuser', 'user@email.com', 'testpassword')
    cy.visit('/checks/create')

    cy.get("[data-slot='dialog-trigger']").should('exist').contains('Create Question').click()
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'open')
  })

  afterEach(() => {
    cy.removeDBUser('user@email.com', 'testuser')
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

  it('Verify that drag-drop answers can be re-ordered', () => {
    const { question, points, type, answers }: Partial<DragDropQuestion> = {
      question: 'Please arrange the following cities in order of their population size:',
      points: 5,
      type: 'drag-drop',
      answers: [
        { answer: 'Sao Paulo', position: 4 },
        { answer: 'Delhi', position: 2 },
        { answer: 'Shanghai', position: 3 },
        { answer: 'Tokyo', position: 1 },
      ],
    }

    cy.get("input[name='question']").clear().type(question)
    cy.get("input[name='points']").clear().type(points.toString())

    cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
    cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${type}"]`).click()

    for (let i = 0; i < answers.length; i++) {
      cy.get(`#question-answers * input[name='answers.${i}.answer']`).should('exist').clear().type(answers[i].answer)
    }

    for (let i = 0; i < answers.length; i++) {
      cy.get(`#question-answers * input[name$='.answer']`)
        .filter((k, el: HTMLInputElement) => {
          return el.value === answers[i].answer
        })
        .should('have.value', answers[i].answer)
        .parent()
        .find(`input[name$='.position']`)

        .invoke('val')
        .then((val) => {
          const moves = Number(val) - answers[i].position
          const direction = moves < 0 ? 'down' : 'up'
          cy.log(`Moving element: ${Math.abs(moves)} ${direction}`)

          for (let j = 0; j < Math.abs(moves); j++) {
            cy.log(`Moving ${answers[i].answer} ${direction}`)
            cy.get(`#question-answers * input[name$='.answer']`)
              .filter((k, el: HTMLInputElement) => {
                return el.value === answers[i].answer
              })
              .should('have.value', answers[i].answer)
              .parent()
              .find(`button[aria-label='move answer ${direction}']`)
              .click()
            cy.wait(500)
          }
        })
      cy.get(`#question-answers * input[name='answers.${answers[i].position - 1}.answer']`)
        .should('exist')
        .invoke('val')
        .should('eq', answers[i].answer)

      cy.get(`#question-answers * input[name='answers.${answers[i].position - 1}.position']`)
        .should('exist')
        .invoke('val')
        .then((pos) => Number(pos))
        .should('eq', answers[i].position)
    }

    cy.get("#question-dialog * button[type='submit']").should('exist').click({ force: true })
    cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
  })
})
