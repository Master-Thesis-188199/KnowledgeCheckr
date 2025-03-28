import React from 'react'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion } from '@/schemas/QuestionSchema'
import DisplayQuestion from '@/components/check/DisplayQuestion'

function verifyQuestionAndAnswerShown({ question, answers }: Pick<ChoiceQuestion, 'question' | 'answers'> | Pick<DragDropQuestion, 'question' | 'answers'>) {
  cy.get('.question').should('exist')
  cy.get('.question').contains(question).should('be.visible')
  cy.get('.answers').children().should('have.length', answers.length)

  for (const { answer } of answers) {
    cy.get('.question').contains(answer).should('be.visible')
  }
}

describe('<DisplayQuestion />', () => {
  it('Verify single choice question - only one answer can be selected at once', () => {
    const question: ChoiceQuestion = {
      id: '10',
      type: 'single-choice',
      points: 5,
      category: 'general',
      question: 'What is the capital of France?',
      answers: [
        { answer: 'Paris', correct: true },
        { answer: 'London', correct: false },
        { answer: 'Berlin', correct: false },
        { answer: 'Madrid', correct: false },
      ],
    }

    cy.mount(<DisplayQuestion {...question} />)
    verifyQuestionAndAnswerShown({ question: question.question, answers: question.answers })

    cy.get('.question').contains(question.answers.at(0)!.answer).click()
    cy.get('.question').contains(question.answers.at(0)!.answer).children().should('be.checked')

    cy.get('.question').contains(question.answers.at(1)!.answer).click()
    cy.get('.question').contains(question.answers.at(1)!.answer).children().should('be.checked')

    // verify that the first answer is unchecked (single-choice
    cy.get('.question').contains(question.answers.at(0)!.answer).children().should('not.be.checked')
  })

  it('Verify multiple choice question - multiple answers can be selected at once', () => {
    const question: ChoiceQuestion = {
      id: '10',
      type: 'multiple-choice',
      points: 5,
      category: 'general',
      question: 'What are the colors of the French flag?',
      answers: [
        { answer: 'Red', correct: true },
        { answer: 'White', correct: true },
        { answer: 'Blue', correct: true },
        { answer: 'Green', correct: false },
      ],
    }

    cy.mount(<DisplayQuestion {...question} />)
    verifyQuestionAndAnswerShown({ question: question.question, answers: question.answers })

    cy.get('.question').contains(question.answers.at(0)!.answer).click()
    cy.get('.question').contains(question.answers.at(0)!.answer).children().should('be.checked')

    cy.get('.question').contains(question.answers.at(1)!.answer).click()
    cy.get('.question').contains(question.answers.at(1)!.answer).children().should('be.checked')

    cy.get('.question').contains(question.answers.at(2)!.answer).click()
    cy.get('.question').contains(question.answers.at(2)!.answer).children().should('be.checked')
  })

  it('Verify drag and drop question - answers can be reordered', () => {
    const question: DragDropQuestion = {
      id: '10',
      type: 'drag-drop',
      points: 5,
      category: 'general',
      question: 'Put the following activities in order of occurrence',
      answers: [
        { answer: 'Waking up early', position: 1 },
        { answer: 'Brushing teeth', position: 2 },
        { answer: 'Going to bed', position: 4 },
        { answer: 'Eating breakfast', position: 3 },
      ],
    }

    cy.mount(<DisplayQuestion {...question} />)

    verifyQuestionAndAnswerShown({ question: question.question, answers: question.answers })

    cy.get('.question').contains(question.answers.at(0)!.answer)
    cy.get('.question').contains(question.answers.at(0)!.answer).parent().children().get('.current-position').should('include.text', '1')

    const dragAndDrop = (dragLocator: Cypress.Chainable<JQuery<HTMLElement>>, dropLocator: Cypress.Chainable<JQuery<HTMLElement>>) => {
      dragLocator.realMouseDown({ button: 'left', position: 'center' }).realMouseMove(0, 10, { position: 'center' }).wait(200)
      dropLocator.realMouseMove(0, 0, { position: 'center' }).realMouseUp()
    }

    // Switch Answer 1 with Answer 2
    dragAndDrop(cy.get('.question').contains(question.answers.at(0)!.answer).parent(), cy.get('.question').contains(question.answers.at(1)!.answer).parent())
    cy.get('.question').contains(question.answers.at(0)!.answer).parent().children('.current-position').should('include.text', '2')
    cy.get('.question').contains(question.answers.at(1)!.answer).parent().children('.current-position').should('include.text', '1')
  })

  it('Verify open question - answer can be typed in', () => {
    const question: OpenQuestion = {
      id: '10',
      type: 'open-question',
      points: 5,
      category: 'general',
      question: 'What is the capital of France?',
      expectation: 'Paris',
    }

    cy.mount(<DisplayQuestion {...question} />)

    cy.get('.question').should('exist')
    cy.get('.question').contains(question.question).should('be.visible')

    cy.get('textarea').should('be.visible')

    cy.get('textarea').type(question.expectation!, { delay: 10 })
    cy.get('.question textarea', { timeout: 2000 }).should('have.value', question.expectation)
  })
})
