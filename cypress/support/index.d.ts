declare namespace Cypress {
  interface Chainable<Subject = any> {
    skip(message?: string, skipCondition?: boolean): void
  }
}
