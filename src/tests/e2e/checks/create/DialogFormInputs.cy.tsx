import { DragDropQuestion, instantiateDragDropQuestion, instantiateMultipleChoice, instantiateOpenQuestion, instantiateSingleChoice, Question, SingleChoice } from '@/src/schemas/QuestionSchema'

/**
 * This helper function creates / adds a new question by opening the `CreateQuestionDialog` entering question specific values and then submitting the form by clicking "Add Question".
 * @param question The question that is to be inserted.
 */
function createQuestion({ question, points, ...rest }: Question) {
  cy.get("[data-slot='dialog-trigger']").should('exist').contains('Create Question').click()
  cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'open')

  cy.get("input[name='question']").clear().type(question)
  cy.get("input[name='points']").clear().type(points.toString())

  cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
  cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${rest.type}"]`).click()

  if (rest.type !== 'open-question') {
    for (let i = 0; i < rest.answers.length; i++) {
      if (rest.type === 'drag-drop') {
        cy.get(`#question-answers * input[name='answers.${i}.answer']`).should('exist').clear().type(rest.answers[i].answer)
      } else if (rest.type === 'single-choice' || rest.type === 'multiple-choice') {
        cy.get(`#question-answers * input[name='answers.${i}.answer']`).should('exist').clear().type(rest.answers[i].answer)
      } else {
        throw new Error('Unhandled question-type')
      }
    }
  } else if (rest.expectation) {
    cy.get('#question-answers input[id="expectation"]').should('exist').and('be.visible').type(rest.expectation)
  }

  cy.get("#question-dialog * button[type='submit']").should('exist').click({ force: true })

  cy.get("[data-slot='dialog-trigger']").contains('Create Question').should('have.attr', 'data-state', 'closed')
}

/**
 * This helper function essentially verifies that a respective question is displayed within the `QuestionsSection` after it was added by the CreateQuestionDialog.
 * @param question The respective question whoose existance should be verified.
 */
function verifyQuestionExistance(question: Question) {
  cy.get(`.question[data-question="${question.question}"]`).should('have.length', 1)
  cy.get(`.question[data-question="${question.question}"]`).children('.header').contains(question.type).should('exist').and('be.visible')
}
type KeysOfUnion<T> = T extends T ? keyof T : never
type VerifyEditMenuOptions = {
  editAction_BeforeValidation?: () => void
  editAction_AfterValidation?: () => void
  validateProps?: {
    [key in Exclude<KeysOfUnion<Question>, 'id' | 'category'>]?: boolean
  }
}

/**
 * This helper function essentially opens the `edit` dialog of a given question.
 * It then starts to validate that the dialog displays the properties of the question correctly (`type`, `question`, `points`, `answers`, `expectation`).
 * @param question The question for which the `edit` dialog is to be opened and that is to be validated.
 * @param options.editAction_BeforeValidation When provided this function will be called before the question is validated to make modification beforehand.
 * @param options.editAction_AfterValidation When provided this function will be called after the question was vaidated, but before the dialog is closed again.
 * @param options.validateProps Defines which props the helper function should validate in regard to the current question. Default `question, points, type`
 */
function verifyOpenCloseEditMenu(
  question: Question,
  { editAction_AfterValidation, editAction_BeforeValidation, validateProps = { question: true, points: true, type: true } }: VerifyEditMenuOptions = {},
): void {
  cy.get('#question-dialog').should('not.exist')

  // open edit dialog
  cy.get(`.question[data-question="${question.question}"] [data-slot="dialog-trigger"]`).should('exist').click().should('have.attr', 'data-state', 'open')

  if (editAction_BeforeValidation) editAction_BeforeValidation()

  cy.get('#question-dialog input[id="question"]').should('have.value', question.question)
  cy.get('#question-dialog input[id="points"]').should('have.value', question.points)
  cy.get('#question-dialog button[data-slot="popover-trigger"][aria-label="popover-trigger-type"]').should('have.text', question.type)

  if (validateProps.answers && (question.type === 'multiple-choice' || question.type === 'single-choice' || question.type === 'drag-drop')) {
    for (const answer of question.answers) {
      cy.get(`#question-dialog input[name='answers.${question.answers.findIndex((a) => a.id === answer.id)}.answer']`)
        .should('exist')
        .and('be.visible')
        .should('have.value', answer.answer)
    }
  } else if (question.type === 'open-question' && validateProps.expectation) {
    cy.get(`#question-dialog input[name='expectation']`).should('exist').and('be.visible').should('have.value', question.expectation)
  }

  if (editAction_AfterValidation) editAction_AfterValidation()

  // close edit dialog
  cy.get('[data-slot="dialog-overlay"]').should('exist').and('have.attr', 'data-state', 'open').click({ force: true })
}

// --------------------------------- TESTS -------------------------------

const dummyQuestions = [
  { ...instantiateMultipleChoice(), question: 'This is a multiple-choice question' },
  { ...instantiateSingleChoice(), question: 'This is a single-choice question' },
  { ...instantiateDragDropQuestion(), question: 'This is a drag-drop question' },
  { ...instantiateOpenQuestion(), question: 'This is an open-question question' },
]

describe('Verify behavior of CreateQuestionDialog: ', { viewportHeight: 980 }, () => {
  beforeEach(() => {
    cy.loginAnonymously()

    cy.visit('/checks/create')
    cy.get('#multi-stage-list-parent').children().filter(':visible').should('have.length', 1).children('li[data-stage-name="questions"]').should('exist').and('be.visible').click()

    for (const question of dummyQuestions) {
      createQuestion(question)
      verifyQuestionExistance(question)
    }
  })

  it('Verify that form-inputs are properly displayed when rapidly edit-dialog is rapidly opened / closed and question-type is modified without submission', () => {
    //* Specify which properties should be validated within the edit dialog.
    const validateProps: VerifyEditMenuOptions['validateProps'] = {
      points: true,
      question: true,
      type: true,

      // the answers are not validated because
      answers: false,
      expectation: false,
    }

    //* Rapid opening and closure of edit menu's while changing the type (without submission)
    for (const question of dummyQuestions) {
      //* ensure edit dialog displays correct information even if rapid open-closures
      for (let i = 0; i < 2; i++) {
        cy.get(`.question[data-question="${question.question}"]`).should('have.length', 1)

        let compatible: Question['type'] | null = 'drag-drop'

        switch (question.type) {
          case 'single-choice':
            compatible = 'drag-drop'
            break
          case 'multiple-choice':
            compatible = 'drag-drop'
            break
          case 'open-question':
            compatible = null
            break
          case 'drag-drop':
            compatible = 'single-choice'
            break

          default:
            compatible = null
            break
        }

        if (compatible === null) {
          cy.log(`Skipping question type '${question.type}' (${question.question}) because it has no compatible type to switch between.`)
          continue
        }

        verifyOpenCloseEditMenu(question, {
          editAction_AfterValidation: () => {
            //* change question-type but don't save
            cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
            cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${compatible}"]`).click()
            cy.get('#question-dialog button[data-slot="popover-trigger"][aria-label="popover-trigger-type"]').should('have.text', compatible)
          },
          validateProps,
        })

        //* Verify that "cached" form inputs are shown when re-opening dialog
        verifyOpenCloseEditMenu(
          // @ts-expect-error type-mismatch the question either misses the correct property for the overriden choice-question or the position for the overriden drag-drop question. However, it only uses the type verify the answer-texts and the question-type itself.
          { ...question, type: compatible },
          {
            editAction_AfterValidation: () => {
              // change back to original question-type
              cy.log(`Change back to original question type (${question.type})`)
              cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
              cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${question.type}"]`).click()
              cy.get('#question-dialog button[data-slot="popover-trigger"][aria-label="popover-trigger-type"]').should('have.text', question.type)
            },
            validateProps,
          },
        )
      }
    }
  })

  it('Verify that form-inputs are persisent when dialog is closed and re-opened for same question', () => {
    //* Specify which properties should be validated within the edit dialog.
    const validateProps: VerifyEditMenuOptions['validateProps'] = {
      points: true,
      question: true,
      type: true,

      // the answers are not validated because
      answers: false,
      expectation: false,
    }

    //* Switch a couple of times between two different questions and modify their type (without submission)
    for (let i = 0; i < 2; i++) {
      const singleChoiceQuestion = dummyQuestions.find((q) => q.type === 'single-choice')!
      const dragDropQuestion = dummyQuestions.find((q) => q.type === 'drag-drop')!

      const dragType: DragDropQuestion['type'] = 'drag-drop'
      const choiceType: SingleChoice['type'] = 'single-choice'

      verifyOpenCloseEditMenu(singleChoiceQuestion, {
        editAction_AfterValidation: () => {
          //* change question-type but don't save
          cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
          cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${dragType}"]`).click()
          cy.get('#question-dialog button[data-slot="popover-trigger"][aria-label="popover-trigger-type"]').should('have.text', dragType)
        },
        validateProps,
      })
      verifyOpenCloseEditMenu(
        // @ts-expect-error type-mismatch the question either misses the correct property for the overriden choice-question or the position for the overriden drag-drop question. However, it only uses the type verify the answer-texts and the question-type itself.
        { ...singleChoiceQuestion, type: dragType },
        {
          validateProps,
        },
      )

      verifyOpenCloseEditMenu(dragDropQuestion, {
        editAction_AfterValidation: () => {
          //* change question-type but don't save
          cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
          cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${choiceType}"]`).click()
          cy.get('#question-dialog button[data-slot="popover-trigger"][aria-label="popover-trigger-type"]').should('have.text', choiceType)
        },
        validateProps,
      })
      // @ts-expect-error type-mismatch the question either misses the correct property for the overriden choice-question or the position for the overriden drag-drop question. However, it only uses the type verify the answer-texts and the question-type itself.
      verifyOpenCloseEditMenu({ ...dragDropQuestion, type: choiceType })

      //* Verify that "cached" form inputs are displayed for the correct question; after change-back to original type
      verifyOpenCloseEditMenu(
        // @ts-expect-error type-mismatch the question either misses the correct property for the overriden choice-question or the position for the overriden drag-drop question. However, it only uses the type verify the answer-texts and the question-type itself.
        { ...singleChoiceQuestion, type: dragType },
        {
          editAction_AfterValidation: () => {
            // change back to original question type
            cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
            cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${singleChoiceQuestion.type}"]`).click()
            cy.get('#question-dialog button[data-slot="popover-trigger"][aria-label="popover-trigger-type"]').should('have.text', singleChoiceQuestion.type)
          },
          validateProps,
        },
      )
      verifyOpenCloseEditMenu(
        // @ts-expect-error type-mismatch the question either misses the correct property for the overriden choice-question or the position for the overriden drag-drop question. However, it only uses the type verify the answer-texts and the question-type itself.
        { ...dragDropQuestion, type: choiceType },
        {
          editAction_AfterValidation: () => {
            // change back to original question type
            cy.get("input[name='type'] + button[aria-label='popover-trigger-type']").click()
            cy.get(`[aria-label="popover-content-type"] * div[data-slot="command-item"][data-value="${dragDropQuestion.type}"]`).click()
            cy.get('#question-dialog button[data-slot="popover-trigger"][aria-label="popover-trigger-type"]').should('have.text', dragDropQuestion.type)
          },
          validateProps,
        },
      )
    }
  })
})
