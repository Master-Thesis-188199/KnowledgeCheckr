import { PracticeFeedback, PracticeFeedbackServerState } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { generateToken } from '@/src/lib/Shared/generateToken'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { instantiateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { instantiateSingleChoice, SingleChoice } from '@/src/schemas/QuestionSchema'

describe('RenderPracticeQuestion Test Suite', () => {
  before(() => {
    cy.loginTestUser()
  })
  it('Verify that users can answer and submit single-choice question', () => {
    cy.viewport(1280, 900)

    const check = {
      ...instantiateKnowledgeCheck(),
      share_key: generateToken(16),
      questions: [
        {
          ...instantiateSingleChoice(),
          question: 'What does the acronym RGB stand for?',
          answers: [
            { id: getUUID(), answer: 'Red Green Blue', correct: true },
            { id: getUUID(), answer: 'Red Orange Yellow', correct: false },
            { id: getUUID(), answer: 'Blue Orange Fuchsia', correct: false },
            { id: getUUID(), answer: 'Rose Green Baige', correct: false },
          ],
        },
      ],
    }
    const question = check.questions.at(0)! as SingleChoice
    const correctAnswers = question.answers.filter((a) => a.correct)

    cy.request('POST', '/api/insert/knowledgeCheck', check).should('have.property', 'status').and('eq', 200)
    cy.visit(`/checks/${check.share_key}/practice`)

    cy.get('#practice-question-steps').should('exist').children().should('have.length', check.questions.length)

    cy.get('main h2').contains(question.question).should('exist').and('be.visible')

    cy.get('#answer-options').children().should('have.length', question.answers.length)

    for (const ans of correctAnswers) {
      cy.get('#answer-options').contains(ans.answer).click()
    }

    cy.intercept('POST', `/checks/${check.share_key}/practice`).as('submit-request')
    cy.get('button').contains('Check Answer').click()

    cy.wait('@submit-request').then((interception) => {
      cy.log(JSON.stringify(interception, null, 2))
      const response = interception.response
      const responseBody = response?.body.toString().split('1:').at(1)
      const body = JSON.parse(responseBody) as PracticeFeedbackServerState

      expect(response?.statusCode).to.eq(200)
      expect(body).to.have.property('success')
      expect(body.success).to.equal(true)

      const feedback = body.feedback as Extract<PracticeFeedback, { type: 'single-choice' }> | undefined

      expect(feedback?.type).to.equal(question.type)
      expect(feedback?.solution).to.equal(correctAnswers.map((a) => a.id).join(','))
    })

    cy.get('button').contains('Continue').should('exist').and('be.visible')
    for (const ans of correctAnswers) {
      cy.get('#answer-options').contains(ans.answer).children('input').should('have.attr', 'data-evaluation-result', 'correct').should('be.disabled')
    }

    cy.get('.result-legend').should('exist').and('be.visible')
  })
})
