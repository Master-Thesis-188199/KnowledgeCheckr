import { PracticeFeedback, PracticeFeedbackServerState } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { generateToken } from '@/src/lib/Shared/generateToken'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import {
  DragDropQuestion,
  instantiateDragDropQuestion,
  instantiateMultipleChoice,
  instantiateOpenQuestion,
  instantiateSingleChoice,
  MultipleChoice,
  OpenQuestion,
  Question,
  SingleChoice,
} from '@/src/schemas/QuestionSchema'

describe('RenderPracticeQuestion Test Suite', { viewportWidth: 1280, viewportHeight: 900 }, () => {
  const insertKnowledgeCheck = (question: Question) => {
    const check = {
      ...instantiateKnowledgeCheck(),
      share_key: generateToken(16),
      questions: [question],
    }

    cy.request('POST', '/api/insert/knowledgeCheck', check).should('have.property', 'status').and('eq', 200)

    return { share_key: check.share_key, check }
  }

  const verifyQuestionIsDisplayedCorrectly = (question: Question, questionCount: number) => {
    cy.get('#practice-form h2').contains(question.question).should('exist').and('be.visible')
    cy.get('#practice-form ').should('exist').should('have.attr', 'data-question-type', question.type).and('have.attr', 'data-question-id', question.id)
    cy.get('#practice-question-steps').should('exist').children().should('have.length', questionCount)

    switch (question.type) {
      case 'single-choice':
        cy.get('#answer-options').children().should('have.length', question.answers.length)
        break
      case 'multiple-choice':
        cy.get('#answer-options').children().should('have.length', question.answers.length)
        break
      case 'open-question':
        cy.get('#answer-options').children().should('have.length', 1)
        break
      case 'drag-drop':
        cy.get('#answer-options div[data-swapy-item]').should('have.length', question.answers.length)
        break
    }
  }

  const validateFeedback = <Q extends Question = SingleChoice>(requestAlias: string, callback: (feedback: Extract<PracticeFeedback, { type: Q['type'] }> | undefined) => void) => {
    cy.waitServerAction<PracticeFeedbackServerState>(requestAlias, (body, response) => {
      expect(response?.statusCode).to.eq(200)
      expect(body).to.have.property('success')
      expect(body?.success).to.equal(true)

      const feedback = body?.feedback as Extract<PracticeFeedback, { type: Q['type'] }> | undefined

      callback(feedback)
    })
  }

  beforeEach(() => {
    cy.loginTestUser()
  })
  ;([{ type: 'correct' }, { type: 'incorrect' }] as const).forEach(({ type }) =>
    it(`Verify that users can answer and submit single-choice question, and that feedback is displayed correctly when answered ${type}ly`, () => {
      const question = {
        ...instantiateSingleChoice(),
        question: 'What does the acronym RGB stand for?',
        answers: [
          { id: getUUID(), answer: 'Red Green Blue', correct: true },
          { id: getUUID(), answer: 'Red Orange Yellow', correct: false },
          { id: getUUID(), answer: 'Blue Orange Fuchsia', correct: false },
          { id: getUUID(), answer: 'Rose Green Baige', correct: false },
        ],
      }

      const selectionAnswerId = question.answers.filter((a) => (type === 'correct' ? a.correct : !a.correct)).at(0)!.id

      const {
        share_key,
        check: { questions },
      } = insertKnowledgeCheck(question)

      cy.visit(`/checks/${share_key}/practice`)

      verifyQuestionIsDisplayedCorrectly(question, questions.length)
      cy.simulatePracticeSelection(question, { selection: selectionAnswerId })

      cy.intercept('POST', `/checks/${share_key}/practice`).as('submit-request')
      cy.get('button').contains('Check Answer').click()

      validateFeedback<typeof question>('@submit-request', (feedback) => {
        expect(feedback?.type).to.equal(question.type)

        if (type === 'correct') expect(feedback?.solution).to.equal(selectionAnswerId)
        else expect(feedback?.solution).to.not.equal(selectionAnswerId)
      })

      cy.get('button').contains('Continue').should('exist').and('be.visible')

      cy.get(`#answer-options input[id="${selectionAnswerId}"]`)
        .should('have.attr', 'data-evaluation-result', type === 'correct' ? 'correct' : 'incorrect')
        .should('be.disabled')

      if (type === 'incorrect') {
        cy.get(`#answer-options input[id="${question.answers.find((a) => a.correct)!.id}"]`)
          .should('have.attr', 'data-evaluation-result', 'missing')
          .should('be.disabled')
      }

      cy.get('.result-legend').should('exist').and('be.visible')
    }),
  )

  it('Verify that users can answer and submit multiple-choice question, and that feedback is displayed correctly when answered correctly', () => {
    const question = {
      ...instantiateMultipleChoice(),
      question: 'What statements are correct?',
      answers: [
        { id: getUUID(), answer: 'The earth is flat', correct: false },
        { id: getUUID(), answer: 'The earth is round', correct: true },
        { id: getUUID(), answer: 'Birds can fly', correct: true },
        { id: getUUID(), answer: 'Birds can not fly', correct: false },
      ],
    }

    const {
      share_key,
      check: { questions },
    } = insertKnowledgeCheck(question)

    const correctAnswerIds = question.answers.filter((a) => a.correct).map((a) => a.id)

    cy.visit(`/checks/${share_key}/practice`)

    verifyQuestionIsDisplayedCorrectly(question, questions.length)

    cy.simulatePracticeSelection(question, { selection: correctAnswerIds })

    cy.intercept('POST', `/checks/${share_key}/practice`).as('submit-request')
    cy.get('button').contains('Check Answer').click()

    validateFeedback<typeof question>('@submit-request', (feedback) => {
      expect(feedback?.type).to.equal(question.type)
      expect(feedback?.solution.sort().join(',')).to.equal(correctAnswerIds.sort().join(','))
    })

    cy.get('button').contains('Continue').should('exist').and('be.visible')
    for (const id of correctAnswerIds) {
      cy.get(`#answer-options input[id="${id}"]`).should('have.attr', 'data-evaluation-result', 'correct').should('be.disabled')
    }

    cy.get('.result-legend').should('exist').and('be.visible')
  })

  it('Verify that users can answer and submit drag-drop question, and that feedback is displayed correctly when answered correctly', () => {
    const question: DragDropQuestion = {
      ...instantiateDragDropQuestion(),
      question: 'Please arrange these statements in their correct order',
      answers: [
        { id: getUUID(), answer: 'A', position: 0 },
        { id: getUUID(), answer: 'B', position: 1 },
        { id: getUUID(), answer: 'C', position: 2 },
        { id: getUUID(), answer: 'D', position: 3 },
      ],
    }

    const correctlySortedAnswerIds = question.answers.toSorted((a, b) => a.position - b.position).map((a) => a.id)

    const {
      share_key,
      check: { questions },
    } = insertKnowledgeCheck(question)

    cy.visit(`/checks/${share_key}/practice`)

    verifyQuestionIsDisplayedCorrectly(question, questions.length)

    cy.simulatePracticeSelection(question, { selection: correctlySortedAnswerIds })

    cy.intercept('POST', `/checks/${share_key}/practice`).as('submit-request')
    cy.get('button').contains('Check Answer').click()

    validateFeedback<typeof question>('@submit-request', (feedback) => {
      expect(feedback?.type).to.equal(question.type)
      expect(feedback?.solution.join(',')).to.equal(correctlySortedAnswerIds.join(','))
    })

    cy.get('button').contains('Continue').should('exist').and('be.visible')
    cy.get(`#answer-options * div[data-swapy-item]`).should('have.attr', 'data-evaluation-result', 'correct')
    cy.get('#answer-options').children().should('have.attr', 'data-enabled', 'false')

    cy.get('.drag-drop-feedback-indicators').should('exist').and('be.visible')
  })

  it('Verify that users can answer and submit open-question question, and that feedback is displayed correctly when answered correctly', () => {
    const question: OpenQuestion = {
      ...instantiateOpenQuestion(),
      question: 'What does RGB stand for?',
      expectation: 'correct',
    }

    const {
      share_key,
      check: { questions },
    } = insertKnowledgeCheck(question)

    cy.visit(`/checks/${share_key}/practice`)

    verifyQuestionIsDisplayedCorrectly(question, questions.length)

    cy.simulatePracticeSelection(question, { input: 'correct' })

    cy.intercept('POST', `/checks/${share_key}/practice`).as('submit-request')
    cy.get('button').contains('Check Answer').click()

    validateFeedback<typeof question>('@submit-request', (feedback) => {
      expect(feedback?.type).to.equal(question.type)
    })

    cy.get('button').contains('Continue').should('exist').and('be.visible')
    cy.get(`#answer-options`).children().first().should('have.attr', 'data-evaluation-result', 'correct')
  })

  it('Verify that users can answer & submit correct answers to questions and that their submission is evaluated & displayed correctly', () => {
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
        { ...instantiateMultipleChoice(), question: 'What is a multiple Choice question?' },
        { ...instantiateOpenQuestion(), question: 'What is an open question?' },
        { ...instantiateDragDropQuestion(), question: 'What is an drag-drop question?' },
      ],
    }

    cy.request('POST', '/api/insert/knowledgeCheck', check).should('have.property', 'status').and('eq', 200)
    cy.visit(`/checks/${check.share_key}/practice`)

    cy.get('#practice-question-steps').should('exist').children().should('have.length', check.questions.length)

    for (let i = 0; i < check.questions.length; i++) {
      cy.get('#practice-form h2')
        .should('exist')
        .invoke('text')
        .then((questionText) => {
          expect(check.questions.some((q) => q.question === questionText)).to.be.eq(true)

          const question = check.questions.find((q) => q.question === questionText)!

          verifyQuestionIsDisplayedCorrectly(question, check.questions.length)

          if (question.type === 'open-question') {
            question.expectation = 'correct' //? causes the feedback-evaluation to set the degreeOfCorrectness to 1 until an LLM is used
          }

          cy.simulatePracticeSelection(question, { correctness: 'correct' })

          cy.intercept('POST', `/checks/${check.share_key}/practice`).as(`submit-request-${question.type}`)
          cy.log(`Checking answer for question-type: ${question.type}`)
          cy.get('button').contains('Check Answer').click()

          cy.waitServerAction<PracticeFeedbackServerState>(`@submit-request-${question.type}`, (body, response) => {
            expect(response?.statusCode).to.eq(200)
            expect(body).to.have.property('success')
            expect(body?.success).to.equal(true)

            const feedback = body?.feedback

            expect(feedback?.type).to.equal(question.type)
            if (question.type === 'single-choice') {
              const singleChoiceFeedback = feedback as Extract<PracticeFeedback, { type: 'single-choice' }>
              expect(singleChoiceFeedback.solution).to.eq(question.answers.filter((a) => a.correct).at(0)!.id)
            } else if (question.type === 'multiple-choice') {
              const multipleChoiceFeedback = feedback as Extract<PracticeFeedback, { type: 'multiple-choice' }>
              expect(multipleChoiceFeedback.solution.join(',')).to.eq(
                question.answers
                  .filter((a) => a.correct)
                  .map((a) => a.id)
                  .join(','),
              )
            } else if (question.type === 'drag-drop') {
              const dragDropFeedback = feedback as Extract<PracticeFeedback, { type: 'drag-drop' }>
              expect(dragDropFeedback.solution.join(',')).to.eq(
                question.answers
                  .toSorted((a, b) => a.position - b.position)
                  .map((a) => a.id)
                  .join(','),
              )
            } else if (question.type === 'open-question') {
              const openQuestionFeedback = feedback as Extract<PracticeFeedback, { type: 'open-question' }>
              expect(openQuestionFeedback.degreeOfCorrectness).to.eq(1)
            }
          })

          cy.get('button').contains('Continue').should('exist').and('be.visible')

          if (question.type === 'single-choice' || question.type === 'multiple-choice') {
            cy.get('.result-legend').should('exist').and('be.visible')
            for (const ans of question.answers.filter((a) => a.correct)) {
              cy.get('#answer-options').contains(ans.answer).children('input').should('have.attr', 'data-evaluation-result', 'correct').should('be.disabled')
            }
          } else if (question.type === 'drag-drop') {
            cy.get("div[data-evaluation-result='correct']").should('have.length', question.answers.length)
          } else if (question.type === 'open-question') {
            cy.get('#answer-options').children().should('have.attr', 'data-evaluation-result', 'correct')
          }

          cy.wait(500)
          cy.get('button').contains('Continue').click()
        })
    }
  })
})
