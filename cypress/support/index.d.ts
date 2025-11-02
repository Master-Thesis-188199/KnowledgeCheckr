/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace Cypress {
  interface Chainable<Subject = any> {
    skip(message?: string, skipCondition?: boolean): void
    login(email: string, password: string): void
    loginTestUser(): void
    signUp(username: string, email: string, password: string): void
    signOut(): void

    removeDBUser(email: string, username: string): void

    dragDrop(dragLocator: Cypress.Chainable<JQuery<HTMLElement>>, dropLocator: Cypress.Chainable<JQuery<HTMLElement>>): void

    //? response type assertion needed because Interception<any, any> translates to any when used within tests.
    waitServerAction<Response>(alias: string, callback: (body?: Response, response: { statusCode?: number }) => void): void
  }
}
