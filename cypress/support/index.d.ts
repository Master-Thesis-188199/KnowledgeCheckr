declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Chainable<Subject = any> {
    skip(message?: string, skipCondition?: boolean): void
    login(email: string, password: string): void
    loginTestUser(): void
    signUp(username: string, email: string, password: string): void
    signOut(): void

    removeDBUser(email: string, username: string): void

    dragDrop(dragLocator: Cypress.Chainable<JQuery<HTMLElement>>, dropLocator: Cypress.Chainable<JQuery<HTMLElement>>): void
  }
}
