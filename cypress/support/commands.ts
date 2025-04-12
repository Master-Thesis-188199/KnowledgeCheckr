/// <reference types="cypress" />
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
})

Cypress.Commands.add('signup', (username: string, email: string, password: string) => {
  if (!username || !email || !password) {
    cy.log('Skipping signup because username, email or password is not provided')
  }

  cy.visit('/account/login?type=signup')

  cy.get('input[name="name"]').filter(':visible').type(username)
  cy.get('input[name="email"]').filter(':visible').type(email)
  cy.get('input[name="password"]').filter(':visible').type(password)

  cy.get('button[type="submit"]').filter(':visible').click()
})
