/// <reference types="cypress" />

import { MultipleChoice, SingleChoice } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('skip', (message = 'Test skipped using cy.skip()', condition: boolean = true) => {
  if (!condition) return

  cy.log(message)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cy.state('runnable').ctx.skip()
})

Cypress.Commands.add('login', (email: string, password: string) => {
  if (!email || !password) {
    cy.log('Skipping signup because username, email or password is not provided')
  }

  cy.visit('/account/login?type=signin')

  cy.get('input[name="email"]').filter(':visible').type(email)
  cy.get('input[name="password"]').filter(':visible').type(password)

  cy.get('button[type="submit"]').filter(':visible').click()
  cy.url().should('equal', `${Cypress.config('baseUrl')}/`)
})

Cypress.Commands.add('signUp', (username: string, email: string, password: string) => {
  if (!username || !email || !password) {
    cy.log('Skipping signup because username, email or password is not provided')
  }

  cy.visit('/account/login?type=signup')

  cy.get('input[name="name"]').filter(':visible').type(username)
  cy.get('input[name="email"]').filter(':visible').type(email)
  cy.get('input[name="password"]').filter(':visible').type(password)

  cy.get('button[type="submit"]').filter(':visible').click()
  cy.url().should('equal', `${Cypress.config('baseUrl')}/`)
})

Cypress.Commands.add('signOut', () => {
  cy.visit('/account')
  const url = String(cy.url())
  if (url === Cypress.config('baseUrl')) {
    cy.log(' Signout Aborted: User is not logged in!')
    return
  }

  cy.get('main * button').contains('Signout').filter(':visible').click()

  cy.url().should('equal', `${Cypress.config('baseUrl')}/account/login`)
})

Cypress.Commands.add('removeDBUser', (email: string, username: string) => {
  cy.task('removeDBUser', { email, username })
})

Cypress.Commands.add('loginTestUser', () => {
  cy.login('test@email.com', 'testpassword')
})

Cypress.Commands.add('dragDrop', (dragLocator, dropLocator) => {
  dragLocator.realHover().realMouseDown({ button: 'left', position: 'center' }).realMouseMove(0, 10, { position: 'center' }).wait(250)
  dropLocator.realMouseMove(0, -10, { position: 'center' }).realMouseUp()
})

Cypress.Commands.add('waitServerAction', (alias, callback) => {
  cy.wait(alias).then((interception) => {
    const actionResponse = interception.response
    const actionResponseBody = actionResponse?.body.toString().split('1:').at(1)
    const body = JSON.parse(actionResponseBody)

    callback(body, actionResponse as Any)
  })
})

Cypress.Commands.add('simulatePracticeSelection', (question, options = {}) => {
  cy.url().should('include', '/practice')
  options.type = question.type
  const { correctness } = options

  if (question.type === 'single-choice') {
    let selection: SingleChoice['answers'][number]['id'] = question.answers.filter((a) => a.correct).at(0)!.id

    if (options.type === 'single-choice' && options.selection) {
      selection = options.selection
    } else if (correctness === 'incorrect') {
      selection = question.answers.filter((a) => !a.correct).at(0)!.id
    }

    cy.get(`#answer-options input[id="${selection}"]`).parent().click()

    return
  }

  if (question.type === 'multiple-choice') {
    let selection: MultipleChoice['answers'][number]['id'][] = question.answers.filter((a) => a.correct).map((a) => a.id)

    if (options.type === 'multiple-choice' && options.selection) selection = options.selection
    else if (correctness === 'incorrect') selection = question.answers.filter((a) => !a.correct).map((a) => a.id)
    else if (correctness === 'all') selection = question.answers.map((a) => a.id)

    for (const id of selection) {
      cy.get(`#answer-options input[id="${id}"]`).parent().click()
    }

    return
  }

  if (question.type === 'drag-drop') {
    const sortedAnswers = question.answers.toSorted((a, b) => a.position - b.position)
    let selection = sortedAnswers.map((a) => a.id)

    if (options.type === 'drag-drop' && options.selection) selection = options.selection
    else if (correctness === 'partly-correct') selection = [selection[1], selection[0], ...selection.slice(2)]
    else if (correctness === 'incorrect') selection.reverse()

    for (const id of selection) {
      cy.dragDrop(
        cy.get(`div[data-swapy-item='${id}']`).should('exist').should('be.visible'),
        cy
          .get('#answer-options')
          .children()
          .children()
          .eq(selection.findIndex((answer_id) => answer_id === id)),
      )
      cy.wait(500)
    }
  }

  if (question.type === 'open-question') {
    let input = question.expectation || 'Correct input is missing'

    if (options.type === 'open-question' && options.input) input = options.input
    else if (correctness === 'incorrect') input = 'Wrong Answer'

    cy.get('#answer-options').children().eq(0).type(input)
  }
})

Cypress.Commands.add('loginAnonymously', () => {
  cy.visit('/account/login')

  cy.intercept('POST', '/api/auth/sign-in/anonymous').as('signin')
  cy.get("button[data-auth-provider~='anonymous']").should('exist').and('be.visible').click()
  cy.wait('@signin')

  cy.getCookie('better-auth.session_token').should('exist')
  cy.get("img[aria-label='user avatar']", { timeout: 10 * 1000 })
    .should('exist')
    .should('be.visible')
})
