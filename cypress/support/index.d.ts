declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Chainable<Subject = any> {
    skip(message?: string, skipCondition?: boolean): void
    login(email: string, password: string): void
    signUp(username: string, email: string, password: string): void
    signOut(): void
  }
}
