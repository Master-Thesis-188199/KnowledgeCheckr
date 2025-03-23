import React from 'react'
import { ChoiceQuestion } from '@/schemas/QuestionSchema'
import DisplayQuestion from '@/components/check/DisplayQuestion'

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

    cy.get('.question').should('exist')
    cy.get('.question').contains(question.question).should('be.visible')
    cy.get('.question').children().get('.answers').children().should('have.length', question.answers.length)

    for (const { answer } of question.answers) {
      cy.get('.question').contains(answer).should('be.visible')
    }

    cy.get('.question').contains(question.answers.at(0)!.answer).click()
    cy.get('.question').contains(question.answers.at(0)!.answer).children().should('be.checked')

    cy.get('.question').contains(question.answers.at(1)!.answer).click()
    cy.get('.question').contains(question.answers.at(1)!.answer).children().should('be.checked')

    // verify that the first answer is unchecked (single-choice
    cy.get('.question').contains(question.answers.at(0)!.answer).children().should('not.be.checked')
  })
})
